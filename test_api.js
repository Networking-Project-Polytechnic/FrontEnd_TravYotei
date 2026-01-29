const fs = require('fs');

const API_BASE_URL = "http://localhost:8080";
const LOG_FILE = "api_test_results.txt";

function log(message) {
    console.log(message);
    fs.appendFileSync(LOG_FILE, message + "\n");
}

// Clear log file
fs.writeFileSync(LOG_FILE, "");

async function testEndpoint(name, url) {
    try {
        const res = await fetch(url);
        if (res.ok) {
            const data = await res.json();
            const count = Array.isArray(data) ? data.length : (data ? 1 : 0);
            log(`✅ [SUCCESS] ${name}: Found ${count} items`);
            return data;
        } else {
            log(`❌ [FAILED] ${name}: ${res.status} ${res.statusText}`);
            return null;
        }
    } catch (e) {
        log(`❌ [ERROR] ${name}: ${e.message}`);
        return null;
    }
}

async function runTests() {
    log("🚀 Starting API Tests...\n");

    // 1. Get Global Data to find valid IDs
    const buses = await testEndpoint("getBuses", `${API_BASE_URL}/api/v1/buses`);
    const locations = await testEndpoint("getLocations", `${API_BASE_URL}/api/v1/locations`);

    let agencyId = null;
    if (buses && buses.length > 0) {
        agencyId = buses[0].agencyId;
        log(`ℹ️  Using Agency ID from first bus: ${agencyId}`);
    } else {
        // fallback or try to find from another source if needed
        log("⚠️  No buses found to extract Agency ID. Attempting to list agencies (custom check)...");
        // Try a guess or admin endpoint if known, otherwise we skip agency tests
    }

    log("\n--- Global Lookup Endpoints ---");
    await testEndpoint("getRoutes", `${API_BASE_URL}/api/v1/routes`);
    await testEndpoint("getSchedules", `${API_BASE_URL}/api/v1/schedules`);
    await testEndpoint("getRoutePrices", `${API_BASE_URL}/api/v1/route-prices`);
    await testEndpoint("getBusMakes", `${API_BASE_URL}/api/v1/bus-makes`);
    await testEndpoint("getBusModels", `${API_BASE_URL}/api/v1/bus-models`);
    await testEndpoint("getManufacturers", `${API_BASE_URL}/api/v1/bus-manufacturers`);
    await testEndpoint("getFuelTypes", `${API_BASE_URL}/api/v1/fuel-types`);
    await testEndpoint("getTransmissionTypes", `${API_BASE_URL}/api/v1/transmission-types`);
    await testEndpoint("getBusTypes", `${API_BASE_URL}/api/v1/bus-types`);
    await testEndpoint("getVehicleAmenities", `${API_BASE_URL}/api/vehicle-amenities`);
    await testEndpoint("getBusTransportables", `${API_BASE_URL}/api/bus-transportables`);
    await testEndpoint("getAssignments", `${API_BASE_URL}/api/v1/assignments`);
    await testEndpoint("getBusReviews", `${API_BASE_URL}/api/bus-reviews`);

    if (agencyId) {
        log(`\n--- Agency Scoped Endpoints (Agency ID: ${agencyId}) ---`);
        await testEndpoint("getAgencyOverview", `${API_BASE_URL}/api/v1/agencies/${agencyId}/overview`);
        await testEndpoint("getBusesByAgency", `${API_BASE_URL}/api/v1/buses/agency/${agencyId}`);
        await testEndpoint("getDriversByAgency", `${API_BASE_URL}/api/v1/drivers/agency/${agencyId}`);
        await testEndpoint("getRoutesByAgency", `${API_BASE_URL}/api/v1/routes/agency/${agencyId}`);
        await testEndpoint("getLocationsByAgency", `${API_BASE_URL}/api/v1/locations/agency/${agencyId}`);
        await testEndpoint("getSchedulesByAgency", `${API_BASE_URL}/api/v1/schedules/agency/${agencyId}`);
        await testEndpoint("getRoutePricesByAgency", `${API_BASE_URL}/api/v1/route-prices/agency/${agencyId}`);
        await testEndpoint("getBusMakesByAgency", `${API_BASE_URL}/api/v1/bus-makes/agency/${agencyId}`);
        await testEndpoint("getBusModelsByAgency", `${API_BASE_URL}/api/v1/bus-models/agency/${agencyId}`);
        await testEndpoint("getManufacturersByAgency", `${API_BASE_URL}/api/v1/bus-manufacturers/agency/${agencyId}`);
        await testEndpoint("getFuelTypesByAgency", `${API_BASE_URL}/api/v1/fuel-types/agency/${agencyId}`);
        await testEndpoint("getTransmissionTypesByAgency", `${API_BASE_URL}/api/v1/transmission-types/agency/${agencyId}`);
        await testEndpoint("getBusTypesByAgency", `${API_BASE_URL}/api/v1/bus-types/agency/${agencyId}`);
        await testEndpoint("getVehicleAmenitiesByAgency", `${API_BASE_URL}/api/vehicle-amenities/agency/${agencyId}`);
        await testEndpoint("getTransportablesByAgency", `${API_BASE_URL}/api/bus-transportables/agency/${agencyId}`);
        await testEndpoint("getAssignmentsByAgency", `${API_BASE_URL}/api/v1/assignments/agency/${agencyId}`);
    } else {
        log("\n⚠️  Skipping Agency Scoped Endpoints: No valid Agency ID found.");
    }

    log("\n🏁  Tests Completed.");
}

runTests();
