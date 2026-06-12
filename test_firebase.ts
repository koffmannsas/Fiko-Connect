import { initializeApp, applicationDefault, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

async function test() {
    console.log("Testing Firebase Connection...");
    try {
        if (!getApps().length) {
            initializeApp({
                credential: applicationDefault(),
                projectId: "krypton-ai-490214"
            });
        }
        const db = getFirestore();
        console.log("Project ID:", db.projectId);

        const collections = await db.listCollections();
        console.log("Found collections:", collections.map(c => c.id).join(", "));

        const required = ['leads', 'messages', 'processed_messages', 'fiko_memory'];
        for (const col of required) {
            const snap = await db.collection(col).limit(1).get();
            console.log(`- ${col}: ${snap.empty ? 'Empty/Exists' : 'Active'}`);
        }
    } catch (e: any) {
        console.error("Firebase Test Failed:", e.message);
    }
}
test();
