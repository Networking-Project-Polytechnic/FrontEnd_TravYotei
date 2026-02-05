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
import { Plus, Edit2, Trash2, Clock, LayoutGrid, Calendar as CalendarIcon, Repeat } from "lucide-react"
import {
  getSchedulesByAgency,
  createScheduleScoped,
  createAssignmentScoped,
  updateScheduleScoped,
  deleteScheduleScoped,
  getRoutesByAgency,
  getBusesByAgency,
  Schedule,
  Route,
  Bus,
  getLocationsByAgency,
  Location,
  getDriversByAgency,
  Driver,
  getRoutePricesByAgency,
  RoutePrice,
  getAssignmentsByAgency,
  updateAssignmentScoped,
} from "@/lib/api"
import { BusSeatSimulation } from "@/components/BusSeatSimulation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"

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
    isRecurring: false,
    recurringDays: [] as number[], // 0 for Sunday, 1 for Monday, etc.
    weeksToRepeat: 1, // Default to 1 week
  })
  const [activeTab, setActiveTab] = useState("all")
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
        getRoutesByAgency(agencyId),
        getBusesByAgency(agencyId),
        getLocationsByAgency(agencyId),
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
      isRecurring: false,
      recurringDays: [],
      weeksToRepeat: 1,
    })
    setEditingId(null)
  }

  const safeToISOString = (dateStr: string, timeStr?: string) => {
    if (!dateStr && !timeStr) return ""

    // Try to parse the timeStr directly first
    let date = new Date(timeStr || dateStr)

    // If invalid and we have both date and time, try combining them
    if (isNaN(date.getTime()) && dateStr && timeStr) {
      // Ensure dateStr is YYYY-MM-DD and timeStr is HH:mm:ss
      date = new Date(`${dateStr.includes('T') ? dateStr.split('T')[0] : dateStr}T${timeStr}`)
    }

    if (isNaN(date.getTime())) return ""

    try {
      return date.toISOString().slice(0, 16)
    } catch (e) {
      return ""
    }
  }

  const handleOpen = (trip?: Schedule) => {
    if (trip) {
      setFormData({
        routeId: trip.routeid,
        busId: trip.busid,
        driverId: trip.driverid || "",
        priceId: trip.priceid || "",
        departureTime: safeToISOString(trip.date, trip.departuretime),
        arrivalTime: safeToISOString(trip.date, trip.arrivaltime),
        status: "SCHEDULED",
        isRecurring: false,
        recurringDays: [],
        weeksToRepeat: 1,
      })
      setEditingId(trip.scheduleid)
    } else {
      resetForm()
    }
    setOpen(true)
  }

  const DAYS = [
    { label: "M", full: "Monday", value: 1 },
    { label: "T", full: "Tuesday", value: 2 },
    { label: "W", full: "Wednesday", value: 3 },
    { label: "T", full: "Thursday", value: 4 },
    { label: "F", full: "Friday", value: 5 },
    { label: "S", full: "Saturday", value: 6 },
    { label: "S", full: "Sunday", value: 0 },
  ]

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

    const baseDate = new Date(formData.departureTime);
    if (isNaN(baseDate.getTime())) {
      alert("Please enter a valid departure time.");
      return;
    }

    // Determine dates to create
    const datesToCreate: string[] = [];
    if (!editingId && formData.isRecurring && formData.recurringDays.length > 0) {
      // Create for selected days across multiple weeks
      for (let week = 0; week < formData.weeksToRepeat; week++) {
        formData.recurringDays.forEach(dayValue => {
          const d = new Date(baseDate);
          // Adjust to the specific day of the week
          const currentDay = d.getDay();
          let diff = (dayValue - currentDay + 7) % 7;

          // If it's the current week (week 0) and the day is today or in the future, 'diff' is 0 to 6.
          // Add (week * 7) days to diff.
          d.setDate(d.getDate() + diff + (week * 7));

          const dateStr = d.toISOString().split('T')[0];
          // Avoid duplicates if baseDate happens to be one of the recurring days and week is 0
          if (!datesToCreate.includes(dateStr)) {
            datesToCreate.push(dateStr);
          }
        });
      }
    } else {
      datesToCreate.push(baseDate.toISOString().split('T')[0]);
    }

    try {
      for (const tripDate of datesToCreate) {
        // 1. Driver Uniqueness Check
        const driverConflict = trips.find(trip =>
          trip.scheduleid !== editingId &&
          trip.driverid === formData.driverId &&
          trip.date === tripDate
        );

        if (driverConflict) {
          console.warn(`Driver conflict on ${tripDate}, skipping.`);
          if (datesToCreate.length === 1) {
            alert(`Driver is already assigned to another trip on ${tripDate}.`);
            return;
          }
          continue;
        }

        // 2. Bus-Route Uniqueness Check
        const busRouteConflict = trips.find(trip =>
          trip.scheduleid !== editingId &&
          trip.busid === formData.busId &&
          trip.routeid === formData.routeId &&
          trip.date === tripDate
        );

        if (busRouteConflict) {
          console.warn(`Bus/Route conflict on ${tripDate}, skipping.`);
          if (datesToCreate.length === 1) {
            alert(`This bus is already scheduled for this route on ${tripDate}.`);
            return;
          }
          continue;
        }

        // Calculate actual departure/arrival for this specific date
        const dateObj = new Date(tripDate);
        const depTime = new Date(formData.departureTime);
        const arrTime = formData.arrivalTime ? new Date(formData.arrivalTime) : null;

        const finalDep = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate(), depTime.getHours(), depTime.getMinutes());
        const finalArr = arrTime ? new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate(), arrTime.getHours(), arrTime.getMinutes()) : null;

        const payload: Partial<Schedule> = {
          routeid: formData.routeId,
          busid: formData.busId,
          driverid: formData.driverId,
          priceid: formData.priceId,
          departuretime: finalDep.toISOString(),
          arrivaltime: finalArr?.toISOString() || "",
          date: tripDate,
          agencyid: agencyId,
        }

        if (editingId) {
          await updateScheduleScoped(agencyId, editingId, payload)
          // Assignment sync logic
          if (formData.driverId) {
            const assignments = await getAssignmentsByAgency(agencyId);
            const existingAssignment = assignments.find(a =>
              (a as any).scheduleId === editingId || (a as any).scheduleid === editingId
            );
            if (existingAssignment) {
              if (existingAssignment.driverId !== formData.driverId) {
                await updateAssignmentScoped(agencyId, existingAssignment.assignmentId, {
                  driverId: formData.driverId,
                  busId: formData.busId,
                  assignmentDate: finalDep.toISOString(),
                  agencyId: agencyId
                });
              }
            } else {
              await createAssignmentScoped(agencyId, {
                scheduleId: editingId,
                driverId: formData.driverId,
                busId: formData.busId,
                assignmentDate: finalDep.toISOString(),
                agencyId: agencyId
              });
            }
          }
        } else {
          const newSchedule = await createScheduleScoped(agencyId, payload);
          const scheduleId = (newSchedule as any).scheduleid || (newSchedule as any).scheduleId;

          if (formData.driverId && newSchedule && scheduleId) {
            try {
              await createAssignmentScoped(agencyId, {
                scheduleId: scheduleId,
                driverId: formData.driverId,
                busId: formData.busId,
                assignmentDate: finalDep.toISOString(),
                agencyId: agencyId
              });
            } catch (assignErr) {
              console.error("Failed to auto-create assignment:", assignErr);
            }
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

  const handleDeleteAll = async () => {
    if (trips.length === 0) return
    if (!confirm(`Are you sure you want to delete ALL ${trips.length} trips? This action cannot be undone.`)) return

    try {
      setLoading(true)
      // Delete sequentially to avoid overwhelming the server and handle dependencies better
      for (const trip of trips) {
        await deleteScheduleScoped(agencyId, trip.scheduleid)
      }
      await fetchAllData()
      alert("All trips deleted successfully.")
    } catch (err) {
      console.error("[TripManagement] Error deleting all trips:", err)
      alert("An error occurred while deleting all trips. Some trips might not have been deleted.")
      await fetchAllData()
    } finally {
      setLoading(false)
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
        <div className="flex items-center gap-2">
          {trips.length > 0 && (
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

                {!editingId && (
                  <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Repeat className="w-4 h-4 text-primary" />
                        <Label className="font-semibold cursor-pointer" htmlFor="isRecurring">Recurring Trip</Label>
                      </div>
                      <Checkbox
                        id="isRecurring"
                        checked={formData.isRecurring}
                        onCheckedChange={(checked) => setFormData({ ...formData, isRecurring: !!checked })}
                      />
                    </div>

                    {formData.isRecurring && (
                      <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                        <Label className="text-xs text-muted-foreground uppercase tracking-wider">Select Days</Label>
                        <div className="flex justify-between gap-1">
                          {DAYS.map((day) => (
                            <Button
                              key={day.value}
                              type="button"
                              variant={formData.recurringDays.includes(day.value) ? "default" : "outline"}
                              className="w-10 h-10 p-0 rounded-full text-xs font-bold"
                              onClick={() => {
                                const days = formData.recurringDays.includes(day.value)
                                  ? formData.recurringDays.filter(d => d !== day.value)
                                  : [...formData.recurringDays, day.value];
                                setFormData({ ...formData, recurringDays: days });
                              }}
                            >
                              {day.label}
                            </Button>
                          ))}
                        </div>

                        <div className="space-y-2 mt-4">
                          <Label htmlFor="weeksToRepeat" className="text-sm">Repeat For How Many Weeks?</Label>
                          <Select
                            value={String(formData.weeksToRepeat)}
                            onValueChange={(val) => setFormData({ ...formData, weeksToRepeat: parseInt(val) })}
                          >
                            <SelectTrigger id="weeksToRepeat">
                              <SelectValue placeholder="Select weeks" />
                            </SelectTrigger>
                            <SelectContent>
                              {[1, 2, 3, 4].map(w => (
                                <SelectItem key={w} value={String(w)}>{w} {w === 1 ? 'Week' : 'Weeks'}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                  </div>
                )}

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
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Trips</CardTitle>
              <CardDescription>Scheduled bus trips and their status</CardDescription>
            </div>
            <div className="flex items-center gap-2 bg-muted p-1 rounded-md">
              <CalendarIcon className="w-4 h-4 text-muted-foreground ml-2" />
              <Select value={activeTab} onValueChange={setActiveTab}>
                <SelectTrigger className="w-[180px] border-none bg-transparent shadow-none focus:ring-0">
                  <SelectValue placeholder="Filter by Day" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Days</SelectItem>
                  {DAYS.map(d => (
                    <SelectItem key={d.value} value={String(d.value)}>{d.full}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
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
                {trips
                  .filter(trip => activeTab === "all" || String(new Date(trip.date).getDay()) === activeTab)
                  .sort((a, b) => new Date(a.departuretime).getTime() - new Date(b.departuretime).getTime())
                  .map((trip) => (
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
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{new Date(trip.departuretime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          <span className="text-xs text-muted-foreground">{new Date(trip.date).toLocaleDateString()}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {trip.arrivaltime ? (
                          <div className="flex flex-col">
                            <span>{new Date(trip.arrivaltime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        ) : "—"}
                      </TableCell>
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
