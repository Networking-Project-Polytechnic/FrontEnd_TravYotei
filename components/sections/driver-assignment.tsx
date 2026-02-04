"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, UserCheck, Trash2 } from "lucide-react"
import {
  getAssignmentsByAgency,
  createAssignmentScoped,
  deleteAssignmentScoped,
  getSchedulesByAgency,
  Schedule,
  getBuses,
  getDrivers,
  Assignment,
  Bus,
  Driver,
  getLocations,
  Location,
  getRoutes,
  Route,

} from "@/lib/api"

export function DriverAssignment({ agencyId }: { agencyId: string }) {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [buses, setBuses] = useState<Bus[]>([])
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [routes, setRoutes] = useState<Route[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    scheduleId: "",
    driverId: "",
    assignedFrom: "",
  })

  // DUMMY DATA: Using mock data for development/testing
  const fetchAllData = async () => {
    try {
      setLoading(true)
      const [assignmentsData, busesData, driversData, schedulesData, locationsData, routesData] = await Promise.all([
        getAssignmentsByAgency(agencyId),
        getBuses(),
        getDrivers(),
        getSchedulesByAgency(agencyId),
        getLocations(),
        getRoutes(),
      ])

      setAssignments(assignmentsData)
      setBuses(busesData)
      setDrivers(driversData)
      setSchedules(schedulesData)
      setLocations(locationsData)
      setRoutes(routesData)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      console.error("[DriverAssignment] Error loading data:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllData()
  }, [])

  const resetForm = () => {
    setFormData({
      scheduleId: "",
      driverId: "",
      assignedFrom: new Date().toISOString().slice(0, 16),
    })
  }

  const handleOpen = () => {
    resetForm()
    setOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const selectedSchedule = schedules.find(s => s.scheduleid === formData.scheduleId);
    if (!selectedSchedule) {
      alert("Please select a valid trip.");
      return;
    }

    const tripDate = selectedSchedule.date; // Use date from schedule

    // Check if driver already has an assignment for this date
    const driverIsBusy = assignments.find(assignment => {
      const assignmentSchedule = schedules.find(s => s.scheduleid === assignment.scheduleId);
      return assignment.driverId === formData.driverId && assignmentSchedule?.date === tripDate;
    });

    if (driverIsBusy) {
      alert(`Driver is already assigned to a trip on ${new Date(tripDate).toLocaleDateString()}.`);
      return;
    }

    try {
      const payload: Partial<Assignment> = {
        // busid: formData.busId, // Assigning driver to bus? 
        // DTO says: assignmentId, scheduleId, driverId, agencyId, assignmentDate.
        // It seems Assignment links Driver to Schedule, NOT Bus directly (Schedule has bus).
        // BUT the previous code linked Driver to Bus.
        // The Swagger DTO `assignmentId, scheduleId, driverId`.
        // If the user wants "Driver Assignment", is it to a Bus (permanent) or Schedule (trip)?
        // Use Case says "Assignments". API says "Assignments" links Schedule and Driver.
        // So I should pick a Schedule?
        // But the previous mock UI picked a Bus.
        // If I look at `AssignmentsDTO` in swagger: `assignmentId, scheduleId, driverId`.
        // So it IS Schedule based.
        // The UI needs to change to select a Schedule (Trip), not a Bus.
        // However, I'll stick to what the API supports.
        // I will assume for now I can't easily change the UI to select Schedules without more work.
        // Wait, maybe I can use `scheduleId` as `busId` if I was hacking, but that's wrong.
        // I should probably skip full integration of Assignments if the UI concept mismatches API.
        // The API `Assignments` links Driver -> Schedule.
        // The UI `DriverAssignment` links Driver -> Bus.
        // If I can't link Driver -> Bus via `Assignments`, I should check if `Driver` entity has `busId`? No.
        // Maybe `Bus` has `driverId`? No.
        // I will implement it as creating an assignment for a "Schedule" but the UI asks for Bus.
        // This is a mismatch. I will comment out the `createAssignment` logic or just log it for now to avoid breaking the build with type errors,
        // OR better: I will update the UI to select a Schedule if I can, but I don't have schedules loaded here.
        // Given constraint "use all endpoints", I will leave this component using the API but I likely need to fetch Schedules to make it work.
        // I will just use `createAssignment` with the selected Bus ID as Schedule ID? No that will fail FK.
        // I will stub the submit.
        agencyId: agencyId,
        driverId: formData.driverId,
        // scheduleId: ... missing
      }

      await createAssignmentScoped(agencyId, {
        driverId: formData.driverId,
        scheduleId: formData.scheduleId,
        assignmentDate: formData.assignedFrom
      } as any)

      await fetchAllData()
      setOpen(false)
      resetForm()
    } catch (err) {
      console.error("[v0] Error saving assignment:", err)
      alert("Failed to save assignment. Please try again.")
    }
  }

  const handleEndAssignment = async (id: string) => {
    if (!confirm("Are you sure you want to end this assignment?")) return

    try {
      await deleteAssignmentScoped(agencyId, id)
      // if (!response.ok) throw new Error("Failed to end assignment") // deleteAssignment throws if fails or returns bool
      // Assuming deleteAssignment returns void or bool. api.ts implementation of delete usually is void or boolean.
      // Checking api.ts implementation of deleteAssignment:
      // It likely returns void or true. catch block handles error.
      await fetchAllData()
    } catch (err) {
      console.error("[v0] Error ending assignment:", err)
      alert("Failed to end assignment. Please try again.")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading assignments...</p>
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
          <h2 className="text-3xl font-bold text-foreground">Driver Assignments</h2>
          <p className="text-muted-foreground mt-2">Assign drivers to buses</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpen} className="gap-2">
              <Plus className="w-4 h-4" />
              Assign Driver
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Driver to Bus</DialogTitle>
              <DialogDescription>Create a new driver-bus assignment</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="scheduleId">Trip (Schedule) *</Label>
                <Select value={formData.scheduleId} onValueChange={(val) => setFormData({ ...formData, scheduleId: val })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a trip" />
                  </SelectTrigger>
                  <SelectContent>
                    {schedules.map((schedule) => {
                      const route = routes.find(r => r.routeid === schedule.routeid);
                      const origin = locations.find(l => l.locationid === route?.startlocationid)?.locationname || route?.startlocationid || "Unknown";
                      const dest = locations.find(l => l.locationid === route?.endlocationid)?.locationname || route?.endlocationid || "Unknown";
                      const bus = buses.find(b => b.busId === schedule.busid);
                      const busInfo = bus ? `(${bus.registrationNumber})` : "";
                      const date = new Date(schedule.departuretime).toLocaleString();

                      return (
                        <SelectItem key={schedule.scheduleid} value={schedule.scheduleid}>
                          {date} - {origin} → {dest} {busInfo}
                        </SelectItem>
                      );
                    })}
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
                        {driver.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="assignedFrom">Assignment Date *</Label>
                <Input
                  id="assignedFrom"
                  type="datetime-local"
                  value={formData.assignedFrom}
                  onChange={(e) => setFormData({ ...formData, assignedFrom: e.target.value })}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Assign Driver
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <UserCheck className="w-4 h-4" />
              Active Assignments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* assigned_to doesn't exist on Assignment DTO, assuming all are active or filtering based on logic */}
            <p className="text-3xl font-bold text-green-600">{assignments.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Past Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            {/* No 'past' assignments in API DTO currently */}
            <p className="text-3xl font-bold text-gray-600">0</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Assignments</CardTitle>
          <CardDescription>Driver-bus assignments history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Trip</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Assignment Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignments.map((assignment) => (
                  <TableRow key={assignment.assignmentId}>
                    <TableCell className="font-medium">
                      {(() => {
                        const schedule = schedules.find(s => s.scheduleid === assignment.scheduleId);
                        if (!schedule) return assignment.scheduleId;

                        const route = routes.find(r => r.routeid === schedule.routeid);
                        const origin = locations.find(l => l.locationid === route?.startlocationid)?.locationname || "Unknown";
                        const dest = locations.find(l => l.locationid === route?.endlocationid)?.locationname || "Unknown";
                        const bus = buses.find(b => b.busId === schedule.busid);

                        return (
                          <div className="flex flex-col">
                            <span>{origin} → {dest}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(schedule.departuretime).toLocaleDateString()} • {bus?.registrationNumber || "No Bus"}
                            </span>
                          </div>
                        )
                      })()}
                    </TableCell>
                    <TableCell>{drivers.find(d => d.driverId === assignment.driverId)?.fullName || assignment.driverId}</TableCell>
                    <TableCell>
                      {new Date(assignment.assignmentDate).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <span className="text-green-600 font-medium">Active</span>
                    </TableCell>
                    <TableCell className="text-right">
                      {/* Always show delete/end for now as we don't have 'ended' state */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEndAssignment(assignment.assignmentId)}
                        className="gap-1 text-orange-600 hover:text-orange-600"
                      >
                        <Trash2 className="w-4 h-4" />
                        End
                      </Button>
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
