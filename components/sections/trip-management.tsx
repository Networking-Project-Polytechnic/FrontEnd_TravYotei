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
import {
  getSchedulesByAgency,
  createScheduleScoped,
  createAssignmentScoped,
  updateScheduleScoped,
  deleteScheduleScoped,
  getRoutes,
  getBuses,
  Schedule,
  Route,
  Bus,
  getLocations,
  Location,
  getDriversByAgency,
  Driver,
  getRoutePricesByAgency,
  RoutePrice,
} from "@/lib/api"
import { BusSeatSimulation } from "@/components/BusSeatSimulation"

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

export function TripManagement({ agencyId }: { agencyId: string }) {
  const [trips, setTrips] = useState<Schedule[]>([])
  const [routes, setRoutes] = useState<Route[]>([])
  const [buses, setBuses] = useState<Bus[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [prices, setPrices] = useState<RoutePrice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    routeId: "",
    busId: "",
    driverId: "",
    priceId: "",
    departureTime: "",
    arrivalTime: "",
    status: "SCHEDULED",
  })
  const [viewing3DDetails, setViewing3DDetails] = useState<{
    tripId: string;
    totalSeats: number;
    occupiedSeats: string[];
  } | null>(null)

  // Derived state for the selected price
  const selectedPrice = prices.find(
    p => p.routeId === formData.routeId && p.busId === formData.busId
  );

  const fetchAllData = async () => {
    try {
      setLoading(true)
      const [schedulesData, routesData, busesData, locationsData, driversData, pricesData] = await Promise.all([
        getSchedulesByAgency(agencyId),
        getRoutes(),
        getBuses(),
        getLocations(),
        getDriversByAgency(agencyId),
        getRoutePricesByAgency(agencyId),
      ])

      setTrips(schedulesData)
      setRoutes(routesData)
      setBuses(busesData)
      setLocations(locationsData)
      setDrivers(driversData)
      setPrices(pricesData)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      console.error("[TripManagement] Error loading data:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllData()
  }, [])

  // Auto-update priceId in formData when routeId or busId changes
  useEffect(() => {
    if (selectedPrice) {
      setFormData(prev => ({ ...prev, priceId: selectedPrice.priceId }));
    } else {
      setFormData(prev => ({ ...prev, priceId: "" }));
    }
  }, [selectedPrice?.priceId]); // Use specific ID dependency


  const resetForm = () => {
    setFormData({
      routeId: "",
      busId: "",
      driverId: "",
      priceId: "",
      departureTime: "",
      arrivalTime: "",
      status: "SCHEDULED",
    })
    setEditingId(null)
  }

  const handleOpen = (trip?: Schedule) => {
    if (trip) {
      setFormData({
        routeId: trip.routeid,
        busId: trip.busid,
        driverId: trip.driverid || "",
        priceId: trip.priceid || "",
        departureTime: new Date(trip.departuretime).toISOString().slice(0, 16),
        arrivalTime: trip.arrivaltime ? new Date(trip.arrivaltime).toISOString().slice(0, 16) : "",
        status: "SCHEDULED",
      })
      setEditingId(trip.scheduleid)
    } else {
      resetForm()
    }
    setOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.priceId) {
      alert("No valid price found for this Route and Bus combination. Please configure a fare first.")
      return;
    }

    if (!formData.driverId) {
      alert("Please select a driver.")
      return;
    }

    const tripDate = new Date(formData.departureTime).toISOString().split('T')[0];

    // 1. Driver Uniqueness Check (Max 1 trip per day)
    const driverConflict = trips.find(trip =>
      trip.scheduleid !== editingId &&
      trip.driverid === formData.driverId &&
      trip.date === tripDate
    );

    if (driverConflict) {
      alert(`Driver is already assigned to another trip on ${tripDate}.`);
      return;
    }

    // 2. Bus-Route Uniqueness Check (Max 1 specific route per day for this bus)
    const busRouteConflict = trips.find(trip =>
      trip.scheduleid !== editingId &&
      trip.busid === formData.busId &&
      trip.routeid === formData.routeId &&
      trip.date === tripDate
    );

    if (busRouteConflict) {
      alert(`This bus is already scheduled for this route on ${tripDate}.`);
      return;
    }

    try {
      const payload: Partial<Schedule> = {
        routeid: formData.routeId,
        busid: formData.busId,
        driverid: formData.driverId,
        priceid: formData.priceId,
        departuretime: formData.departureTime,
        arrivaltime: formData.arrivalTime || "",
        date: new Date(formData.departureTime).toISOString().split('T')[0], // Extract YYYY-MM-DD
        agencyid: agencyId,
      }

      if (editingId) {
        await updateScheduleScoped(agencyId, editingId, payload)
      } else {
        const newSchedule = await createScheduleScoped(agencyId, payload)

        // Auto-create assignment if driver is selected
        if (formData.driverId && newSchedule && newSchedule.scheduleid) {
          try {
            await createAssignmentScoped(agencyId, {
              scheduleId: newSchedule.scheduleid,
              driverId: formData.driverId,
              assignmentDate: newSchedule.date
            } as any);
          } catch (assignErr) {
            console.error("Failed to auto-create assignment:", assignErr);
            // Non-blocking error, user can assign manually later
          }
        }
      }

      await fetchAllData()
      setOpen(false)
      resetForm()
    } catch (err) {
      console.error("[TripManagement] Error saving trip:", err)
      alert("Failed to save trip. Please try again.")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this trip?")) return

    try {
      await deleteScheduleScoped(agencyId, id)
      await fetchAllData()
    } catch (err) {
      console.error("[TripManagement] Error deleting trip:", err)
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
                      <SelectItem key={route.routeid} value={route.routeid}>
                        {(() => {
                          const origin = locations.find(l => l.locationid === route.startlocationid)?.locationname || route.startlocationid;
                          const dest = locations.find(l => l.locationid === route.endlocationid)?.locationname || route.endlocationid;
                          return `${origin} → ${dest}`;
                        })()}
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
                      <SelectItem key={bus.busId} value={bus.busId}>
                        {bus.registrationNumber}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="driverId">Driver *</Label>
                <Select value={formData.driverId} onValueChange={(val) => setFormData({ ...formData, driverId: val })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select driver" />
                  </SelectTrigger>
                  <SelectContent>
                    {drivers.map((driver) => (
                      <SelectItem key={driver.driverId} value={driver.driverId}>
                        {driver.fullName} ({driver.licenseNumber})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Display Section */}
              <div className="space-y-2">
                <Label>Price *</Label>
                <div className="p-2 border rounded-md bg-muted/20">
                  {formData.routeId && formData.busId ? (
                    selectedPrice ? (
                      <span className="text-green-600 font-bold">
                        {selectedPrice.priceAmount} {selectedPrice.currency}
                      </span>
                    ) : (
                      <span className="text-destructive font-medium text-sm flex items-center gap-2">
                        ❌ No fare configured for this Route and Bus combination.
                      </span>
                    )
                  ) : (
                    <span className="text-muted-foreground text-sm">Select Route and Bus to see price</span>
                  )}
                </div>
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
              0
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Scheduled</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">{trips.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Delayed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-600">0</p>
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
                  <TableHead>Driver</TableHead>
                  <TableHead>Departure</TableHead>
                  <TableHead>Arrival</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trips.map((trip) => (
                  <TableRow key={trip.scheduleid}>
                    <TableCell className="font-medium">
                      {(() => {
                        const route = routes.find(r => r.routeid === trip.routeid);
                        if (!route) return "Unknown Route";
                        const origin = locations.find(l => l.locationid === route.startlocationid)?.locationname || route.startlocationid;
                        const dest = locations.find(l => l.locationid === route.endlocationid)?.locationname || route.endlocationid;
                        return `${origin} → ${dest}`;
                      })()}
                    </TableCell>
                    <TableCell>{buses.find(b => b.busId === trip.busid)?.registrationNumber || "Unknown"}</TableCell>
                    <TableCell>{drivers.find(d => d.driverId === trip.driverid)?.fullName || "Unknown"}</TableCell>
                    <TableCell>{new Date(trip.departuretime).toLocaleString()}</TableCell>
                    <TableCell>{trip.arrivaltime ? new Date(trip.arrivaltime).toLocaleString() : "—"}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor("SCHEDULED")}>Scheduled</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const bus = buses.find(b => b.busId === trip.busid);
                            setViewing3DDetails({
                              tripId: trip.scheduleid,
                              totalSeats: bus?.totalSeats || 64,
                              occupiedSeats: ["1A", "3B", "5C", "10D", "12A"] // Simulated data
                            });
                          }}
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
                          onClick={() => handleDelete(trip.scheduleid)}
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
