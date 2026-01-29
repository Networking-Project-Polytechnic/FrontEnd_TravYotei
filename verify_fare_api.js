
const API_BASE_URL = "http://localhost:8080";
const AGENCY_ID = "00000000-0000-0000-0000-000000000000";

async function verify() {
    console.log("Verifying API Endpoints...");

    // 1. Check GET /api/v1/route-prices/agency/{id}
    try {
        const url = `${API_BASE_URL}/api/v1/route-prices/agency/${AGENCY_ID}`;
        console.log(`GET ${url}`);
        const res = await fetch(url);
        console.log(`Status: ${res.status} ${res.statusText}`);
        if (res.ok) {
            const json = await res.json();
            console.log("Body:", JSON.stringify(json, null, 2));
        } else {
            const text = await res.text();
            console.log("Error Body:", text);
        }
    } catch (err) {
        console.error("GET failed:", err.message);
    }
}

verify();
