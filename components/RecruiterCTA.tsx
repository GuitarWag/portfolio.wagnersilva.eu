'use client';

import React, { useState, useRef } from 'react';
import { Briefcase, Send, X, Loader2, FileUp, CheckCircle, AlertCircle, ChevronRight, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { trackRecruiterCTAOpen, trackRecruiterCTASubmit, trackRecruiterCTASuccess, trackRecruiterCTAError } from '@/lib/analytics';

export const RecruiterCTA: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState<'input' | 'processing' | 'result'>('input');
    const [formData, setFormData] = useState({
        jobDescription: '',
        contact: '',
    });
    const [file, setFile] = useState<File | null>(null);
    const [result, setResult] = useState<string>('');
    const [copied, setCopied] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStep('processing');

        trackRecruiterCTASubmit(!!file, !!formData.contact);

        try {
            const data = new FormData();
            data.append('contact', formData.contact);
            if (formData.jobDescription) data.append('jobDescription', formData.jobDescription);
            if (file) data.append('file', file);

            const response = await fetch('/api/recruiter-check', {
                method: 'POST',
                body: data,
            });

            if (!response.ok) throw new Error('Analysis failed');

            const resultData = await response.json();
            setResult(resultData.analysis);
            setStep('result');

            // Track success and try to extract match percentage
            const matchPercentage = resultData.analysis.match(/(\d+)%/)?.[1];
            trackRecruiterCTASuccess(matchPercentage ? `${matchPercentage}%` : undefined);
        } catch (error) {
            console.error('Recruiter check error:', error);
            setStep('input');
            alert('Failed to analyze. Please try again.');
            trackRecruiterCTAError(error instanceof Error ? error.message : 'Unknown error');
        }
    };

    const resetForm = () => {
        setStep('input');
        setFormData({ jobDescription: '', contact: '' });
        setFile(null);
        setResult('');
        setCopied(false);
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(result);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <>
            {/* Trigger Button */}
            {!isOpen && (
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 px-5 py-3 bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full shadow-lg transition-all group overflow-hidden mb-8"
                    onClick={() => {
                        setIsOpen(true);
                        trackRecruiterCTAOpen();
                    }}
                >
                    <Briefcase size={20} className="animate-pulse" />
                    <span className="font-semibold whitespace-nowrap">Hiring? Let's check the fit!</span>
                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
            )}

            {/* Modal */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl overflow-hidden flex flex-col h-[85vh]"
                        >
                            {/* Header */}
                            <div className="p-6 bg-gradient-to-br from-blue-500 to-purple-600 text-white flex justify-between items-center shrink-0">
                                <div>
                                    <h3 className="text-xl font-bold flex items-center gap-2">
                                        <Briefcase size={24} />
                                        Recruiter Assistant
                                    </h3>
                                    <p className="text-blue-100 text-sm mt-1">See how I match your role (Biased 🤫 & Fast!)</p>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6 overflow-y-auto custom-scrollbar">
                                {step === 'input' && (
                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <p className="text-gray-600 text-sm">
                                            Paste the job description or upload a PDF. I'll read it and tell you why I'm a great fit.
                                        </p>

                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-gray-500 uppercase">Job Details</label>

                                            <div className="flex gap-2 mb-2">
                                                <button
                                                    type="button"
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className={`flex-1 py-2 px-3 rounded-lg border-2 border-dashed flex items-center justify-center gap-2 text-sm transition-colors ${file ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-300 hover:border-blue-400 text-gray-600'}`}
                                                >
                                                    {file ? (
                                                        <>
                                                            <CheckCircle size={16} />
                                                            <span className="truncate max-w-[150px]">{file.name}</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FileUp size={16} />
                                                            <span>Upload PDF</span>
                                                        </>
                                                    )}
                                                </button>
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    accept=".pdf"
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                />
                                            </div>

                                            <textarea
                                                name="jobDescription"
                                                value={formData.jobDescription}
                                                onChange={handleInputChange}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none min-h-[120px] transition-all text-sm"
                                                placeholder="...or paste the job description text here"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-gray-500 uppercase">Your Contact (Optional)</label>
                                            <input
                                                type="text"
                                                name="contact"
                                                value={formData.contact}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                                placeholder="Email or LinkedIn URL"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={!formData.jobDescription && !file}
                                            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                                        >
                                            <Send size={18} />
                                            Analyze Match
                                        </button>
                                    </form>
                                )}

                                {step === 'processing' && (
                                    <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                                        <div className="relative">
                                            <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Bot size={24} className="text-blue-600" />
                                            </div>
                                        </div>
                                        <h4 className="text-xl font-bold text-gray-800">Analyzing compatibility...</h4>
                                        <p className="text-gray-500 max-w-xs">Reading the job description and comparing it with Wagner's skills and projects.</p>
                                    </div>
                                )}

                                {step === 'result' && (
                                    <div className="flex flex-col h-full">
                                        <div className="flex-1 overflow-y-auto mb-6 pr-2">
                                            <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2 justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Sparkles className="text-amber-500" size={20} />
                                                    Here's the verdict:
                                                </div>
                                                <button
                                                    onClick={handleCopy}
                                                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-1 text-sm text-gray-600"
                                                    title="Copy to clipboard"
                                                >
                                                    {copied ? (
                                                        <>
                                                            <Check size={16} className="text-green-600" />
                                                            <span className="text-green-600">Copied!</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Copy size={16} />
                                                            <span>Copy</span>
                                                        </>
                                                    )}
                                                </button>
                                            </h4>
                                            <div className="prose prose-sm prose-blue max-w-none text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100 text-left">
                                                <ReactMarkdown>{result}</ReactMarkdown>
                                            </div>
                                        </div>
                                        <button
                                            onClick={resetForm}
                                            className="w-full py-3 bg-gray-800 hover:bg-gray-900 text-white font-bold rounded-xl transition-all"
                                        >
                                            Check Another Role
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

// Import needed for Bot icon if not available in top imports
import { Sparkles, Bot } from 'lucide-react';
