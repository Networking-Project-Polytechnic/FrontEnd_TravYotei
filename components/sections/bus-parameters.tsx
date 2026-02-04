"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit2, Trash2, Settings2 } from "lucide-react"
import * as api from "@/lib/api"

export function BusParameters({ agencyId }: { agencyId: string }) {
    const [activeTab, setActiveTab] = useState("makes")
    const [data, setData] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [open, setOpen] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [formData, setFormData] = useState({ name: "", extra: "" })

    const configs: Record<string, any> = {
        makes: {
            title: "Bus Makes",
            fetch: () => api.getBusMakesByAgency(agencyId),
            create: (p: any) => api.createBusMakeScoped(agencyId, p),
            update: (id: string, p: any) => api.updateBusMakeScoped(agencyId, id, p),
            delete: (id: string) => api.deleteBusMakeScoped(agencyId, id),
            idField: "busMakeId",
            nameField: "makeName",
            label: "Make Name",
        },
        models: {
            title: "Bus Models",
            fetch: () => api.getBusModelsByAgency(agencyId),
            create: (p: any) => api.createBusModelScoped(agencyId, p),
            update: (id: string, p: any) => api.updateBusModelScoped(agencyId, id, p),
            delete: (id: string) => api.deleteBusModelScoped(agencyId, id),
            idField: "busModelId",
            nameField: "modelName",
            label: "Model Name",
        },
        manufacturers: {
            title: "Manufacturers",
            fetch: () => api.getManufacturersByAgency(agencyId),
            create: (p: any) => api.createManufacturerScoped(agencyId, p),
            update: (id: string, p: any) => api.updateManufacturerScoped(agencyId, id, p),
            delete: (id: string) => api.deleteManufacturerScoped(agencyId, id),
            idField: "manufacturerId",
            nameField: "manufacturerName",
            label: "Manufacturer Name",
        },
        fuel: {
            title: "Fuel Types",
            fetch: () => api.getFuelTypesByAgency(agencyId),
            create: (p: any) => api.createFuelTypeScoped(agencyId, p),
            update: (id: string, p: any) => api.updateFuelTypeScoped(agencyId, id, p),
            delete: (id: string) => api.deleteFuelTypeScoped(agencyId, id),
            idField: "fuelTypeId",
            nameField: "fuelTypeName",
            label: "Fuel Type Name",
        },
        transmission: {
            title: "Transmission Types",
            fetch: () => api.getTransmissionTypesByAgency(agencyId),
            create: (p: any) => api.createTransmissionTypeScoped(agencyId, p),
            update: (id: string, p: any) => api.updateTransmissionTypeScoped(agencyId, id, p),
            delete: (id: string) => api.deleteTransmissionTypeScoped(agencyId, id),
            idField: "transmissionTypeId",
            nameField: "typeName",
            label: "Transmission Type Name",
        },
        types: {
            title: "Bus Types",
            fetch: () => api.getBusTypesByAgency(agencyId),
            create: (p: any) => api.createBusTypeScoped(agencyId, p),
            update: (id: string, p: any) => api.updateBusTypeScoped(agencyId, id, p),
            delete: (id: string) => api.deleteBusTypeScoped(agencyId, id),
            idField: "busTypeId",
            nameField: "busTypeName",
            label: "Bus Type Name",
        },
        amenities: {
            title: "Amenities",
            fetch: () => api.getVehicleAmenitiesByAgency(agencyId),
            create: (p: any) => api.createVehicleAmenityScoped(agencyId, p),
            update: (id: string, p: any) => api.updateVehicleAmenityScoped(agencyId, id, p),
            delete: (id: string) => api.deleteVehicleAmenityScoped(agencyId, id),
            idField: "amenityId",
            nameField: "amenityName",
            label: "Amenity Name",
            hasDescription: true,
        },
        transportables: {
            title: "Transportables",
            fetch: () => api.getTransportablesByAgency(agencyId),
            create: (p: any) => api.createBusTransportableScoped(agencyId, p),
            update: (id: string, p: any) => api.updateBusTransportableScoped(agencyId, id, p),
            delete: (id: string) => api.deleteBusTransportableScoped(agencyId, id),
            idField: "transportId",
            nameField: "itemName",
            label: "Item Name",
            hasDescription: true,
        },
    }

    const currentConfig = configs[activeTab]

    const fetchData = async () => {
        try {
            setLoading(true)
            const res = await currentConfig.fetch()
            setData(res)
        } catch (err) {
            console.error(`Error fetching ${activeTab}:`, err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [activeTab])

    const handleOpen = (item?: any) => {
        if (item) {
            setEditingId(item[currentConfig.idField])
            setFormData({
                name: item[currentConfig.nameField],
                extra: item.description || ""
            })
        } else {
            setEditingId(null)
            setFormData({ name: "", extra: "" })
        }
        setOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const payload: any = { [currentConfig.nameField]: formData.name, agencyId: agencyId }
            if (currentConfig.hasDescription) {
                payload.description = formData.extra
            }
            if (editingId) {
                await currentConfig.update(editingId, payload)
            } else {
                await currentConfig.create(payload)
            }
            setOpen(false)
            fetchData()
        } catch (err) {
            alert("Failed to save parameter")
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return
        try {
            await currentConfig.delete(id)
            fetchData()
        } catch (err) {
            alert("Failed to delete")
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-foreground">Bus Parameters</h2>
                    <p className="text-muted-foreground mt-2">Manage bus configuration options</p>
                </div>
                <Button onClick={() => handleOpen()} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add {currentConfig.label.split(" ")[0]}
                </Button>
            </div>

            <Tabs value={activeTab} onValueChange={(val) => { setActiveTab(val); setData([]) }} className="w-full">
                <TabsList className="grid w-full grid-cols-4 md:grid-cols-8 h-auto gap-1">
                    <TabsTrigger value="makes">Makes</TabsTrigger>
                    <TabsTrigger value="models">Models</TabsTrigger>
                    <TabsTrigger value="manufacturers">Manuf.</TabsTrigger>
                    <TabsTrigger value="fuel">Fuel</TabsTrigger>
                    <TabsTrigger value="transmission">Trans.</TabsTrigger>
                    <TabsTrigger value="types">Types</TabsTrigger>
                    <TabsTrigger value="amenities">Amenities</TabsTrigger>
                    <TabsTrigger value="transportables">Cargo</TabsTrigger>
                </TabsList>

                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>{currentConfig.title}</CardTitle>
                        <CardDescription>List of all available {currentConfig.title.toLowerCase()}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <p>Loading...</p>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        {currentConfig.hasDescription && <TableHead>Description</TableHead>}
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.map((item) => (
                                        <TableRow key={item[currentConfig.idField]}>
                                            <TableCell className="font-medium">{item[currentConfig.nameField]}</TableCell>
                                            {currentConfig.hasDescription && (
                                                <TableCell className="max-w-xs truncate">{item.description || "—"}</TableCell>
                                            )}
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button variant="ghost" size="sm" onClick={() => handleOpen(item)}>
                                                        <Edit2 className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDelete(item[currentConfig.idField])}
                                                        className="text-destructive hover:text-destructive"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {data.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={2} className="text-center py-8 text-muted-foreground">
                                                No elements found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </Tabs>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingId ? "Edit" : "Add"} {currentConfig.label}</DialogTitle>
                        <DialogDescription>
                            Please enter the parameter name below.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="paramName">{currentConfig.label}</Label>
                            <Input
                                id="paramName"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        {currentConfig.hasDescription && (
                            <div className="space-y-2">
                                <Label htmlFor="paramDesc">Description</Label>
                                <Textarea
                                    id="paramDesc"
                                    value={formData.extra}
                                    onChange={(e) => setFormData({ ...formData, extra: e.target.value })}
                                    placeholder="Enter a description..."
                                    rows={3}
                                />
                            </div>
                        )}
                        <Button type="submit" className="w-full">
                            {editingId ? "Update" : "Create"}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
