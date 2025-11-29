import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';

export interface FeedbackRequest {
    rating: number; // 1-5 stars
    comment?: string;
    contact?: string; // Email or LinkedIn
    presentationId: string;
    userAgent?: string;
}

export async function POST(request: NextRequest) {
    try {
        const body: FeedbackRequest = await request.json();

        // Validate required fields
        if (!body.rating || !body.presentationId) {
            return NextResponse.json(
                { error: 'Rating and presentationId are required' },
                { status: 400 }
            );
        }

        // Validate rating range
        if (body.rating < 1 || body.rating > 5) {
            return NextResponse.json(
                { error: 'Rating must be between 1 and 5' },
                { status: 400 }
            );
        }

        // Save to Firestore
        const feedbackRef = db.collection('portfolio-feedbacks');
        const docRef = await feedbackRef.add({
            rating: body.rating,
            comment: body.comment || '',
            contact: body.contact || '',
            presentationId: body.presentationId,
            userAgent: body.userAgent || request.headers.get('user-agent') || '',
            createdAt: new Date().toISOString(),
            ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '',
        });

        return NextResponse.json({
            success: true,
            id: docRef.id,
        });
    } catch (error) {
        console.error('Feedback error:', error);
        return NextResponse.json(
            { error: 'Failed to save feedback' },
            { status: 500 }
        );
    }
}
