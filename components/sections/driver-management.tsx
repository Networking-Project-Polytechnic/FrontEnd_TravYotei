"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit2, Trash2, User } from "lucide-react"
import {
  getDriversByAgency,
  createDriver,
  updateDriver,
  deleteDriver,
  uploadToCloudinary,
  createDriverImage,
  getPrimaryDriverImage,
  getDriverImages,
  deleteFromCloudinary,
  Driver,
} from "@/lib/api"

export function DriverManagement({ agencyId }: { agencyId: string }) {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    licenseNumber: "",
    description: "",
    photo: null as File | null,
  })
  const [isPhoneFocused, setIsPhoneFocused] = useState(false)

  const [currentPhotoUrl, setCurrentPhotoUrl] = useState<string | null>(null)

  const fetchDrivers = async () => {
    try {
      setLoading(true)
      const data = await getDriversByAgency(agencyId)
      setDrivers(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      console.error("[DriverManagement] Error loading data:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDrivers()
  }, [])

  const resetForm = () => {
    setFormData({ fullName: "", phone: "", licenseNumber: "", description: "", photo: null })
    setCurrentPhotoUrl(null)
    setEditingId(null)
  }

  const handleOpen = async (driver?: Driver) => {
    if (driver) {
      setFormData({
        fullName: driver.fullName,
        phone: driver.phone,
        licenseNumber: driver.licenseNumber,
        description: driver.description || "",
        photo: null,
      })
      setEditingId(driver.driverId)

      try {
        const image = await getPrimaryDriverImage(driver.driverId)
        if (image) {
          setCurrentPhotoUrl(image.imageUrl)
        } else {
          setCurrentPhotoUrl(null)
        }
      } catch (e) {
        console.warn("Failed to fetch driver image", e)
        setCurrentPhotoUrl(null)
      }
    } else {
      resetForm()
    }
    setOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const payload: Partial<Driver> = {
        fullName: formData.fullName,
        phone: formData.phone,
        licenseNumber: formData.licenseNumber,
        description: formData.description,
        agencyid: agencyId,
      }

      // 1. Create/Update Driver (Metadata only)
      let savedDriver: Driver
      if (editingId) {
        savedDriver = await updateDriver(editingId, payload)
      } else {
        savedDriver = await createDriver(payload)
      }

      // 2. If photo is selected, upload to Cloudinary and save metadata
      if (formData.photo) {
        // Validation (Frontend side)
        if (formData.photo instanceof File) {
          const cloudinaryRes = await uploadToCloudinary(formData.photo);

          await createDriverImage({
            driverId: savedDriver.driverId,
            imageUrl: cloudinaryRes.secure_url,
            publicId: cloudinaryRes.public_id,
            isPrimary: true,
            fileName: formData.photo.name,
            contentType: formData.photo.type,
            fileSize: formData.photo.size
          });
        }
      }

      await fetchDrivers()
      setOpen(false)
      resetForm()
    } catch (err) {
      console.error("[DriverManagement] Error saving driver:", err)
      alert("Failed to save driver. Please try again.")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this driver? (This will also remove their photo from Cloudinary)")) return

    try {
      // 1. Fetch images to get publicIds
      const images = await getDriverImages(id)

      // 2. Delete from Cloudinary
      for (const img of images) {
        if (img.publicId) {
          await deleteFromCloudinary(img.publicId)
        }
      }

      // 3. Delete from backend
      await deleteDriver(id)
      await fetchDrivers()
    } catch (err) {
      console.error("[DriverManagement] Error deleting driver:", err)
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
              <div className="space-y-2 relative group">
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 9) })}
                  onFocus={() => setIsPhoneFocused(true)}
                  onBlur={() => setIsPhoneFocused(false)}
                  placeholder="e.g., 681154869"
                  required
                  pattern="\d{9}"
                  title="Please enter exactly 9 digits"
                />
                {isPhoneFocused && (
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-3 rounded shadow-lg z-50 whitespace-nowrap">
                    9 digits only (e.g., 681154869)
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                  </div>
                )}
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
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Notes sur le chauffeur (expérience, spécialités...)"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="photo">Photo</Label>
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, photo: e.target.files ? e.target.files[0] : null })}
                />
                {formData.photo ? (
                  <img src={URL.createObjectURL(formData.photo)} alt="New photo" className="w-20 h-20 object-cover rounded mt-2" />
                ) : currentPhotoUrl ? (
                  <img src={currentPhotoUrl} alt="Current photo" className="w-20 h-20 object-cover rounded mt-2" />
                ) : null}
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
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {drivers.map((driver) => (
                  <TableRow key={driver.driverId}>
                    <TableCell className="font-medium">{driver.fullName}</TableCell>
                    <TableCell>{driver.phone}</TableCell>
                    <TableCell>{driver.licenseNumber}</TableCell>
                    <TableCell className="max-w-xs truncate">{driver.description || "—"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleOpen(driver)} className="gap-1">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(driver.driverId)}
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
