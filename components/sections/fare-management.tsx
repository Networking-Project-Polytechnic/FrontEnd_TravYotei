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
import { API_BASE_URL } from "@/lib/config"

interface Fare {
  fare_id: string
  route_id: string
  bus_class: "STANDARD" | "VIP"
  price: number
  currency: string
  valid_from: string
  valid_to: string | null
  route?: {
    origin_city: string
    destination_city: string
  }
}

interface Route {
  route_id: string
  origin_city: string
  destination_city: string
}

export function FareManagement() {
  const [fares, setFares] = useState<Fare[]>([])
  const [routes, setRoutes] = useState<Route[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    routeId: "",
    busClass: "STANDARD" as "STANDARD" | "VIP",
    price: "",
    currency: "XAF",
    validFrom: new Date().toISOString().split("T")[0],
    validTo: "",
  })

  useEffect(() => {
    fetchFares()
    fetchRoutes()
  }, [])

  const fetchFares = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/fares`)
      if (!response.ok) throw new Error("Failed to fetch fares")
      const data = await response.json()
      setFares(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      console.error("[v0] Error fetching fares:", err)
    } finally {
      setLoading(false)
    }
  }

  const fetchRoutes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/routes`)
      if (!response.ok) throw new Error("Failed to fetch routes")
      const data = await response.json()
      setRoutes(data)
    } catch (err) {
      console.error("[v0] Error fetching routes:", err)
    }
  }

  const resetForm = () => {
    setFormData({
      routeId: "",
      busClass: "STANDARD",
      price: "",
      currency: "XAF",
      validFrom: new Date().toISOString().split("T")[0],
      validTo: "",
    })
    setEditingId(null)
  }

  const handleOpen = (fare?: Fare) => {
    if (fare) {
      setFormData({
        routeId: fare.route_id,
        busClass: fare.bus_class,
        price: fare.price.toString(),
        currency: fare.currency,
        validFrom: fare.valid_from,
        validTo: fare.valid_to || "",
      })
      setEditingId(fare.fare_id)
    } else {
      resetForm()
    }
    setOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const payload = {
        route_id: formData.routeId,
        bus_class: formData.busClass,
        price: Number.parseFloat(formData.price),
        currency: formData.currency,
        valid_from: formData.validFrom,
        valid_to: formData.validTo || null,
      }

      if (editingId) {
        const response = await fetch(`${API_BASE_URL}/fares/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        if (!response.ok) throw new Error("Failed to update fare")
      } else {
        const response = await fetch(`${API_BASE_URL}/fares`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        if (!response.ok) throw new Error("Failed to create fare")
      }

      await fetchFares()
      setOpen(false)
      resetForm()
    } catch (err) {
      console.error("[v0] Error saving fare:", err)
      alert("Failed to save fare. Please try again.")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this fare?")) return

    try {
      const response = await fetch(`${API_BASE_URL}/fares/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete fare")
      await fetchFares()
    } catch (err) {
      console.error("[v0] Error deleting fare:", err)
      alert("Failed to delete fare. Please try again.")
    }
  }

  const getRouteDisplay = (routeId: string) => {
    const route = routes.find((r) => r.route_id === routeId)
    return route ? `${route.origin_city} → ${route.destination_city}` : routeId
  }

  const isValidFare = (fare: Fare) => {
    const today = new Date().toISOString().split("T")[0]
    if (fare.valid_to) {
      return fare.valid_from <= today && today <= fare.valid_to
    }
    return fare.valid_from <= today
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
        <Button onClick={fetchFares}>Retry</Button>
      </div>
    )
  }

  const totalRevenue = fares.reduce((sum, fare) => sum + fare.price, 0)
  const activeFares = fares.filter(isValidFare).length

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
                      <SelectItem key={route.route_id} value={route.route_id}>
                        {route.origin_city} → {route.destination_city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="busClass">Bus Class *</Label>
                <Select
                  value={formData.busClass}
                  onValueChange={(value: "STANDARD" | "VIP") => setFormData({ ...formData, busClass: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STANDARD">Standard</SelectItem>
                    <SelectItem value="VIP">VIP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="validFrom">Valid From *</Label>
                  <Input
                    id="validFrom"
                    type="date"
                    value={formData.validFrom}
                    onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="validTo">Valid To</Label>
                  <Input
                    id="validTo"
                    type="date"
                    value={formData.validTo}
                    onChange={(e) => setFormData({ ...formData, validTo: e.target.value })}
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
            <p className="text-xs text-muted-foreground">{activeFares} currently active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Price</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {fares.length > 0 ? `${(totalRevenue / fares.length).toFixed(0)} XAF` : "—"}
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
            <div className="text-2xl font-bold">{fares.filter((f) => f.bus_class === "VIP").length}</div>
            <p className="text-xs text-muted-foreground">
              {fares.filter((f) => f.bus_class === "STANDARD").length} standard
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
                  <TableHead>Class</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Valid From</TableHead>
                  <TableHead>Valid To</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fares.map((fare) => (
                  <TableRow key={fare.fare_id}>
                    <TableCell className="font-medium">{getRouteDisplay(fare.route_id)}</TableCell>
                    <TableCell>
                      <Badge variant={fare.bus_class === "VIP" ? "default" : "secondary"}>{fare.bus_class}</Badge>
                    </TableCell>
                    <TableCell>
                      {fare.price.toFixed(2)} {fare.currency}
                    </TableCell>
                    <TableCell>{fare.valid_from}</TableCell>
                    <TableCell>{fare.valid_to || "—"}</TableCell>
                    <TableCell>
                      <Badge variant={isValidFare(fare) ? "default" : "outline"}>
                        {isValidFare(fare) ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleOpen(fare)} className="gap-1">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(fare.fare_id)}
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
