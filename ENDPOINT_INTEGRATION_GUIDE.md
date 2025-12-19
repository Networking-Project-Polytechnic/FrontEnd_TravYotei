# Endpoint Integration Guide

This guide explains how to transition from dummy data to real API endpoints in the management sections.

## Overview

All section components in `components/sections/` currently use **dummy data** for development and testing. Once your backend API is ready, you can easily switch to real endpoints by uncommenting the API calls and commenting out the dummy data.

## File Location Map

Each section file corresponds to specific API endpoints:

| Section File | Component | Dummy Data | API Endpoints |
|---|---|---|---|
| `bus-management.tsx` | BusManagement | ✅ Implemented | See Bus Management |
| `driver-management.tsx` | DriverManagement | ✅ Implemented | See Driver Management |
| `driver-assignment.tsx` | DriverAssignment | ✅ Implemented | See Driver Assignment |
| `fare-management.tsx` | FareManagement | ✅ Implemented | See Fare Management |
| `location-management.tsx` | LocationManagement | ✅ Implemented | See Location Management |
| `route-management.tsx` | RouteManagement | ✅ Implemented | See Route Management |
| `trip-management.tsx` | TripManagement | ✅ Implemented | See Trip Management |

---

## Bus Management

**File:** `components/sections/bus-management.tsx`

### API Endpoints Needed

```
GET    /api/buses                    - Fetch all buses
POST   /api/buses                    - Create new bus
PUT    /api/buses/{bus_id}           - Update bus details
DELETE /api/buses/{bus_id}           - Delete a bus

GET    /api/bus-makes                - Fetch all bus makes
GET    /api/bus-models               - Fetch all bus models
GET    /api/bus-manufacturers        - Fetch all manufacturers
```

### How to Enable Real API

1. Open `components/sections/bus-management.tsx`
2. Find the `fetchAll()` function (around line 82)
3. Replace the entire function with the commented-out async version above it
4. The commented API calls are already there - just uncomment them

### Example Payload Structure

```typescript
// POST/PUT request body
{
  "registration_number": "KE-100-ABC",
  "seat_count": 50,
  "bus_make_id": "1",
  "bus_model_id": "1",
  "bus_manufacturer_id": "1",
  "fuel_type": "DIESEL",
  "transmission_type": "MANUAL",
  "chassis_number": "CH123456",
  "luggage_capacity_kg": 1000,
  "fuel_tank_capacity_l": 300,
  "mileage_km": 15000,
  "amenities": ["AC", "WIFI", "USB_CHARGING"]
}
```

---

## Driver Management

**File:** `components/sections/driver-management.tsx`

### API Endpoints Needed

```
GET    /api/drivers                  - Fetch all drivers
POST   /api/drivers                  - Create new driver
PUT    /api/drivers/{driver_id}      - Update driver details
DELETE /api/drivers/{driver_id}      - Delete a driver
```

### How to Enable Real API

1. Open `components/sections/driver-management.tsx`
2. Find the `fetchDrivers()` function (around line 53)
3. Uncomment the async version and remove the dummy data version

### Example Payload Structure

```typescript
{
  "full_name": "John Kariuki",
  "phone": "+254712345678",
  "license_number": "DL-2024001",
  "license_expiry_date": "2025-12-31"
}
```

---

## Driver Assignment

**File:** `components/sections/driver-assignment.tsx`

### API Endpoints Needed

```
GET    /api/driver-assignments       - Fetch all assignments
POST   /api/driver-assignments       - Create new assignment
PUT    /api/driver-assignments/{assignment_id}/end  - End an assignment
GET    /api/buses                    - Fetch available buses
GET    /api/drivers                  - Fetch available drivers
```

### How to Enable Real API

1. Open `components/sections/driver-assignment.tsx`
2. Find the `fetchAllData()` function (around line 68)
3. Uncomment the async version and replace with dummy data version

### Example Payload Structures

```typescript
// POST - Create assignment
{
  "bus_id": "1",
  "driver_id": "1",
  "assigned_from": "2024-01-01"
}

// PUT - End assignment
{
  "assigned_to": "2024-02-15T10:30:00"
}
```

---

## Fare Management

**File:** `components/sections/fare-management.tsx`

### API Endpoints Needed

```
GET    /api/fares                    - Fetch all fares
POST   /api/fares                    - Create new fare
PUT    /api/fares/{fare_id}          - Update fare
DELETE /api/fares/{fare_id}          - Delete a fare
GET    /api/routes                   - Fetch available routes
```

