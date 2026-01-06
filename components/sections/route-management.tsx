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
import { Plus, Edit2, Trash2 } from "lucide-react"
import { createRoute, updateRoute, deleteRoute } from "@/lib/api"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Route {
  route_id: string
  origin_city: string
  destination_city: string
  distance_km: number
  estimated_duration_minutes: number
}

interface Location {
  location_id: string
  city_name: string
}

export function RouteManagement() {
  const [routes, setRoutes] = useState<Route[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    originCity: "",
    destinationCity: "",
    distance: "",
    duration: "",
    stops: [] as string[],
    stopInput: "",
  })

  // DUMMY DATA: Using mock data for development/testing
  const fetchRoutes = () => {
    try {
      setLoading(true)
      const mockLocations: Location[] = [
        { location_id: "1", city_name: "Nairobi" },
        { location_id: "2", city_name: "Mombasa" },
        { location_id: "3", city_name: "Kisumu" },
      ]

      const mockRoutes: Route[] = [
        {
          route_id: "1",
          origin_city: "Nairobi",
          destination_city: "Mombasa",
          distance_km: 480,
          estimated_duration_minutes: 540,
          // example stops
          // @ts-ignore
          stops: ["Thika", "Nanyuki"],
        },
        {
          route_id: "2",
          origin_city: "Nairobi",
          destination_city: "Kisumu",
          distance_km: 380,
          estimated_duration_minutes: 480,
          // @ts-ignore
          stops: ["Nakuru"],
        },
        {
          route_id: "3",
          origin_city: "Mombasa",
          destination_city: "Kisumu",
          distance_km: 600,
          estimated_duration_minutes: 720,
          // @ts-ignore
          stops: [],
        },
      ]

      setRoutes(mockRoutes)
      setLocations(mockLocations)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      console.error("[v0] Error loading dummy data:", err)
    } finally {
      setLoading(false)
    }
  }

  const fetchLocations = () => {
    // Locations are already loaded in fetchRoutes
  }

  useEffect(() => {
    fetchRoutes()
    fetchLocations()
  }, [])

  const resetForm = () => {
    setFormData({
      originCity: "",
      destinationCity: "",
      distance: "",
      duration: "",
      stops: [],
      stopInput: "",
    })
    setEditingId(null)
  }

  const handleOpen = (route?: Route) => {
    if (route) {
      setFormData({
        originCity: route.origin_city,
        destinationCity: route.destination_city,
        distance: route.distance_km?.toString() || "",
        duration: route.estimated_duration_minutes?.toString() || "",
        // @ts-ignore
        stops: (route as any).stops || [],
        stopInput: "",
      })
      setEditingId(route.route_id)
    } else {
      resetForm()
    }
    setOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const payload = {
        origin_city: formData.originCity,
        destination_city: formData.destinationCity,
        distance_km: formData.distance ? Number.parseFloat(formData.distance) : null,
        estimated_duration_minutes: formData.duration ? Number.parseInt(formData.duration) : null,
        stops: formData.stops,
      }

      if (editingId) {
        await updateRoute(editingId, payload)
      } else {
        await createRoute(payload)
      }

      await fetchRoutes()
      setOpen(false)
      resetForm()
    } catch (err) {
      console.error("[v0] Error saving route:", err)
      alert("Failed to save route. Please try again.")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this route?")) return

    try {
      const ok = await deleteRoute(id)
      if (!ok) throw new Error('Failed to delete route')
      await fetchRoutes()
    } catch (err) {
      console.error("[v0] Error deleting route:", err)
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
        <Button onClick={fetchRoutes}>Retry</Button>
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
                      <SelectItem key={location.location_id} value={location.city_name}>
                        {location.city_name}
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
                      <SelectItem key={location.location_id} value={location.city_name}>
                        {location.city_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="distance">Distance (km)</Label>
                  <Input
                    id="distance"
                    type="number"
                    step="0.1"
                    value={formData.distance}
                    onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                    placeholder="Optional"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Stops (optional)</Label>
                <div className="flex gap-2">
                  <Input
                    id="stopInput"
                    value={formData.stopInput}
                    onChange={(e) => setFormData({ ...formData, stopInput: e.target.value })}
                    placeholder="Enter stop city"
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      const v = formData.stopInput.trim()
                      if (!v) return
                      setFormData({ ...formData, stops: [...formData.stops, v], stopInput: "" })
                    }}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex gap-2 flex-wrap mt-2">
                  {formData.stops.map((s, idx) => (
                    <div key={idx} className="px-2 py-1 bg-muted rounded flex items-center gap-2">
                      <span className="text-sm">{s}</span>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, stops: formData.stops.filter((_, i) => i !== idx) })}
                        className="text-destructive"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
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
                  <TableHead>Stops</TableHead>
                  <TableHead>Distance</TableHead>
                  <TableHead>Est. Duration</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {routes.map((route) => (
                  <TableRow key={route.route_id}>
                    <TableCell className="font-medium">{route.origin_city}</TableCell>
                    <TableCell>{route.destination_city}</TableCell>
                    <TableCell>
                      {/* @ts-ignore */}
                      {(route as any).stops && (route as any).stops.length > 0 ? (
                        <div className="text-sm">{(route as any).stops.join(', ')}</div>
                      ) : (
                        <div className="text-sm text-muted-foreground">—</div>
                      )}
                    </TableCell>
                    <TableCell>{route.distance_km ? `${route.distance_km} km` : "—"}</TableCell>
                    <TableCell>
                      {route.estimated_duration_minutes
                        ? `${Math.floor(route.estimated_duration_minutes / 60)}h ${route.estimated_duration_minutes % 60}m`
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleOpen(route)} className="gap-1">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(route.route_id)}
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
    </div>
  )
}
