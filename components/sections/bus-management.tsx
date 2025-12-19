"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
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

interface Bus {
  bus_id: string
  registration_number: string
  seat_count: number
  mileage_km: number
  in_service: boolean
  bus_make: { make_name: string }
  bus_model: { model_name: string }
  bus_manufacturer: { manufacturer_name: string }
  fuel_type: { fuel_type_name: string }
  transmission_type: { type_name: string }
  amenities: string[]
}

interface BusMake {
  bus_make_id: string
  make_name: string
}

interface BusModel {
  bus_model_id: string
  model_name: string
}

interface BusManufacturer {
  bus_manufacturer_id: string
  manufacturer_name: string
}

const AMENITIES = ["AC", "WIFI", "TV", "WC", "USB_CHARGING", "RECLINING_SEATS"]
const FUEL_TYPES = ["DIESEL", "PETROL", "ELECTRIC", "HYBRID"]
const TRANSMISSION_TYPES = ["MANUAL", "AUTOMATIC"]

export function BusManagement() {
  const [buses, setBuses] = useState<Bus[]>([])
  const [makes, setMakes] = useState<BusMake[]>([])
  const [models, setModels] = useState<BusModel[]>([])
  const [manufacturers, setManufacturers] = useState<BusManufacturer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    registrationNumber: "",
    seatCount: "",
    makeId: "",
    modelId: "",
    manufacturerId: "",
    fuelType: "",
    transmissionType: "",
    chassisNumber: "",
    luggage: "",
    fuelTank: "",
    mileage: "",
    amenities: [] as string[],
  })

  // DUMMY DATA: Using mock data for development/testing
  const fetchAll = () => {
    try {
      setLoading(true)
      // Mock bus makes data
      const mockMakes: BusMake[] = [
        { bus_make_id: "1", make_name: "Volvo" },
        { bus_make_id: "2", make_name: "Mercedes" },
        { bus_make_id: "3", make_name: "Scania" },
      ]

      // Mock bus models data
      const mockModels: BusModel[] = [
        { bus_model_id: "1", model_name: "B11R" },
        { bus_model_id: "2", model_name: "Sprinter" },
        { bus_model_id: "3", model_name: "K440" },
      ]

      // Mock bus manufacturers data
      const mockManufacturers: BusManufacturer[] = [
        { bus_manufacturer_id: "1", manufacturer_name: "Volvo Buses" },
        { bus_manufacturer_id: "2", manufacturer_name: "Daimler" },
        { bus_manufacturer_id: "3", manufacturer_name: "Scania AB" },
      ]

      // Mock buses data
      const mockBuses: Bus[] = [
        {
          bus_id: "1",
          registration_number: "KE-100-ABC",
          seat_count: 50,
          mileage_km: 15000,
          in_service: true,
          bus_make: mockMakes[0],
          bus_model: mockModels[0],
          bus_manufacturer: mockManufacturers[0],
          fuel_type: { fuel_type_name: "DIESEL" },
          transmission_type: { type_name: "MANUAL" },
          amenities: ["AC", "WIFI", "USB_CHARGING"],
        },
        {
          bus_id: "2",
          registration_number: "KE-101-XYZ",
          seat_count: 45,
          mileage_km: 8500,
          in_service: true,
          bus_make: mockMakes[1],
          bus_model: mockModels[1],
          bus_manufacturer: mockManufacturers[1],
          fuel_type: { fuel_type_name: "DIESEL" },
          transmission_type: { type_name: "AUTOMATIC" },
          amenities: ["AC", "TV", "WC", "RECLINING_SEATS"],
        },
      ]

      setBuses(mockBuses)
      setMakes(mockMakes)
      setModels(mockModels)
      setManufacturers(mockManufacturers)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      console.error("[v0] Error loading dummy data:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAll()
  }, [])

  const resetForm = () => {
    setFormData({
      registrationNumber: "",
      seatCount: "",
      makeId: "",
      modelId: "",
      manufacturerId: "",
      fuelType: "",
      transmissionType: "",
      chassisNumber: "",
      luggage: "",
      fuelTank: "",
      mileage: "",
      amenities: [],
    })
    setEditingId(null)
  }

  const handleOpen = (bus?: Bus) => {
    if (bus) {
      setFormData({
        registrationNumber: bus.registration_number,
        seatCount: bus.seat_count.toString(),
        makeId: "",
        modelId: "",
        manufacturerId: "",
        fuelType: bus.fuel_type.fuel_type_name,
        transmissionType: bus.transmission_type.type_name,
        chassisNumber: "",
        luggage: "",
        fuelTank: "",
        mileage: bus.mileage_km.toString(),
        amenities: bus.amenities || [],
      })
      setEditingId(bus.bus_id)
    } else {
      resetForm()
    }
    setOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const payload = {
        registration_number: formData.registrationNumber,
        seat_count: Number.parseInt(formData.seatCount),
        bus_make_id: formData.makeId,
        bus_model_id: formData.modelId,
        bus_manufacturer_id: formData.manufacturerId,
        fuel_type: formData.fuelType,
        transmission_type: formData.transmissionType,
        chassis_number: formData.chassisNumber,
        luggage_capacity_kg: formData.luggage ? Number.parseFloat(formData.luggage) : null,
        fuel_tank_capacity_l: formData.fuelTank ? Number.parseFloat(formData.fuelTank) : null,
        mileage_km: formData.mileage ? Number.parseFloat(formData.mileage) : 0,
        amenities: formData.amenities,
      }

      if (editingId) {
        const response = await fetch(`${API_BASE_URL}/buses/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        if (!response.ok) throw new Error("Failed to update bus")
      } else {
        const response = await fetch(`${API_BASE_URL}/buses`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        if (!response.ok) throw new Error("Failed to create bus")
      }

      await fetchAll()
      setOpen(false)
      resetForm()
    } catch (err) {
      console.error("[v0] Error saving bus:", err)
      alert("Failed to save bus. Please try again.")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this bus?")) return

    try {
      const response = await fetch(`${API_BASE_URL}/buses/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete bus")
      await fetchAll()
    } catch (err) {
      console.error("[v0] Error deleting bus:", err)
      alert("Failed to delete bus. Please try again.")
    }
  }

  const toggleAmenity = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading buses...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-destructive">Error: {error}</p>
        <Button onClick={fetchAll}>Retry</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Bus Fleet Management</h2>
          <p className="text-muted-foreground mt-2">Manage your fleet with detailed specifications</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpen()} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Bus
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Bus" : "Add New Bus"}</DialogTitle>
              <DialogDescription>
                {editingId ? "Update bus information" : "Enter the details of the new bus"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="registrationNumber">Registration Number *</Label>
                  <Input
                    id="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                    placeholder="e.g., KE-100-ABC"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seatCount">Seat Count *</Label>
                  <Input
                    id="seatCount"
                    type="number"
                    min="10"
                    value={formData.seatCount}
                    onChange={(e) => setFormData({ ...formData, seatCount: e.target.value })}
                    placeholder="e.g., 50"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="makeId">Bus Make *</Label>
                  <Select value={formData.makeId} onValueChange={(val) => setFormData({ ...formData, makeId: val })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select make" />
                    </SelectTrigger>
                    <SelectContent>
                      {makes.map((make) => (
                        <SelectItem key={make.bus_make_id} value={make.bus_make_id}>
                          {make.make_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="modelId">Bus Model *</Label>
                  <Select value={formData.modelId} onValueChange={(val) => setFormData({ ...formData, modelId: val })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      {models.map((model) => (
                        <SelectItem key={model.bus_model_id} value={model.bus_model_id}>
                          {model.model_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="manufacturerId">Manufacturer *</Label>
                  <Select
                    value={formData.manufacturerId}
                    onValueChange={(val) => setFormData({ ...formData, manufacturerId: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select manufacturer" />
                    </SelectTrigger>
                    <SelectContent>
                      {manufacturers.map((manufacturer) => (
                        <SelectItem key={manufacturer.bus_manufacturer_id} value={manufacturer.bus_manufacturer_id}>
                          {manufacturer.manufacturer_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fuelType">Fuel Type *</Label>
                  <Select
                    value={formData.fuelType}
                    onValueChange={(val) => setFormData({ ...formData, fuelType: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select fuel type" />
                    </SelectTrigger>
                    <SelectContent>
                      {FUEL_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="transmissionType">Transmission *</Label>
                  <Select
                    value={formData.transmissionType}
                    onValueChange={(val) => setFormData({ ...formData, transmissionType: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select transmission" />
                    </SelectTrigger>
                    <SelectContent>
                      {TRANSMISSION_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="chassisNumber">Chassis Number</Label>
                  <Input
                    id="chassisNumber"
                    value={formData.chassisNumber}
                    onChange={(e) => setFormData({ ...formData, chassisNumber: e.target.value })}
                    placeholder="Optional"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mileage">Mileage (km)</Label>
                  <Input
                    id="mileage"
                    type="number"
                    value={formData.mileage}
                    onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="luggage">Luggage Capacity (kg)</Label>
                  <Input
                    id="luggage"
                    type="number"
                    value={formData.luggage}
                    onChange={(e) => setFormData({ ...formData, luggage: e.target.value })}
                    placeholder="Optional"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fuelTank">Fuel Tank (liters)</Label>
                  <Input
                    id="fuelTank"
                    type="number"
                    value={formData.fuelTank}
                    onChange={(e) => setFormData({ ...formData, fuelTank: e.target.value })}
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Amenities</Label>
                <div className="grid grid-cols-3 gap-3">
                  {AMENITIES.map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <Checkbox
                        id={amenity}
                        checked={formData.amenities.includes(amenity)}
                        onCheckedChange={() => toggleAmenity(amenity)}
                      />
                      <label
                        htmlFor={amenity}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {amenity.replace(/_/g, " ")}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full">
                {editingId ? "Update Bus" : "Add Bus"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fleet Overview</CardTitle>
          <CardDescription>{buses.length} buses in your system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Registration</TableHead>
                  <TableHead>Make/Model</TableHead>
                  <TableHead>Seats</TableHead>
                  <TableHead>Fuel</TableHead>
                  <TableHead>Transmission</TableHead>
                  <TableHead>Amenities</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {buses.map((bus) => (
                  <TableRow key={bus.bus_id}>
                    <TableCell className="font-medium">{bus.registration_number}</TableCell>
                    <TableCell>
                      {bus.bus_make.make_name} {bus.bus_model.model_name}
                    </TableCell>
                    <TableCell>{bus.seat_count}</TableCell>
                    <TableCell>{bus.fuel_type.fuel_type_name}</TableCell>
                    <TableCell>{bus.transmission_type.type_name}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {bus.amenities?.slice(0, 3).map((amenity) => (
                          <span key={amenity} className="text-xs bg-muted px-2 py-1 rounded">
                            {amenity}
                          </span>
                        ))}
                        {bus.amenities?.length > 3 && (
                          <span className="text-xs text-muted-foreground">+{bus.amenities.length - 3}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {bus.in_service ? (
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
                        <Button variant="ghost" size="sm" onClick={() => handleOpen(bus)} className="gap-1">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(bus.bus_id)}
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
