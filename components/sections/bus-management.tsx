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
import { CreatableSelect } from "@/components/ui/creatable-select"
import {
  getBusesByAgency,
  getBusById,
  getBusImages,
  createBusScoped,
  updateBusScoped,
  deleteBusScoped,
  getBusMakesByAgency,
  getBusModelsByAgency,
  getManufacturersByAgency,
  getFuelTypesByAgency,
  getTransmissionTypesByAgency,
  getBusTypesByAgency,
  getVehicleAmenitiesByAgency,
  getTransportablesByAgency,
  createBusMake,
  createBusModel,
  createManufacturer,
  createFuelType,
  createBusType,
  uploadToCloudinary,
  createBusImage,
  deleteFromCloudinary,
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
        getBusMakesByAgency(agencyId),
        getBusModelsByAgency(agencyId),
        getManufacturersByAgency(agencyId),
        getFuelTypesByAgency(agencyId),
        getTransmissionTypesByAgency(agencyId),
        getBusTypesByAgency(agencyId),
        getVehicleAmenitiesByAgency(agencyId),
        getTransportablesByAgency(agencyId)
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

        if (fullBus.images && fullBus.images.length > 0) {
          setImagePreviews(fullBus.images.map(img => img.imageUrl))
        } else {
          // Explicitly fetch if not included in bus details
          try {
            const imagesData = await getBusImages(fullBus.busId)
            setImagePreviews(imagesData.map(img => img.imageUrl))
          } catch (e) {
            console.error("Failed to fetch bus images:", e)
            setImagePreviews([])
          }
        }
      }
    } else {
      resetForm()
    }
    setOpen(true)
  }

  const handleCreateMake = async (inputValue: string) => {
    try {
      const newMake = await createBusMake({
        makeName: inputValue,
        agencyId: agencyId
      });
      const updatedMakes = await getBusMakesByAgency(agencyId);
      setMakes(updatedMakes);
      setFormData(prev => ({ ...prev, busMakeId: newMake.busMakeId }));
    } catch (err) {
      console.error("Failed to create make:", err);
      alert("Failed to create new Make.");
    }
  };

  const handleCreateBusModel = async (inputValue: string) => {
    try {
      const newModel = await createBusModel({ modelName: inputValue, agencyId });
      setModels(await getBusModelsByAgency(agencyId));
      setFormData(prev => ({ ...prev, busModelId: newModel.busModelId }));
    } catch (err) {
      console.error("Failed to create model:", err);
      alert("Failed to create new Model.");
    }
  };

  const handleCreateManufacturer = async (inputValue: string) => {
    try {
      const newMan = await createManufacturer({ manufacturerName: inputValue, agencyId });
      setManufacturers(await getManufacturersByAgency(agencyId));
      setFormData(prev => ({ ...prev, manufacturerId: newMan.manufacturerId }));
    } catch (err) {
      console.error("Failed to create manufacturer:", err);
      alert("Failed to create new Manufacturer.");
    }
  };

  const handleCreateFuelType = async (inputValue: string) => {
    try {
      const newFuel = await createFuelType({ fuelTypeName: inputValue, agencyId });
      setFuelTypes(await getFuelTypesByAgency(agencyId));
      setFormData(prev => ({ ...prev, fuelTypeId: newFuel.fuelTypeId }));
    } catch (err) {
      console.error("Failed to create fuel type:", err);
      alert("Failed to create new Fuel Type.");
    }
  };

  const handleCreateBusType = async (inputValue: string) => {
    try {
      const newType = await createBusType({ busTypeName: inputValue, agencyId });
      setBusTypes(await getBusTypesByAgency(agencyId));
      setFormData(prev => ({ ...prev, busTypeId: newType.busTypeId }));
    } catch (err) {
      console.error("Failed to create bus type:", err);
      alert("Failed to create new Bus Type.");
    }
  };

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

      // 1. Create/Update Bus (Metadata)
      let savedBus: Bus
      if (editingId) {
        savedBus = await updateBusScoped(agencyId, editingId, payload)
      } else {
        savedBus = await createBusScoped(agencyId, payload)
      }

      // 2. Upload Images to Cloudinary
      if (images.length > 0) {
        for (const imageFile of images) {
          if (imageFile instanceof File) {
            try {
              const cloudRes = await uploadToCloudinary(imageFile);
              await createBusImage({
                busId: savedBus.busId,
                imageUrl: cloudRes.secure_url,
                publicId: cloudRes.public_id,
                isPrimary: images.indexOf(imageFile) === 0,
                fileName: imageFile.name,
                contentType: imageFile.type,
                fileSize: imageFile.size
              });
            } catch (imgErr) {
              console.error("Failed to upload bus image:", imgErr);
            }
          }
        }
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
    if (!confirm("Are you sure you want to delete this bus? (Images will also be removed from Cloudinary)")) return

    try {
      // 1. Fetch images to get publicIds
      const images = await getBusImages(id)

      // 2. Delete from Cloudinary
      for (const img of images) {
        if (img.publicId) {
          await deleteFromCloudinary(img.publicId)
        }
      }

      // 3. Delete from backend
      const success = await deleteBusScoped(agencyId, id)
      if (!success) {
        throw new Error("Bus deletion failed in API (returned false)");
      }
      await fetchAll()
    } catch (err) {
      console.error("[BusManagement] Error deleting bus:", err)
      const errorMsg = "Unable to delete bus. It is likely assigned to active Trips, Assignments, or Route Prices. \n\nPlease remove these dependencies first.";
      alert(errorMsg);
    }
  }

  const handleDeleteAll = async () => {
    if (buses.length === 0) return
    if (!confirm(`Are you sure you want to delete ALL ${buses.length} buses? This action cannot be undone and will remove photos from Cloudinary.`)) return

    try {
      setLoading(true)
      for (const bus of buses) {
        try {
          const images = await getBusImages(bus.busId)
          for (const img of images) {
            if (img.publicId) await deleteFromCloudinary(img.publicId)
          }
          await deleteBusScoped(agencyId, bus.busId)
        } catch (singleErr) {
          console.error(`Failed to delete bus ${bus.busId}:`, singleErr)
        }
      }
      await fetchAll()
      alert("Bus deletion process completed. Note that some buses might still exist if they have active dependencies (Trips, etc).")
    } catch (err) {
      console.error("[BusManagement] Error in bulk delete:", err)
      alert("An error occurred during bulk deletion.")
      await fetchAll()
    } finally {
      setLoading(false)
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
        <div className="flex items-center gap-2">
          {buses.length > 0 && (
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="busTypeId">Bus Type *</Label>
                    <CreatableSelect
                      options={busTypes.map(t => ({ label: t.busTypeName, value: t.busTypeId }))}
                      value={formData.busTypeId}
                      onChange={(val) => setFormData({ ...formData, busTypeId: val })}
                      onCreate={handleCreateBusType}
                      placeholder="Select or Create Type"
                      searchPlaceholder="Search Type..."
                    />
                  </div>
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="busMakeId">Make *</Label>
                    <CreatableSelect
                      options={makes.map(m => ({ label: m.makeName, value: m.busMakeId }))}
                      value={formData.busMakeId}
                      onChange={(val) => setFormData({ ...formData, busMakeId: val })}
                      onCreate={handleCreateMake}
                      placeholder="Select or Create Make"
                      searchPlaceholder="Search Make..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="busModelId">Model *</Label>
                    <CreatableSelect
                      options={models.map(m => ({ label: m.modelName, value: m.busModelId }))}
                      value={formData.busModelId}
                      onChange={(val) => setFormData({ ...formData, busModelId: val })}
                      onCreate={handleCreateBusModel}
                      placeholder="Select or Create Model"
                      searchPlaceholder="Search Model..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="manufacturerId">Manufacturer *</Label>
                    <CreatableSelect
                      options={manufacturers.map(m => ({ label: m.manufacturerName, value: m.manufacturerId }))}
                      value={formData.manufacturerId}
                      onChange={(val) => setFormData({ ...formData, manufacturerId: val })}
                      onCreate={handleCreateManufacturer}
                      placeholder="Select or Create Manuf."
                      searchPlaceholder="Search Manufacturer..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fuelTypeId">Fuel Type *</Label>
                    <CreatableSelect
                      options={fuelTypes.map(f => ({ label: f.fuelTypeName, value: f.fuelTypeId }))}
                      value={formData.fuelTypeId}
                      onChange={(val) => setFormData({ ...formData, fuelTypeId: val })}
                      onCreate={handleCreateFuelType}
                      placeholder="Select or Create Fuel"
                      searchPlaceholder="Search Fuel..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
