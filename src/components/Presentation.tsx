import React, { useRef, useState } from 'react';
import html2pdf from 'html2pdf.js';
import type { PresentationData } from '../types';
import { Slide } from './Slide';

interface PresentationProps {
    data: PresentationData;
}

export const Presentation: React.FC<PresentationProps> = ({ data }) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const [isExporting, setIsExporting] = useState(false);

    const handlePrint = () => {
        window.print();
    };

    const handleDownloadPDF = async () => {
        if (!contentRef.current || isExporting) return;

        setIsExporting(true);

        const opt = {
            margin: 0,
            filename: `${data.title.replace(/\s+/g, '-').toLowerCase()}.pdf`,
            image: { type: 'jpeg' as const, quality: 0.98 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                logging: false,
                letterRendering: true,
            },
            jsPDF: {
                unit: 'in' as const,
                format: [16, 9] as [number, number], // 16:9 landscape ratio
                orientation: 'landscape' as const,
            },
            pagebreak: { mode: 'css' as const, before: '.break-after-page' },
        };

        try {
            await html2pdf().set(opt).from(contentRef.current).save();
        } catch (error) {
            console.error('PDF export error:', error);
            alert('PDF export failed. Try using the Print option instead.');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="fixed top-4 right-4 z-50 no-print flex gap-2">
                <button
                    onClick={handleDownloadPDF}
                    disabled={isExporting}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-2 px-4 rounded shadow-lg transition-colors"
                >
                    {isExporting ? 'Exporting...' : 'Download PDF'}
                </button>
                <button
                    onClick={handlePrint}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg transition-colors"
                >
                    Print to PDF
                </button>
            </div>

            <div ref={contentRef} className="print:w-full print:h-full">
                {data.slides.map((slide, index) => (
                    <Slide key={slide.id} slide={slide} slideNumber={index + 1} totalSlides={data.slides.length} />
                ))}
            </div>
        </div>
    );
};
