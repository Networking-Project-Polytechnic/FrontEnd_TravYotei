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
import { API_BASE_URL } from "@/lib/config"

interface Assignment {
  assignment_id: string
  assigned_from: string
  assigned_to: string | null
  bus: {
    registration_number: string
  }
  driver: {
    full_name: string
  }
}

interface Bus {
  bus_id: string
  registration_number: string
}

interface Driver {
  driver_id: string
  full_name: string
}

export function DriverAssignment() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [buses, setBuses] = useState<Bus[]>([])
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    busId: "",
    driverId: "",
    assignedFrom: "",
  })

  // DUMMY DATA: Using mock data for development/testing
  const fetchAllData = () => {
    try {
      setLoading(true)
      const mockBuses: Bus[] = [
        { bus_id: "1", registration_number: "KE-100-ABC" },
        { bus_id: "2", registration_number: "KE-101-XYZ" },
      ]

      const mockDrivers: Driver[] = [
        { driver_id: "1", full_name: "John Kariuki" },
        { driver_id: "2", full_name: "Jane Mwangi" },
      ]

      const mockAssignments: Assignment[] = [
        {
          assignment_id: "1",
          assigned_from: "2024-01-01",
          assigned_to: null,
          bus: mockBuses[0],
          driver: mockDrivers[0],
        },
        {
          assignment_id: "2",
          assigned_from: "2024-02-01",
          assigned_to: "2024-02-15",
          bus: mockBuses[1],
          driver: mockDrivers[1],
        },
      ]

      setAssignments(mockAssignments)
      setBuses(mockBuses)
      setDrivers(mockDrivers)
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
      busId: "",
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

    try {
      const payload = {
        bus_id: formData.busId,
        driver_id: formData.driverId,
        assigned_from: formData.assignedFrom,
      }

      const response = await fetch(`${API_BASE_URL}/driver-assignments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!response.ok) throw new Error("Failed to create assignment")

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
      const response = await fetch(`${API_BASE_URL}/driver-assignments/${id}/end`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assigned_to: new Date().toISOString() }),
      })
      if (!response.ok) throw new Error("Failed to end assignment")
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

              <div className="space-y-2">
                <Label htmlFor="driverId">Driver *</Label>
                <Select value={formData.driverId} onValueChange={(val) => setFormData({ ...formData, driverId: val })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select driver" />
                  </SelectTrigger>
                  <SelectContent>
                    {drivers.map((driver) => (
                      <SelectItem key={driver.driver_id} value={driver.driver_id}>
                        {driver.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="assignedFrom">Assignment Start *</Label>
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
            <p className="text-3xl font-bold text-green-600">{assignments.filter((a) => !a.assigned_to).length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Past Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-600">{assignments.filter((a) => a.assigned_to).length}</p>
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
                  <TableHead>Bus</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Assigned From</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignments.map((assignment) => (
                  <TableRow key={assignment.assignment_id}>
                    <TableCell className="font-medium">{assignment.bus.registration_number}</TableCell>
                    <TableCell>{assignment.driver.full_name}</TableCell>
                    <TableCell>{new Date(assignment.assigned_from).toLocaleString()}</TableCell>
                    <TableCell>
                      {assignment.assigned_to ? new Date(assignment.assigned_to).toLocaleString() : "—"}
                    </TableCell>
                    <TableCell>
                      {!assignment.assigned_to ? (
                        <span className="text-green-600 font-medium">Active</span>
                      ) : (
                        <span className="text-gray-600">Ended</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {!assignment.assigned_to && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEndAssignment(assignment.assignment_id)}
                          className="gap-1 text-orange-600 hover:text-orange-600"
                        >
                          <Trash2 className="w-4 h-4" />
                          End
                        </Button>
                      )}
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
