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
  getLocationsByAgency,
  createLocation,
  updateLocation,
  deleteLocation,
  Location,
} from "@/lib/api"


export function LocationManagement({ agencyId }: { agencyId: string }) {
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    cityName: "",
  })

  // DUMMY DATA: Using mock location data for development/testing
  const fetchLocations = async () => {
    try {
      setLoading(true)
      const data = await getLocationsByAgency(agencyId)
      setLocations(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      console.error("[LocationManagement] Error loading data:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLocations()
  }, [])

  const resetForm = () => {
    setFormData({ cityName: "" })
    setEditingId(null)
  }

  const handleOpen = (location?: Location) => {
    if (location) {
      setFormData({
        cityName: location.locationname,
      })
      setEditingId(location.locationid)
    } else {
      resetForm()
    }
    setOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const payload: Partial<Location> = {
        locationname: formData.cityName,
        agencyid: agencyId,
      }

      // Check for duplicate location
      const duplicate = locations.find(l =>
        l.locationid !== editingId &&
        l.locationname.toLowerCase() === formData.cityName.toLowerCase()
      );

      if (duplicate) {
        alert("A location with this name already exists.");
        return;
      }

      if (editingId) {
        await updateLocation(editingId, payload)
      } else {
        await createLocation(payload)
      }

      await fetchLocations()
      setOpen(false)
      resetForm()
    } catch (err) {
      console.error("[LocationManagement] Error saving location:", err)
      alert("Failed to save location. Please try again.")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this location?")) return

    try {
      await deleteLocation(id)
      await fetchLocations()
    } catch (err) {
      console.error("[LocationManagement] Error deleting location:", err)
      alert("Failed to delete location. Please try again.")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading locations...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-destructive">Error: {error}</p>
        <Button onClick={fetchLocations}>Retry</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Location Management</h2>
          <p className="text-muted-foreground mt-2">Manage cities and locations for your routes</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpen()} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Location
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Location" : "Add New Location"}</DialogTitle>
              <DialogDescription>
                {editingId ? "Update location information" : "Enter the details of the new location"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cityName">City Name *</Label>
                <Input
                  id="cityName"
                  value={formData.cityName}
                  onChange={(e) => setFormData({ ...formData, cityName: e.target.value })}
                  placeholder="e.g., Douala"
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                {editingId ? "Update Location" : "Add Location"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Locations</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{locations.length}</div>
            <p className="text-xs text-muted-foreground">Cities in your network</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Location Overview</CardTitle>
          <CardDescription>{locations.length} locations in your system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>City</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {locations.map((location) => (
                  <TableRow key={location.locationid}>
                    <TableCell className="font-medium">{location.locationname}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleOpen(location)} className="gap-1">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(location.locationid)}
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
