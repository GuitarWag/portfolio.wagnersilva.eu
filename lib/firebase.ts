import { Firestore } from '@google-cloud/firestore';

// Initialize Firestore
// Uses GOOGLE_APPLICATION_CREDENTIALS env var or application default credentials
// Database 'wagnersilva-eu' in europe-north2 (Enterprise edition)
export const db = new Firestore({
    projectId: process.env.GOOGLE_CLOUD_PROJECT || 'wagnersilva-eu',
    databaseId: 'wagnersilva-eu',
});
