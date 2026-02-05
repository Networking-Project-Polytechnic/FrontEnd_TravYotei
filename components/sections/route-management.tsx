"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit2, Trash2, MapPin } from "lucide-react"
import {
  getRoutesByAgency,
  createRouteScoped,
  updateRouteScoped,
  deleteRouteScoped,
  getLocationsByAgency,
  createLocationScoped,
  getLocationByName,
  Route,
  Location,
} from "@/lib/api"
import { CreatableSelect } from "@/components/ui/creatable-select"
import * as turf from "@turf/turf"

const fetchCoordinates = async (cityName: string) => {
  try {
    const response = await fetch(`/api/proxy/nominatim?q=${encodeURIComponent(cityName)}`);
    const data = await response.json();
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
    }
    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
};

export function RouteManagement({ agencyId }: { agencyId: string }) {
  const [routes, setRoutes] = useState<Route[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    originCity: "",
    destinationCity: "",
    stopPoints: "",
  })

  const fetchAllData = async () => {
    try {
      setLoading(true)
      const [routesData, locationsData] = await Promise.all([
        getRoutesByAgency(agencyId),
        getLocationsByAgency(agencyId),
      ])
      setRoutes(routesData)
      setLocations(locationsData)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      console.error("[RouteManagement] Error loading data:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllData()
  }, [])

  const resetForm = () => {
    setFormData({
      originCity: "",
      destinationCity: "",
      stopPoints: "",
    })
    setEditingId(null)
  }

  const handleOpen = (route?: Route) => {
    if (route) {
      setFormData({
        originCity: route.startlocationid,
        destinationCity: route.endlocationid,
        stopPoints: route.stopPoints?.join(", ") || "",
      })
      setEditingId(route.routeid)
    } else {
      resetForm()
    }
    setOpen(true)
  }

  const handleCreateLocation = async (cityName: string, field: "originCity" | "destinationCity") => {
    try {
      // 1. Check if it already exists in our state (case-insensitive)
      const existing = locations.find(
        (l) => l.locationname.toLowerCase() === cityName.toLowerCase()
      )

      if (existing) {
        setFormData((prev) => ({ ...prev, [field]: existing.locationid }))
        return
      }

      // 2. Double check with backend just in case (optional but safer)
      const backendExists = await getLocationByName(cityName)
      if (backendExists) {
        setFormData((prev) => ({ ...prev, [field]: backendExists.locationid }))
        // Refresh state to include it if it was missing for some reason
        const updatedLocations = await getLocationsByAgency(agencyId)
        setLocations(updatedLocations)
        return
      }

      // 3. Create new location (without coordinates persistence as requested)
      const newLoc = await createLocationScoped(agencyId, {
        locationname: cityName,
        agencyid: agencyId,
      })

      // 4. Refresh and select
      const updatedLocations = await getLocationsByAgency(agencyId)
      setLocations(updatedLocations)
      setFormData((prev) => ({ ...prev, [field]: newLoc.locationid }))

    } catch (err) {
      console.error("Failed to create location from route management:", err)
      alert("Failed to create location.")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const stopPointsArray = formData.stopPoints.split(",").map(p => p.trim()).filter(p => p !== "");

      // --- Geospatial Validation using Nominatim-First Approach ---
      const getCoord = async (idOrName: string, isId: boolean) => {
        let name = isId ? locations.find(l => l.locationid === idOrName)?.locationname : idOrName;
        if (!name) return null;

        // 1. Try Nominatim first
        const liveCoords = await fetchCoordinates(name);
        if (liveCoords) return liveCoords;

        // 2. Fallback to local database if Nominatim fails
        const localLoc = isId
          ? locations.find(l => l.locationid === idOrName)
          : locations.find(l => l.locationname.toLowerCase() === idOrName.toLowerCase());

        if (localLoc?.latitude && localLoc?.longitude) {
          return { lat: localLoc.latitude, lng: localLoc.longitude };
        }
        return null;
      };

      const startCoord = await getCoord(formData.originCity, true);
      const endCoord = await getCoord(formData.destinationCity, true);

      if (!startCoord) {
        alert("Validation Error: Could not find coordinates for Origin City. Please check the name or enter coordinates manually in Locations.");
        return;
      }
      if (!endCoord) {
        alert("Validation Error: Could not find coordinates for Destination City. Please check the name or enter coordinates manually in Locations.");
        return;
      }

      const routeLine = turf.lineString([
        [startCoord.lng, startCoord.lat],
        [endCoord.lng, endCoord.lat]
      ]);

      for (const cityName of stopPointsArray) {
        const stopCoord = await getCoord(cityName, false);
        if (stopCoord) {
          const pt = turf.point([stopCoord.lng, stopCoord.lat]);
          const distance = turf.pointToLineDistance(pt, routeLine, { units: 'kilometers' });

          // Using 15km as a reasonable tolerance
          if (distance > 15) {
            const originName = locations.find(l => l.locationid === formData.originCity)?.locationname || "Origin";
            const destName = locations.find(l => l.locationid === formData.destinationCity)?.locationname || "Destination";
            alert(`Invalid stop point: "${cityName}" is too far (${Math.round(distance)}km) from the direct path between ${originName} and ${destName}.`);
            return;
          }
        } else {
          alert(`Validation Error: Could not find coordinates for stop point "${cityName}". Please check the spelling or enter coordinates manually in Locations.`);
          return;
        }
      }

      const payload: Partial<Route> = {
        startlocationid: formData.originCity,
        endlocationid: formData.destinationCity,
        agencyid: agencyId,
        stopPoints: stopPointsArray,
      }

      // Check for duplicate route (excluding current one if editing)
      const duplicate = routes.find(r =>
        r.routeid !== editingId &&
        r.startlocationid === payload.startlocationid &&
        r.endlocationid === payload.endlocationid
      );

      if (duplicate) {
        alert("A route between these locations already exists. Please choose a different origin or destination.");
        return;
      }

      if (editingId) {
        await updateRouteScoped(agencyId, editingId, payload)
      } else {
        await createRouteScoped(agencyId, payload)
      }

      await fetchAllData()
      setOpen(false)
      resetForm()
    } catch (err) {
      console.error("[RouteManagement] Error saving route:", err)
      const errorMessage = err instanceof Error ? err.message : "";
      if (errorMessage.includes("409") || errorMessage.toLowerCase().includes("already exists")) {
        alert("This route already exists in the system. Duplicate routes are not allowed.")
      } else {
        alert(err instanceof Error ? err.message : "Failed to save route. Please try again.")
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this route?")) return

    try {
      await deleteRouteScoped(agencyId, id)
      await fetchAllData()
    } catch (err) {
      console.error("[RouteManagement] Error deleting route:", err)
      alert("Failed to delete route. Please try again.")
    }
  }

  const handleDeleteAll = async () => {
    if (routes.length === 0) return
    if (!confirm(`Are you sure you want to delete ALL ${routes.length} routes? This action cannot be undone.`)) return

    try {
      setLoading(true)
      for (const route of routes) {
        await deleteRouteScoped(agencyId, route.routeid)
      }
      await fetchAllData()
      alert("All routes deleted successfully.")
    } catch (err) {
      console.error("[RouteManagement] Error deleting all routes:", err)
      alert("An error occurred while deleting all routes. Some routes might not have been deleted.")
      await fetchAllData()
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading routes...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-destructive">Error: {error}</p>
        <Button onClick={fetchAllData}>Retry</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Route Management</h2>
          <p className="text-muted-foreground mt-2">Manage travel routes between cities</p>
        </div>
        <div className="flex items-center gap-2">
          {routes.length > 0 && (
            <Button
              variant="outline"
              onClick={handleDeleteAll}
              className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4" />
              Delete All
            </Button>
          )}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpen()} className="gap-2">
                <Plus className="w-4 h-4" />
                Add Route
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Route" : "Add New Route"}</DialogTitle>
                <DialogDescription>
                  {editingId ? "Update route information" : "Enter the details of the new route"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="originCity">Origin City *</Label>
                  <CreatableSelect
                    options={locations.map((l) => ({ label: l.locationname, value: l.locationid }))}
                    value={formData.originCity}
                    onChange={(val) => setFormData({ ...formData, originCity: val })}
                    onCreate={(val) => handleCreateLocation(val, "originCity")}
                    placeholder="Select or create origin city"
                    searchPlaceholder="Search city..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destinationCity">Destination City *</Label>
                  <CreatableSelect
                    options={locations.map((l) => ({ label: l.locationname, value: l.locationid }))}
                    value={formData.destinationCity}
                    onChange={(val) => setFormData({ ...formData, destinationCity: val })}
                    onCreate={(val) => handleCreateLocation(val, "destinationCity")}
                    placeholder="Select or create destination city"
                    searchPlaceholder="Search city..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stopPoints">Stop Points (Optional)</Label>
                  <Input
                    id="stopPoints"
                    placeholder="Enter stop points separated by commas"
                    value={formData.stopPoints}
                    onChange={(e) => setFormData({ ...formData, stopPoints: e.target.value })}
                  />
                </div>

                <Button type="submit" className="w-full">
                  {editingId ? "Update Route" : "Add Route"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Route Overview</CardTitle>
          <CardDescription>{routes.length} routes in your system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Origin</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {routes.map((route) => (
                  <TableRow key={route.routeid}>
                    <TableCell className="font-medium">
                      {locations.find(l => l.locationid === route.startlocationid)?.locationname || "Unknown"}
                    </TableCell>
                    <TableCell>
                      {locations.find(l => l.locationid === route.endlocationid)?.locationname || "Unknown"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleOpen(route)} className="gap-1">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(route.routeid)}
                          className="gap-1 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div >
  )
}
