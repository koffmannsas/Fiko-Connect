import crypto from "crypto";

const APP_SECRET = "test_secret";
const WEBHOOK_URL = "http://localhost:3000/webhook";

async function runTest() {
    const uniqueId = "sim_" + Math.random().toString(36).substring(7);
    const payload = {
        entry: [{
            changes: [{
                value: {
                    messages: [{
                        id: uniqueId,
                        from: "2250748931120",
                        text: { body: "Test de bout en bout Fiko !" }
                    }],
                    metadata: {
                        display_phone_number: "2250592847715"
                    }
                }
            }]
        }]
    };

    const body = JSON.stringify(payload);
    const signature = "sha256=" + crypto.createHmac('sha256', APP_SECRET).update(body).digest('hex');

    console.log(`Simulating message ${uniqueId}...`);
    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-hub-signature-256': signature
            },
            body: body
        });

        console.log("Response Status:", response.status);
    } catch (e) {
        console.error("Test failed:", e);
    }
}

runTest();
