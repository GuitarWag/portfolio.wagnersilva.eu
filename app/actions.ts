'use server';

import { db } from '@/lib/firebase';
import { FieldValue } from '@google-cloud/firestore';

export async function incrementVideoView(videoId: string) {
    if (!videoId) return;

    try {
        const docRef = db.collection('video_stats').doc(videoId);
        await docRef.set({
            views: FieldValue.increment(1),
            lastPlayedAt: FieldValue.serverTimestamp()
        }, { merge: true });
        console.log(`[Video Stats] Incremented view for video: ${videoId}`);
    } catch (error) {
        console.error('Error incrementing video view:', error);
        // We don't want to crash the UI if analytics fail
    }
}

export async function getVideoViews(videoId: string): Promise<number> {
    if (!videoId) return 0;
    try {
        const doc = await db.collection('video_stats').doc(videoId).get();
        return doc.exists ? (doc.data()?.views || 0) : 0;
    } catch (error) {
        console.error('Error fetching video views:', error);
        return 0;
    }
}
