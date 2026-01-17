"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit2, Trash2, Clock, LayoutGrid } from "lucide-react"
import { API_BASE_URL } from "@/lib/config"
import { BusSeatSimulation } from "@/components/BusSeatSimulation"

interface Trip {
  trip_id: string
  departure_time: string
  arrival_time: string | null
  status: string
  route: {
    origin_city: string
    destination_city: string
  }
  bus: {
    registration_number: string
  }
}

interface Route {
  route_id: string
  origin_city: string
  destination_city: string
}

interface Bus {
  bus_id: string
  registration_number: string
}

const TRIP_STATUSES = ["SCHEDULED", "DELAYED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]

const getStatusColor = (status: string) => {
  switch (status) {
    case "SCHEDULED":
      return "bg-blue-500"
    case "DELAYED":
      return "bg-yellow-500"
    case "IN_PROGRESS":
      return "bg-green-500"
    case "COMPLETED":
      return "bg-gray-500"
    case "CANCELLED":
      return "bg-red-500"
    default:
      return "bg-gray-500"
  }
}

export function TripManagement() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [routes, setRoutes] = useState<Route[]>([])
  const [buses, setBuses] = useState<Bus[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    routeId: "",
    busId: "",
    departureTime: "",
    arrivalTime: "",
    status: "SCHEDULED",
  })
  const [viewing3DDetails, setViewing3DDetails] = useState<{
    tripId: string;
    totalSeats: number;
    occupiedSeats: string[];
  } | null>(null)

  // DUMMY DATA: Using mock data for development/testing
  const fetchAllData = () => {
    try {
      setLoading(true)
      const mockRoutes: Route[] = [
        { route_id: "1", origin_city: "Nairobi", destination_city: "Mombasa" },
        { route_id: "2", origin_city: "Nairobi", destination_city: "Kisumu" },
      ]

      const mockBuses: Bus[] = [
        { bus_id: "1", registration_number: "KE-100-ABC" },
        { bus_id: "2", registration_number: "KE-101-XYZ" },
      ]

      const mockTrips: Trip[] = [
        {
          trip_id: "1",
          departure_time: "2024-01-15T08:00:00",
          arrival_time: "2024-01-15T17:00:00",
          status: "COMPLETED",
          route: mockRoutes[0],
          bus: mockBuses[0],
        },
        {
          trip_id: "2",
          departure_time: "2024-01-16T06:30:00",
          arrival_time: null,
          status: "IN_PROGRESS",
          route: mockRoutes[0],
          bus: mockBuses[1],
        },
        {
          trip_id: "3",
          departure_time: "2024-01-17T10:00:00",
          arrival_time: null,
          status: "SCHEDULED",
          route: mockRoutes[1],
          bus: mockBuses[0],
        },
      ]

      setTrips(mockTrips)
      setRoutes(mockRoutes)
      setBuses(mockBuses)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      console.error("[v0] Error loading dummy data:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllData()
  }, [])

  const resetForm = () => {
    setFormData({
      routeId: "",
      busId: "",
      departureTime: "",
      arrivalTime: "",
      status: "SCHEDULED",
    })
    setEditingId(null)
  }

  const handleOpen = (trip?: Trip) => {
    if (trip) {
      setFormData({
        routeId: "",
        busId: "",
        departureTime: new Date(trip.departure_time).toISOString().slice(0, 16),
        arrivalTime: trip.arrival_time ? new Date(trip.arrival_time).toISOString().slice(0, 16) : "",
        status: trip.status,
      })
      setEditingId(trip.trip_id)
    } else {
      resetForm()
    }
    setOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const payload = {
        route_id: formData.routeId,
        bus_id: formData.busId,
        departure_time: formData.departureTime,
        arrival_time: formData.arrivalTime || null,
        status: formData.status,
      }

      if (editingId) {
        const response = await fetch(`${API_BASE_URL}/trips/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, trip_id: editingId }),
        })
        if (!response.ok) throw new Error("Failed to update trip")
      } else {
        const response = await fetch(`${API_BASE_URL}/trips`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        if (!response.ok) throw new Error("Failed to create trip")
      }

      await fetchAllData()
      setOpen(false)
      resetForm()
    } catch (err) {
      console.error("[v0] Error saving trip:", err)
      alert("Failed to save trip. Please try again.")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this trip?")) return

    try {
      const response = await fetch(`${API_BASE_URL}/trips/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete trip")
      await fetchAllData()
    } catch (err) {
      console.error("[v0] Error deleting trip:", err)
      alert("Failed to delete trip. Please try again.")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading trips...</p>
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
          <h2 className="text-3xl font-bold text-foreground">Trip Management</h2>
          <p className="text-muted-foreground mt-2">Schedule and track bus trips</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpen()} className="gap-2">
              <Plus className="w-4 h-4" />
              Schedule Trip
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Trip" : "Schedule New Trip"}</DialogTitle>
              <DialogDescription>{editingId ? "Update trip information" : "Schedule a new bus trip"}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="routeId">Route *</Label>
                <Select value={formData.routeId} onValueChange={(val) => setFormData({ ...formData, routeId: val })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select route" />
                  </SelectTrigger>
                  <SelectContent>
                    {routes.map((route) => (
                      <SelectItem key={route.route_id} value={route.route_id}>
                        {route.origin_city} → {route.destination_city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="busId">Bus *</Label>
                <Select value={formData.busId} onValueChange={(val) => setFormData({ ...formData, busId: val })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select bus" />
                  </SelectTrigger>
                  <SelectContent>
                    {buses.map((bus) => (
                      <SelectItem key={bus.bus_id} value={bus.bus_id}>
                        {bus.registration_number}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="departureTime">Departure Time *</Label>
                  <Input
                    id="departureTime"
                    type="datetime-local"
                    value={formData.departureTime}
                    onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="arrivalTime">Arrival Time</Label>
                  <Input
                    id="arrivalTime"
                    type="datetime-local"
                    value={formData.arrivalTime}
                    onChange={(e) => setFormData({ ...formData, arrivalTime: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TRIP_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full">
                {editingId ? "Update Trip" : "Schedule Trip"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Total Trips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{trips.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              {trips.filter((t) => t.status === "IN_PROGRESS").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Scheduled</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">{trips.filter((t) => t.status === "SCHEDULED").length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Delayed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-600">{trips.filter((t) => t.status === "DELAYED").length}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Trips</CardTitle>
          <CardDescription>Scheduled bus trips and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Route</TableHead>
                  <TableHead>Bus</TableHead>
                  <TableHead>Departure</TableHead>
                  <TableHead>Arrival</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trips.map((trip) => (
                  <TableRow key={trip.trip_id}>
                    <TableCell className="font-medium">
                      {trip.route.origin_city} → {trip.route.destination_city}
                    </TableCell>
                    <TableCell>{trip.bus.registration_number}</TableCell>
                    <TableCell>{new Date(trip.departure_time).toLocaleString()}</TableCell>
                    <TableCell>{trip.arrival_time ? new Date(trip.arrival_time).toLocaleString() : "—"}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(trip.status)}>{trip.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setViewing3DDetails({
                            tripId: trip.trip_id,
                            totalSeats: 64, // Standard large bus
                            occupiedSeats: ["1A", "3B", "5C", "10D", "12A"] // Simulated data
                          })}
                          className="gap-1 text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50"
                        >
                          <LayoutGrid className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleOpen(trip)} className="gap-1">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(trip.trip_id)}
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

      <Dialog open={!!viewing3DDetails} onOpenChange={(open) => !open && setViewing3DDetails(null)}>
        <DialogContent className="max-w-5xl h-[80vh] flex flex-col p-0 overflow-hidden bg-slate-950 border-slate-800">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-white text-2xl">Trip Occupancy - 3D Simulation</DialogTitle>
            <DialogDescription className="text-slate-400">
              Real-time view of seat availability for trip #{viewing3DDetails?.tripId}
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 p-6">
            {viewing3DDetails && (
              <BusSeatSimulation
                totalSeats={viewing3DDetails.totalSeats}
                occupiedSeats={viewing3DDetails.occupiedSeats}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
