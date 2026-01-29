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
import {
  getBusesByAgency,
  getBusById,
  createBus,
  updateBus,
  deleteBus,
  getBusMakes,
  getBusModels,
  getManufacturers,
  getFuelTypes,
  getTransmissionTypes,
  getBusTypes,
  getVehicleAmenities,
  getBusTransportables,
  Bus,
  BusMake,
  BusModel,
  Manufacturer,
  FuelType,
  TransmissionType,
  BusType,
  BusAmenity,
  BusCanTransport,
  BusReview
} from "@/lib/api"

export function BusManagement({ agencyId }: { agencyId: string }) {
  const [buses, setBuses] = useState<Bus[]>([])
  const [makes, setMakes] = useState<BusMake[]>([])
  const [models, setModels] = useState<BusModel[]>([])
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([])
  const [fuelTypes, setFuelTypes] = useState<FuelType[]>([])
  const [transmissionTypes, setTransmissionTypes] = useState<TransmissionType[]>([])
  const [busTypes, setBusTypes] = useState<BusType[]>([])
  const [availableAmenities, setAvailableAmenities] = useState<BusAmenity[]>([])
  const [availableTransportables, setAvailableTransportables] = useState<BusCanTransport[]>([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    registrationNumber: "",
    registrationExpiryDate: "",
    totalSeats: "",
    busMakeId: "",
    busModelId: "",
    manufacturerId: "",
    fuelTypeId: "",
    transmissionTypeId: "",
    busTypeId: "",
    luggageCapacityKg: "",
    tankCapacityLiters: "",
    mileageKm: "",
    agencyId: agencyId, // From props
    amenities: [] as string[], // We will store IDs here
    canTransport: [] as string[], // We will store IDs here
  })

  const [currentReviews, setCurrentReviews] = useState<BusReview[]>([])

  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  // helper to set image previews
  const handleImageChange = (files: FileList | null) => {
    if (!files) return
    const arr = Array.from(files)
    setImages(arr)
    const previews = arr.map((f) => URL.createObjectURL(f))
    setImagePreviews(previews)
  }

  const fetchAll = async () => {
    try {
      setLoading(true)
      const [
        busesData,
        makesData,
        modelsData,
        manufacturersData,
        fuelTypesData,
        transmissionTypesData,
        busTypesData,
        amenitiesData,
        transportablesData
      ] = await Promise.all([
        getBusesByAgency(agencyId),
        getBusMakes(),
        getBusModels(),
        getManufacturers(),
        getFuelTypes(),
        getTransmissionTypes(),
        getBusTypes(),
        getVehicleAmenities(),
        getBusTransportables()
      ])

      setBuses(busesData)
      setMakes(makesData)
      setModels(modelsData)
      setManufacturers(manufacturersData)
      setFuelTypes(fuelTypesData)
      setTransmissionTypes(transmissionTypesData)
      setBusTypes(busTypesData)
      setAvailableAmenities(amenitiesData)
      setAvailableTransportables(transportablesData)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      console.error("[BusManagement] Error loading data:", err)
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
      registrationExpiryDate: "",
      totalSeats: "",
      busMakeId: "",
      busModelId: "",
      manufacturerId: "",
      fuelTypeId: "",
      transmissionTypeId: "",
      busTypeId: "",
      luggageCapacityKg: "",
      tankCapacityLiters: "",
      mileageKm: "",
      agencyId: agencyId,
      amenities: [],
      canTransport: [],
    })
    setEditingId(null)
    setCurrentReviews([])
    setImages([])
    setImagePreviews([])
  }

  const handleOpen = async (bus?: Bus) => {
    if (bus) {
      // Fetch full bus details to include reviews, etc.
      const fullBus = await getBusById(bus.busId)
      if (fullBus) {
        setFormData({
          registrationNumber: fullBus.registrationNumber,
          registrationExpiryDate: fullBus.registrationExpiryDate || "",
          totalSeats: fullBus.totalSeats?.toString() || "",
          busMakeId: fullBus.busMakeId,
          busModelId: fullBus.busModelId,
          manufacturerId: fullBus.manufacturerId,
          fuelTypeId: fullBus.fuelTypeId,
          transmissionTypeId: fullBus.transmissionTypeId,
          busTypeId: fullBus.busTypeId,
          luggageCapacityKg: fullBus.luggageCapacityKg?.toString() || "",
          tankCapacityLiters: fullBus.tankCapacityLiters?.toString() || "",
          mileageKm: fullBus.mileageKm?.toString() || "",
          agencyId: fullBus.agencyId,
          amenities: fullBus.amenities?.map(a => a.amenityId) || [],
          canTransport: fullBus.canTransport?.map(t => t.transportId) || [],
        })
        setEditingId(fullBus.busId)
        setCurrentReviews(fullBus.reviews || [])

        if (fullBus.images) {
          setImagePreviews(fullBus.images.map(img => img.imageUrl))
        }
      }
    } else {
      resetForm()
    }
    setOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const payload: Partial<Bus> = {
        registrationNumber: formData.registrationNumber,
        registrationExpiryDate: formData.registrationExpiryDate,
        totalSeats: Number.parseInt(formData.totalSeats),
        busMakeId: formData.busMakeId,
        busModelId: formData.busModelId,
        manufacturerId: formData.manufacturerId,
        fuelTypeId: formData.fuelTypeId,
        transmissionTypeId: formData.transmissionTypeId,
        busTypeId: formData.busTypeId,
        luggageCapacityKg: formData.luggageCapacityKg ? Number.parseFloat(formData.luggageCapacityKg) : 0,
        tankCapacityLiters: formData.tankCapacityLiters ? Number.parseFloat(formData.tankCapacityLiters) : 0,
        mileageKm: formData.mileageKm ? Number.parseFloat(formData.mileageKm) : 0,
        agencyId: formData.agencyId,
        // Map IDs back to objects for the API (if the API expects objects in the POST body)
        amenities: formData.amenities.map(id => ({
          amenityId: id,
          amenityName: availableAmenities.find(a => a.amenityId === id)?.amenityName || "",
          description: "",
          agencyId: formData.agencyId,
        })),
        canTransport: formData.canTransport.map(id => ({
          transportId: id,
          itemName: availableTransportables.find(t => t.transportId === id)?.itemName || "",
          description: "",
          agencyId: formData.agencyId,
        })),
      }

      if (editingId) {
        await updateBus(editingId, payload, images)
      } else {
        await createBus(payload, images)
      }

      await fetchAll()
      setOpen(false)
      resetForm()
    } catch (err) {
      console.error("[BusManagement] Error saving bus:", err)
      alert("Failed to save bus. Please try again.")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this bus?")) return

    try {
      await deleteBus(id)
      await fetchAll()
    } catch (err) {
      console.error("[BusManagement] Error deleting bus:", err)
      alert("Failed to delete bus. Please try again.")
    }
  }

  const toggleAmenity = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(id)
        ? prev.amenities.filter((a) => a !== id)
        : [...prev.amenities, id],
    }))
  }

  const toggleTransport = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      canTransport: prev.canTransport.includes(id)
        ? prev.canTransport.filter((i) => i !== id)
        : [...prev.canTransport, id],
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading fleet data...</p>
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

  // Helpers to get names from IDs
  const getMakeName = (id: string) => makes.find(m => m.busMakeId === id)?.makeName || id
  const getModelName = (id: string) => models.find(m => m.busModelId === id)?.modelName || id
  const getFuelName = (id: string) => fuelTypes.find(f => f.fuelTypeId === id)?.fuelTypeName || id
  const getTransmissionName = (id: string) => transmissionTypes.find(t => t.transmissionTypeId === id)?.typeName || id

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Fleet Management</h2>
          <p className="text-muted-foreground mt-2">Monitor and manage your vehicle fleet</p>
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
              <DialogTitle>{editingId ? "Edit Bus Details" : "Register New Bus"}</DialogTitle>
              <DialogDescription>
                {editingId ? "Modify bus specifications and status" : "Enter technical details for the new fleet entry"}
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
                  <Label htmlFor="registrationExpiryDate">Reg. Expiry Date</Label>
                  <Input
                    id="registrationExpiryDate"
                    type="date"
                    value={formData.registrationExpiryDate}
                    onChange={(e) => setFormData({ ...formData, registrationExpiryDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="totalSeats">Total Seats *</Label>
                  <Input
                    id="totalSeats"
                    type="number"
                    min="1"
                    value={formData.totalSeats}
                    onChange={(e) => setFormData({ ...formData, totalSeats: e.target.value })}
                    placeholder="e.g., 50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="busTypeId">Bus Type *</Label>
                  <Select value={formData.busTypeId} onValueChange={(val) => setFormData({ ...formData, busTypeId: val })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {busTypes.map((type) => (
                        <SelectItem key={type.busTypeId} value={type.busTypeId}>
                          {type.busTypeName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="busMakeId">Make *</Label>
                  <Select value={formData.busMakeId} onValueChange={(val) => setFormData({ ...formData, busMakeId: val })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select make" />
                    </SelectTrigger>
                    <SelectContent>
                      {makes.map((make) => (
                        <SelectItem key={make.busMakeId} value={make.busMakeId}>
                          {make.makeName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="busModelId">Model *</Label>
                  <Select value={formData.busModelId} onValueChange={(val) => setFormData({ ...formData, busModelId: val })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      {models.map((model) => (
                        <SelectItem key={model.busModelId} value={model.busModelId}>
                          {model.modelName}
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
                      {manufacturers.map((m) => (
                        <SelectItem key={m.manufacturerId} value={m.manufacturerId}>
                          {m.manufacturerName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fuelTypeId">Fuel Type *</Label>
                  <Select
                    value={formData.fuelTypeId}
                    onValueChange={(val) => setFormData({ ...formData, fuelTypeId: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select fuel" />
                    </SelectTrigger>
                    <SelectContent>
                      {fuelTypes.map((type) => (
                        <SelectItem key={type.fuelTypeId} value={type.fuelTypeId}>
                          {type.fuelTypeName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="transmissionTypeId">Transmission *</Label>
                  <Select
                    value={formData.transmissionTypeId}
                    onValueChange={(val) => setFormData({ ...formData, transmissionTypeId: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select transmission" />
                    </SelectTrigger>
                    <SelectContent>
                      {transmissionTypes.map((type) => (
                        <SelectItem key={type.transmissionTypeId} value={type.transmissionTypeId}>
                          {type.typeName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="luggageCapacityKg">Luggage (kg)</Label>
                  <Input
                    id="luggageCapacityKg"
                    type="number"
                    value={formData.luggageCapacityKg}
                    onChange={(e) => setFormData({ ...formData, luggageCapacityKg: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tankCapacityLiters">Tank (L)</Label>
                  <Input
                    id="tankCapacityLiters"
                    type="number"
                    value={formData.tankCapacityLiters}
                    onChange={(e) => setFormData({ ...formData, tankCapacityLiters: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mileageKm">Mileage (km)</Label>
                  <Input
                    id="mileageKm"
                    type="number"
                    value={formData.mileageKm}
                    onChange={(e) => setFormData({ ...formData, mileageKm: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t pt-4">
                <div className="space-y-2">
                  <Label>Amenities</Label>
                  <div className="grid grid-cols-1 gap-1 max-h-40 overflow-y-auto pr-2">
                    {availableAmenities.map((amenity) => (
                      <div key={amenity.amenityId} className="flex items-center space-x-2">
                        <Checkbox
                          id={`amenity-${amenity.amenityId}`}
                          checked={formData.amenities.includes(amenity.amenityId)}
                          onCheckedChange={() => toggleAmenity(amenity.amenityId)}
                        />
                        <label
                          htmlFor={`amenity-${amenity.amenityId}`}
                          className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {amenity.amenityName}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Can Transport</Label>
                  <div className="grid grid-cols-1 gap-1 max-h-40 overflow-y-auto pr-2">
                    {availableTransportables.map((item) => (
                      <div key={item.transportId} className="flex items-center space-x-2">
                        <Checkbox
                          id={`transport-${item.transportId}`}
                          checked={formData.canTransport.includes(item.transportId)}
                          onCheckedChange={() => toggleTransport(item.transportId)}
                        />
                        <label
                          htmlFor={`transport-${item.transportId}`}
                          className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {item.itemName}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2 border-t pt-4">
                <Label>Bus Images</Label>
                <div>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => document.getElementById('busImages')?.click()}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Upload Images</span>
                  </Button>
                  <input
                    id="busImages"
                    type="file"
                    accept="image/*"
                    multiple
                    style={{ display: 'none' }}
                    onChange={(e) => handleImageChange(e.target.files)}
                  />
                </div>

                {imagePreviews.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {imagePreviews.map((src, idx) => (
                      <img key={idx} src={src} alt={`preview-${idx}`} className="w-20 h-14 object-cover rounded border" />
                    ))}
                  </div>
                )}
              </div>

              {editingId && currentReviews.length > 0 && (
                <div className="space-y-2 border-t pt-4">
                  <Label>Recent Reviews</Label>
                  <div className="space-y-3">
                    {currentReviews.map((rev) => (
                      <div key={rev.reviewId} className="bg-muted/50 p-3 rounded-lg text-xs">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-bold">{rev.customerName}</span>
                          <span className="text-primary">★ {rev.rating}/5</span>
                        </div>
                        <p className="text-muted-foreground italic">"{rev.comment}"</p>
                        <p className="text-[10px] mt-1 text-right text-muted-foreground">
                          {new Date(rev.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full">
                {editingId ? "Update Bus Profile" : "Register Bus"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fleet Inventory</CardTitle>
          <CardDescription>Comprehensive list of vehicles in service</CardDescription>
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
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {buses.map((bus) => (
                  <TableRow key={bus.busId}>
                    <TableCell className="font-bold">{bus.registrationNumber}</TableCell>
                    <TableCell>
                      {getMakeName(bus.busMakeId)} {getModelName(bus.busModelId)}
                    </TableCell>
                    <TableCell>{bus.totalSeats}</TableCell>
                    <TableCell>{getFuelName(bus.fuelTypeId)}</TableCell>
                    <TableCell>{getTransmissionName(bus.transmissionTypeId)}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {bus.amenities?.slice(0, 2).map((a) => (
                          <span key={a.amenityId} className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                            {a.amenityName}
                          </span>
                        ))}
                        {bus.amenities && bus.amenities.length > 2 && (
                          <span className="text-[10px] text-muted-foreground">+{bus.amenities.length - 2}</span>
                        )}
                        {(!bus.amenities || bus.amenities.length === 0) && (
                          <span className="text-[10px] text-muted-foreground italic">None</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleOpen(bus)} title="Edit Details">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(bus.busId)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          title="Remove from Fleet"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {buses.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No vehicles registered in the system.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
