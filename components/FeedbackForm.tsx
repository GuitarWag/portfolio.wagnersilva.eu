'use client';

import React, { useState } from 'react';
import { Star, Send, CheckCircle, X, MessageSquare } from 'lucide-react';
import { event } from '@/lib/analytics';

interface FeedbackFormProps {
    presentationId: string;
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({ presentationId }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [rating, setRating] = useState<number>(0);
    const [hoveredRating, setHoveredRating] = useState<number>(0);
    const [comment, setComment] = useState('');
    const [contact, setContact] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (rating === 0) {
            setError('Please select a rating');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch('/api/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    rating,
                    comment: comment.trim(),
                    contact: contact.trim(),
                    presentationId,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit feedback');
            }

            setIsSubmitted(true);

            // Track feedback submission
            event({
                action: 'feedback_submitted',
                category: 'Feedback',
                label: presentationId,
                value: rating,
            });
        } catch (err) {
            setError('Failed to submit feedback. Please try again.');
            console.error('Feedback submission error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const ratingLabels = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'];

    // Trigger button
    if (!isOpen && !isSubmitted) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full font-medium shadow-lg hover:bg-blue-700 hover:scale-105 transition-all print:hidden"
            >
                <MessageSquare className="w-5 h-5" />
                Share Your Feedback
            </button>
        );
    }

    // Success state (inline, no modal)
    if (isSubmitted) {
        return (
            <div className="flex flex-col items-center gap-3 p-6 bg-green-50 rounded-2xl border border-green-200 shadow-lg print:hidden">
                <CheckCircle className="w-12 h-12 text-green-500" />
                <p className="text-gray-800 text-lg font-medium">Thank you for your feedback!</p>
                <p className="text-gray-500 text-sm">Your input helps me improve.</p>
            </div>
        );
    }

    // Modal
    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] print:hidden"
                onClick={() => setIsOpen(false)}
            />

            {/* Modal */}
            <div className="fixed inset-0 flex items-center justify-center z-[101] p-4 print:hidden">
                <div
                    className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-white">Share Your Feedback</h2>
                            <p className="text-blue-100 text-sm mt-1">Help me improve this portfolio</p>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 hover:bg-white/20 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5 text-white" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6 space-y-6">
                        {/* Rating Section */}
                        <div className="text-center">
                            <p className="text-gray-700 font-medium mb-4">How was your experience?</p>
                            <div className="flex justify-center gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoveredRating(star)}
                                        onMouseLeave={() => setHoveredRating(0)}
                                        className="transition-transform hover:scale-110 focus:outline-none p-1"
                                        aria-label={`Rate ${star} stars`}
                                    >
                                        <Star
                                            className={`w-10 h-10 transition-colors ${
                                                star <= (hoveredRating || rating)
                                                    ? 'text-yellow-400 fill-yellow-400'
                                                    : 'text-gray-200'
                                            }`}
                                        />
                                    </button>
                                ))}
                            </div>
                            <p className="text-sm text-gray-500 mt-2 h-5">
                                {ratingLabels[hoveredRating || rating] || 'Select a rating'}
                            </p>
                        </div>

                        {/* Comment */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Comments <span className="text-gray-400 font-normal">(optional)</span>
                            </label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="What did you like? What could be improved?"
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                rows={3}
                            />
                        </div>

                        {/* Contact */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email or LinkedIn <span className="text-gray-400 font-normal">(optional)</span>
                            </label>
                            <input
                                type="text"
                                value={contact}
                                onChange={(e) => setContact(e.target.value)}
                                placeholder="your@email.com or linkedin.com/in/yourprofile"
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                            <p className="text-xs text-gray-400 mt-2">
                                Leave your contact if you&apos;d like me to follow up
                            </p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                                <p className="text-red-600 text-sm text-center">{error}</p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-3">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="flex-1 px-6 py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting || rating === 0}
                            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                                rating === 0
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    Send Feedback
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