### How to Enable Real API

1. Open `components/sections/fare-management.tsx`
2. Find the `fetchFares()` function (around line 60)
3. Uncomment the async version and replace with dummy data version

### Example Payload Structure

```typescript
{
  "route_id": "1",
  "bus_class": "STANDARD",  // or "VIP"
  "price": 1500,
  "currency": "KES",
  "valid_from": "2024-01-01",
  "valid_to": null  // Optional, leave null for ongoing fares
}
```

---

## Location Management

**File:** `components/sections/location-management.tsx`

### API Endpoints Needed

```
GET    /api/locations                - Fetch all locations
POST   /api/locations                - Create new location
PUT    /api/locations/{location_id}  - Update location
DELETE /api/locations/{location_id}  - Delete a location
```

### How to Enable Real API

1. Open `components/sections/location-management.tsx`
2. Find the `fetchLocations()` function (around line 46)
3. Uncomment the async version and replace with dummy data version

### Example Payload Structure

```typescript
{
  "city_name": "Nairobi",
  "region": "Nairobi County",
  "country": "Kenya"
}
```

---

## Route Management

**File:** `components/sections/route-management.tsx`

### API Endpoints Needed

```
GET    /api/routes                   - Fetch all routes
POST   /api/routes                   - Create new route
PUT    /api/routes/{route_id}        - Update route
DELETE /api/routes/{route_id}        - Delete a route
GET    /api/locations                - Fetch available locations
```

### How to Enable Real API

1. Open `components/sections/route-management.tsx`
2. Find the `fetchRoutes()` function (around line 65)
3. Uncomment the async version and replace with dummy data version

### Example Payload Structure

```typescript
{
  "origin_city": "Nairobi",
  "destination_city": "Mombasa",
  "distance_km": 480,
  "estimated_duration_minutes": 540
}
```

---

## Trip Management

**File:** `components/sections/trip-management.tsx`

### API Endpoints Needed

```
GET    /api/trips                    - Fetch all trips
POST   /api/trips                    - Create new trip
PUT    /api/trips/{trip_id}          - Update trip
DELETE /api/trips/{trip_id}          - Delete a trip
GET    /api/routes                   - Fetch available routes
GET    /api/buses                    - Fetch available buses
```

### How to Enable Real API

1. Open `components/sections/trip-management.tsx`
2. Find the `fetchAllData()` function (around line 94)
3. Uncomment the async version and replace with dummy data version

### Example Payload Structure

```typescript
{
  "route_id": "1",
  "bus_id": "1",
  "departure_time": "2024-01-15T08:00:00",
  "arrival_time": "2024-01-15T17:00:00",  // Optional
  "status": "SCHEDULED"  // Options: SCHEDULED, DELAYED, IN_PROGRESS, COMPLETED, CANCELLED
}
```

---

## Quick Transition Checklist

When your backend API is ready:

- [ ] Ensure API_BASE_URL in `lib/config.ts` is set correctly
- [ ] For each section file:
  - [ ] Locate the fetch function (fetchAll, fetchDrivers, etc.)
  - [ ] Uncomment the `async` version with actual API calls
  - [ ] Comment out or remove the dummy data version
  - [ ] Test the component with your API
- [ ] Verify error handling works properly
- [ ] Update error messages if needed
- [ ] Remove any console.log statements used for debugging

## Error Handling

All sections include error handling. When switching to real API:

```typescript
// Current error structure
catch (err) {
  setError(err instanceof Error ? err.message : "An error occurred")
  console.error("[v0] Error fetching data:", err)
}
```

Make sure your backend returns appropriate error messages for consistency.

## Testing Tips

1. **Before switching:** Test the UI with dummy data to ensure components work
2. **During transition:** Use browser DevTools Network tab to monitor API calls
3. **After switching:** Test error scenarios (network down, 404, 500, etc.)
4. **Performance:** Monitor API response times and optimize if needed

## Additional Notes

- **Dummy Data Location:** Dummy data is defined within each fetch function
- **Mock Data Structure:** Matches the expected interface types for seamless transition
- **Comments:** All commented code is clearly marked with `// COMMENTED OUT:` and `// DUMMY DATA:`
- **Async/Await:** The commented code uses `async/await` - ensure your API supports it

---

## Support

If you encounter issues during integration:

1. Check that all required fields are being sent in API payloads
2. Verify API response structure matches the TypeScript interfaces
3. Use browser console to inspect API responses
4. Check CORS settings if you get cross-origin errors

Happy coding! 🚀
