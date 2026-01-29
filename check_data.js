
const fs = require('fs');

const API_BASE_URL = "http://localhost:8080";
const LOG_FILE = "data_check.txt";

function log(msg) {
    console.log(msg);
    fs.appendFileSync(LOG_FILE, msg + "\n");
}

fs.writeFileSync(LOG_FILE, "");

async function checkOwnership(endpoint) {
    try {
        const res = await fetch(`${API_BASE_URL}/api/v1/${endpoint}`);
        if (res.ok) {
            const data = await res.json();
            if (data.length > 0) {
                log(`[${endpoint}] First Item AgencyID: ${data[0].agencyId} (Total: ${data.length})`);
                log(`[${endpoint}] First Item Name/ID: ${JSON.stringify(data[0])}`);
            } else {
                log(`[${endpoint}] No data found.`);
            }
        } else {
            log(`[${endpoint}] Failed ${res.status}`);
        }
    } catch (e) {
        log(`[${endpoint}] Error ${e.message}`);
    }
}

async function run() {
    await checkOwnership("locations");
    await checkOwnership("routes");
    await checkOwnership("drivers");
    await checkOwnership("assignments");
    // Check parameters too
    await checkOwnership("bus-makes");
    await checkOwnership("bus-models");
}

run();
