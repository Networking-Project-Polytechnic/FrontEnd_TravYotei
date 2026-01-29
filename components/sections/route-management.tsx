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
  createRoute,
  updateRoute,
  deleteRoute,
  getLocations,
  Route,
  Location,
} from "@/lib/api"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


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
        getLocations(),
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const payload: Partial<Route> = {
        startlocationid: formData.originCity,
        endlocationid: formData.destinationCity,
        agencyid: agencyId,
        stopPoints: formData.stopPoints.split(",").map(s => s.trim()).filter(s => s.length > 0),
      }

      if (editingId) {
        await updateRoute(editingId, payload)
      } else {
        await createRoute(payload)
      }

      await fetchAllData()
      setOpen(false)
      resetForm()
    } catch (err) {
      console.error("[RouteManagement] Error saving route:", err)
      alert("Failed to save route. Please try again.")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this route?")) return

    try {
      await deleteRoute(id)
      await fetchAllData()
    } catch (err) {
      console.error("[RouteManagement] Error deleting route:", err)
      alert("Failed to delete route. Please try again.")
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
                <Select
                  value={formData.originCity}
                  onValueChange={(value) => setFormData({ ...formData, originCity: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select origin city" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location.locationid} value={location.locationid}>
                        {location.locationname}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="destinationCity">Destination City *</Label>
                <Select
                  value={formData.destinationCity}
                  onValueChange={(value) => setFormData({ ...formData, destinationCity: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select destination city" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location.locationid} value={location.locationid}>
                        {location.locationname}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
