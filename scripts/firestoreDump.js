// scripts/firestoreDump.js

import fs from 'fs';
import admin from 'firebase-admin';
import path from 'path';
import { fileURLToPath } from 'url';

// Necessary setup for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the service account JSON
const serviceAccountPath = path.join(__dirname, '../serviceAccountKey.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function dumpFirestore() {
  const collections = await db.listCollections();
  for (const collection of collections) {
    console.log(`\n📁 Collection: ${collection.id}`);
    const snapshot = await collection.get();
    snapshot.forEach(doc => {
      console.log(`📄 Document ID: ${doc.id}`);
      console.log(doc.data());
    });
  }
}

dumpFirestore();
