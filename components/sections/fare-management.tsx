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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit2, Trash2, DollarSign } from "lucide-react"
import {
  getRoutePrices as getFares,
  getRoutePricesByAgency,
  createRoutePrice as createFare,
  updateRoutePrice as updateFare,
  deleteRoutePrice as deleteFare,
  getRoutes,
  getRoutesByAgency,
  getBuses,
  getBusesByAgency,
  RoutePrice as Fare,
  Route,
  Bus,
  getLocations,
  getBusTypes,
  Location,
  BusType,
} from "@/lib/api"

export function FareManagement({ agencyId }: { agencyId: string }) {
  console.log("FareManagement initialized with agencyId:", agencyId);
  const [fares, setFares] = useState<Fare[]>([])
  const [routes, setRoutes] = useState<Route[]>([])
  const [buses, setBuses] = useState<Bus[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [busTypes, setBusTypes] = useState<BusType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    routeId: "",
    busId: "", // Changed from busClass to busId
    priceAmount: "", // Changed from price to priceAmount
    currency: "XAF",
  })

  const fetchAllData = async () => {
    try {
      setLoading(true)
      const [faresData, routesData, busesData, locationsData, busTypesData] = await Promise.all([
        getRoutePricesByAgency(agencyId),
        getRoutesByAgency(agencyId),
        getBusesByAgency(agencyId),
        getLocations(),
        getBusTypes(),
      ])
      setFares(faresData)
      setRoutes(routesData)
      setBuses(busesData)
      setLocations(locationsData)
      setBusTypes(busTypesData)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      console.error("[FareManagement] Error loading data:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllData()
  }, [])

  const resetForm = () => {
    setFormData({
      routeId: "",
      busId: "",
      priceAmount: "",
      currency: "XAF",
    })
    setEditingId(null)
  }

  const handleOpen = (fare?: Fare) => {
    if (fare) {
      setFormData({
        routeId: fare.routeId,
        busId: fare.busId,
        priceAmount: fare.priceAmount.toString(),
        currency: fare.currency,
      })
      setEditingId(fare.priceId)
    } else {
      resetForm()
    }
    setOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const payload: Partial<Fare> = {
        routeId: formData.routeId,
        busId: formData.busId,
        priceAmount: Number.parseFloat(formData.priceAmount),
        currency: formData.currency,
        agencyid: agencyId,
      }
      console.log("PAYLOAD V2 - Sending:", JSON.stringify(payload));

      // Check for duplicate fare
      const duplicate = fares.find(f =>
        f.priceId !== editingId &&
        f.routeId === payload.routeId &&
        f.busId === payload.busId
      );

      if (duplicate) {
        alert("A fare for this route and bus already exists.");
        return;
      }

      if (editingId) {
        await updateFare(editingId, payload)
      } else {
        await createFare(payload)
      }

      await fetchAllData()
      setOpen(false)
      resetForm()
    } catch (err) {
      console.error("[FareManagement] Error saving fare:", err)
      alert("Failed to save fare. Please try again.")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this fare?")) return

    try {
      await deleteFare(id)
      await fetchAllData()
    } catch (err) {
      console.error("[FareManagement] Error deleting fare:", err)
      alert("Failed to delete fare. Please try again.")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading fares...</p>
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

  const totalRevenue = fares.reduce((sum, fare) => sum + fare.priceAmount, 0)
  /* Removed VIP calculation as bus type is removed */
  const vipBusType = buses.find(b => b.busTypeId === "VIP_UUID_PLACEHOLDER"); // Adjust if there's a specific ID for VIP
  const vipFaresCount = fares.filter(fare => fare.busId === vipBusType?.busId).length;
  const standardFaresCount = fares.filter(fare => fare.busId !== vipBusType?.busId).length;



  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Fare Management</h2>
          <p className="text-muted-foreground mt-2">Manage pricing for different routes and bus classes</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpen()} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Fare
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Fare" : "Add New Fare"}</DialogTitle>
              <DialogDescription>
                {editingId ? "Update fare information" : "Enter the details of the new fare"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="routeId">Route *</Label>
                <Select
                  value={formData.routeId}
                  onValueChange={(value) => setFormData({ ...formData, routeId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a route" />
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
                <Select
                  value={formData.busId}
                  onValueChange={(value: string) => setFormData({ ...formData, busId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a bus" />
                  </SelectTrigger>
                  <SelectContent>
                    {buses.map((bus) => {
                      const busType = busTypes.find(t => t.busTypeId === bus.busTypeId);
                      return (
                        <SelectItem key={bus.busId} value={bus.busId}>
                          {bus.registrationNumber} ({busType?.busTypeName || bus.busTypeId})
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priceAmount">Price *</Label>
                  <Input
                    id="priceAmount"
                    type="number"
                    step="0.01"
                    value={formData.priceAmount}
                    onChange={(e) => setFormData({ ...formData, priceAmount: e.target.value })}
                    placeholder="e.g., 5000"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Input
                    id="currency"
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    placeholder="XAF"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">
                {editingId ? "Update Fare" : "Add Fare"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fares</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fares.length}</div>
            <p className="text-xs text-muted-foreground">Configured fares</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Price</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {fares.length > 0 ? `${(totalRevenue / fares.length).toFixed(0)} ${fares[0]?.currency || "XAF"}` : "—"}
            </div>
            <p className="text-xs text-muted-foreground">Across all routes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">VIP Fares</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vipFaresCount}</div>
            <p className="text-xs text-muted-foreground">
              {standardFaresCount} standard
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fare Overview</CardTitle>
          <CardDescription>{fares.length} fares configured in your system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Route</TableHead>
                  <TableHead>Bus</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fares.map((fare) => (
                  <TableRow key={fare.priceId}>
                    <TableCell className="font-medium">
                      {(() => {
                        const route = routes.find(r => r.routeid === fare.routeId);
                        if (!route) return "Unknown Route";
                        const origin = locations.find(l => l.locationid === route.startlocationid)?.locationname || route.startlocationid;
                        const dest = locations.find(l => l.locationid === route.endlocationid)?.locationname || route.endlocationid;
                        return `${origin} → ${dest}`;
                      })()}
                    </TableCell>

                    <TableCell>
                      {(() => {
                        const bus = buses.find(b => b.busId === fare.busId);
                        const typeName = busTypes.find(bt => bt.busTypeId === bus?.busTypeId)?.busTypeName;
                        return (
                          <div className="flex flex-col">
                            <span className="font-medium">{bus?.registrationNumber || "Unknown Bus"}</span>
                            <span className="text-xs text-muted-foreground">
                              {typeName || bus?.busTypeId || "Unknown Type"}
                            </span>
                          </div>
                        )
                      })()}
                    </TableCell>
                    <TableCell>
                      {fare.currency} {fare.priceAmount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleOpen(fare)} className="gap-1">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(fare.priceId)}
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
    </div >
  )
}
