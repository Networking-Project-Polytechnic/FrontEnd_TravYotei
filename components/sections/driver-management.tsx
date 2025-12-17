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
import { Plus, Edit2, Trash2, CheckCircle, XCircle } from "lucide-react"
import { API_BASE_URL } from "@/lib/config"

interface Driver {
  driver_id: string
  full_name: string
  phone: string
  license_number: string
  license_expiry_date: string
  active: boolean
}

export function DriverManagement() {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    licenseNumber: "",
    licenseExpiry: "",
  })

  useEffect(() => {
    fetchDrivers()
  }, [])

  const fetchDrivers = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/drivers`)
      if (!response.ok) throw new Error("Failed to fetch drivers")
      const data = await response.json()
      setDrivers(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      console.error("[v0] Error fetching drivers:", err)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({ fullName: "", phone: "", licenseNumber: "", licenseExpiry: "" })
    setEditingId(null)
  }

  const handleOpen = (driver?: Driver) => {
    if (driver) {
      setFormData({
        fullName: driver.full_name,
        phone: driver.phone,
        licenseNumber: driver.license_number,
        licenseExpiry: driver.license_expiry_date,
      })
      setEditingId(driver.driver_id)
    } else {
      resetForm()
    }
    setOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const payload = {
        full_name: formData.fullName,
        phone: formData.phone,
        license_number: formData.licenseNumber,
        license_expiry_date: formData.licenseExpiry,
      }

      if (editingId) {
        const response = await fetch(`${API_BASE_URL}/drivers/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        if (!response.ok) throw new Error("Failed to update driver")
      } else {
        const response = await fetch(`${API_BASE_URL}/drivers`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        if (!response.ok) throw new Error("Failed to create driver")
      }

      await fetchDrivers()
      setOpen(false)
      resetForm()
    } catch (err) {
      console.error("[v0] Error saving driver:", err)
      alert("Failed to save driver. Please try again.")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this driver?")) return

    try {
      const response = await fetch(`${API_BASE_URL}/drivers/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete driver")
      await fetchDrivers()
    } catch (err) {
      console.error("[v0] Error deleting driver:", err)
      alert("Failed to delete driver. Please try again.")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading drivers...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-destructive">Error: {error}</p>
        <Button onClick={fetchDrivers}>Retry</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Driver Management</h2>
          <p className="text-muted-foreground mt-2">Manage your team of drivers</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpen()} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Driver
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Driver" : "Add New Driver"}</DialogTitle>
              <DialogDescription>
                {editingId ? "Update driver information" : "Enter the details of the new driver"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g., John Doe"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g., +1234567890"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="licenseNumber">License Number *</Label>
                <Input
                  id="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                  placeholder="e.g., DL-123456"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="licenseExpiry">License Expiry Date</Label>
                <Input
                  id="licenseExpiry"
                  type="date"
                  value={formData.licenseExpiry}
                  onChange={(e) => setFormData({ ...formData, licenseExpiry: e.target.value })}
                />
              </div>
              <Button type="submit" className="w-full">
                {editingId ? "Update Driver" : "Add Driver"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Driver Directory</CardTitle>
          <CardDescription>{drivers.length} drivers in your system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>License Number</TableHead>
                  <TableHead>License Expiry</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {drivers.map((driver) => (
                  <TableRow key={driver.driver_id}>
                    <TableCell className="font-medium">{driver.full_name}</TableCell>
                    <TableCell>{driver.phone}</TableCell>
                    <TableCell>{driver.license_number}</TableCell>
                    <TableCell>{driver.license_expiry_date || "N/A"}</TableCell>
                    <TableCell>
                      {driver.active ? (
                        <span className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-600">
                          <XCircle className="w-4 h-4" />
                          Inactive
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleOpen(driver)} className="gap-1">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(driver.driver_id)}
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
