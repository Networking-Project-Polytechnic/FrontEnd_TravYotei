
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');

    if (!q) {
        return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
    }

    const MAX_RETRIES = 3;
    const RETRY_DELAY = 1000; // 1 second
    let lastError: any;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            // Restrict search to Cameroon (cm)
            const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&countrycodes=cm`;
            console.log(`Fetching from Nominatim (Attempt ${attempt}/${MAX_RETRIES}): ${nominatimUrl}`);

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout per request

            try {
                const response = await fetch(nominatimUrl, {
                    headers: {
                        'User-Agent': 'TravYotei-App/1.0', // Nominatim requires a User-Agent
                        'Accept-Language': 'en'
                    },
                    signal: controller.signal
                });

                clearTimeout(timeoutId);
                console.log(`Nominatim response status (Attempt ${attempt}): ${response.status}`);

                if (!response.ok) {
                    const text = await response.text();
                    console.error(`Nominatim API error body: ${text}`);
                    throw new Error(`Nominatim API error: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();
                return NextResponse.json(data);

            } catch (fetchError: any) {
                clearTimeout(timeoutId);
                throw fetchError;
            }

        } catch (error: any) {
            console.error(`Attempt ${attempt} failed:`, error.message);
            lastError = error;

            if (attempt < MAX_RETRIES) {
                console.log(`Retrying in ${RETRY_DELAY}ms...`);
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
            }
        }
    }

    // If all retries fail
    console.error('All Nominatim retries failed.');
    return NextResponse.json({
        error: 'Failed to fetch coordinates after multiple attempts',
        details: lastError?.message,
    }, { status: 500 });
}
