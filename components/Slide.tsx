'use client';

import React from 'react';
import type { SlideData, IconName } from '@/lib/types';
import { Diagram } from './Diagram';
import { MermaidDiagram } from './MermaidDiagram';
import {
    Shield, MapPin, Code2, Cloud, Database, Globe, Zap,
    TrendingDown, Users, Server, Lock, Rocket, FileCheck,
    Calendar, Mail, CheckCircle2, DollarSign, Sparkles, Bot, Puzzle,
    LucideIcon
} from 'lucide-react';

// Icon mapping for serializable icon names
const iconMap: Record<IconName, LucideIcon> = {
    Code2, Cloud, Database, Globe, Shield, Zap,
    TrendingDown, Users, Server, Lock, MapPin, Rocket,
    FileCheck, Calendar, Mail, CheckCircle2, DollarSign,
    Sparkles, Bot, Puzzle
};

interface SlideProps {
    slide: SlideData;
    slideNumber: number;
    totalSlides: number;
}

export const Slide: React.FC<SlideProps> = ({ slide, slideNumber, totalSlides }) => {
    const baseClasses = "w-full h-screen flex flex-col p-16 bg-white overflow-hidden break-after-page page-break-after-always relative";

    const renderContent = () => {
        switch (slide.layout) {
            case 'title-only':
                return (
                    <div className="flex-1 flex flex-col items-center justify-center text-center bg-gradient-to-br from-blue-50 to-white">
                        {slide.id === 'title' && slide.image && (
                            <div className="mb-8">
                                <img
                                    src={slide.image}
                                    alt="Profile"
                                    className="w-48 h-48 rounded-full object-cover object-top border-4 border-blue-600 shadow-xl"
                                />
                            </div>
                        )}
                        <h1 className="text-7xl font-bold text-gray-900 mb-6">{slide.title}</h1>
                        {slide.subtitle && <h2 className="text-4xl text-gray-600 font-light">{slide.subtitle}</h2>}
                        {slide.content && slide.content.length > 0 && (
                            <div className="mt-8 text-5xl font-bold text-blue-600">{slide.content[0]}</div>
                        )}
                        {slide.footer && (
                            <div className="mt-12 text-xl text-gray-500">
                                {Array.isArray(slide.footer)
                                    ? slide.footer.map((line, i) => <div key={i}>{line}</div>)
                                    : slide.footer}
                            </div>
                        )}
                        {slide.showLocation && slide.currentLocation && slide.targetLocation && (
                            <div className="mt-8 flex items-center gap-3 text-2xl text-gray-600">
                                <MapPin size={28} className="text-blue-600" />
                                <span className="font-medium">{slide.currentLocation}</span>
                                <span className="text-blue-600">→</span>
                                <span className="font-medium">{slide.targetLocation}</span>
                            </div>
                        )}
                    </div>
                );
            case 'bullets':
                return (
                    <div className="flex-1 flex flex-col justify-center">
                        <h2 className="text-5xl font-bold text-gray-900 mb-12">{slide.title}</h2>
                        <ul className="list-disc pl-12 space-y-6">
                            {slide.content?.map((item, index) => (
                                <li key={index} className="text-3xl text-gray-700 leading-relaxed">
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            case 'section-header':
                return (
                    <div className="flex-1 flex flex-col items-center justify-center text-center bg-gradient-to-b from-blue-50 to-white">
                        <div className="mb-8 text-blue-600">
                            <Shield size={96} strokeWidth={1} />
                        </div>
                        <h1 className="text-6xl font-bold text-gray-900 mb-4">{slide.title}</h1>
                        {slide.subtitle && <h2 className="text-4xl text-gray-600">{slide.subtitle}</h2>}
                    </div>
                );
            case 'grid-cards':
                const gridCols = slide.cards && slide.cards.length > 4 ? 'grid-cols-3' : 'grid-cols-2';
                return (
                    <div className="flex-1 flex flex-col p-8 overflow-visible">
                        <h2 className="text-5xl font-bold text-gray-900 mb-8 text-center">{slide.title}</h2>
                        <div className={`grid ${gridCols} gap-6 place-content-center`}>
                            {slide.cards?.map((card, index) => {
                                const Icon = card.icon ? iconMap[card.icon] : null;
                                return (
                                    <div key={index} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col items-center justify-center text-center">
                                        {Icon && (
                                            <div className="text-blue-600 mb-4">
                                                <Icon size={48} strokeWidth={1.5} />
                                            </div>
                                        )}
                                        <div className="text-5xl font-bold text-blue-600 mb-3">{card.value}</div>
                                        <div className="text-2xl font-semibold text-gray-800 mb-2">{card.title}</div>
                                        <div className="text-lg text-gray-500">{card.description}</div>
                                    </div>
                                );
                            })}
                        </div>
                        {slide.footer && (
                            <div className="mt-auto pt-4 border-t border-gray-200 text-center text-gray-500 text-xl">
                                {Array.isArray(slide.footer)
                                    ? slide.footer.map((line, i) => <div key={i}>{line}</div>)
                                    : slide.footer}
                            </div>
                        )}
                    </div>
                );
            case 'two-column':
                return (
                    <div className="flex-1 flex flex-col p-8">
                        <h2 className="text-5xl font-bold text-gray-900 mb-12">{slide.title}</h2>
                        <div className="flex flex-row gap-12 flex-1">
                            {slide.columns?.map((col, index) => (
                                <div key={index} className="flex-1">
                                    {col.title && <h3 className="text-3xl font-bold text-blue-700 mb-6">{col.title}</h3>}
                                    <ul className="space-y-4">
                                        {col.content.map((item, i) => (
                                            <li key={i} className="text-2xl text-gray-700 leading-relaxed flex items-start">
                                                <span className="mr-3 text-blue-500">•</span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                        {slide.footer && <div className="mt-8 text-sm text-gray-400">{slide.footer}</div>}
                    </div>
                );
            case 'three-column':
                return (
                    <div className="flex-1 flex flex-col p-8">
                        <h2 className="text-5xl font-bold text-gray-900 mb-12">{slide.title}</h2>
                        <div className="grid grid-cols-3 gap-8 flex-1">
                            {slide.columns?.map((col, index) => (
                                <div key={index} className="flex-1">
                                    {col.title && <h3 className="text-2xl font-bold text-blue-700 mb-6">{col.title}</h3>}
                                    <ul className="space-y-4">
                                        {col.content.map((item, i) => (
                                            <li key={i} className="text-xl text-gray-700 leading-relaxed flex items-start">
                                                <span className="mr-2 text-blue-500">•</span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                        {slide.footer && <div className="mt-8 text-sm text-gray-400">{slide.footer}</div>}
                    </div>
                );
            case 'project-detail':
                return (
                    <div className="flex-1 flex flex-col gap-3 p-6 overflow-hidden">
                        {/* Top section: Title + Cards */}
                        <div className="flex flex-col gap-2">
                            <div className="border-b pb-2">
                                <h2 className="text-xl font-bold text-gray-900 mb-0.5 leading-tight">{slide.title}</h2>
                                {slide.subtitle && <h3 className="text-base text-gray-600 leading-tight">{slide.subtitle}</h3>}
                            </div>

                            <div className="flex flex-row gap-3">
                                {slide.context && (
                                    <div className="w-full bg-gray-50 p-2 rounded-lg border-l-4 border-gray-600 mb-1">
                                        <h4 className="font-bold text-gray-800 mb-1 uppercase text-xs tracking-wider flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div>
                                            Context & Overview
                                        </h4>
                                        <ul className="space-y-0.5 text-gray-800 text-xs leading-snug">
                                            {slide.context.map((item, i) => (
                                                <li key={i} className="flex items-start">
                                                    <span className="text-gray-600 mr-1.5 mt-0.5 flex-shrink-0 text-xs">•</span>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-row gap-3">
                                {slide.challenge && (
                                    <div className="flex-1 bg-red-50 p-2 rounded-lg border-l-4 border-red-600">
                                        <h4 className="font-bold text-red-800 mb-1 uppercase text-xs tracking-wider flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                                            Challenge
                                        </h4>
                                        <ul className="space-y-0.5 text-gray-800 text-xs leading-snug">
                                            {slide.challenge.map((item, i) => (
                                                <li key={i} className="flex items-start">
                                                    <span className="text-red-600 mr-1.5 mt-0.5 flex-shrink-0 text-xs">•</span>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {slide.solution && (
                                    <div className="flex-1 bg-blue-50 p-2 rounded-lg border-l-4 border-blue-600">
                                        <h4 className="font-bold text-blue-800 mb-1 uppercase text-xs tracking-wider flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                                            Solution
                                        </h4>
                                        <ul className="space-y-0.5 text-gray-800 text-xs leading-snug">
                                            {slide.solution.map((item, i) => (
                                                <li key={i} className="flex items-start">
                                                    <span className="text-blue-600 mr-1.5 mt-0.5 flex-shrink-0 text-xs">•</span>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {slide.impact && (
                                    <div className="flex-1 bg-green-50 p-2 rounded-lg border-l-4 border-green-600">
                                        <h4 className="font-bold text-green-800 mb-1 uppercase text-xs tracking-wider flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                                            Impact
                                        </h4>
                                        <ul className="space-y-0.5 text-gray-800 text-xs leading-snug">
                                            {slide.impact.map((item, i) => (
                                                <li key={i} className="flex items-start">
                                                    <span className="text-green-600 mr-1.5 mt-0.5 flex-shrink-0 text-xs">•</span>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {slide.techs && (
                                <div className="flex flex-wrap gap-1 pt-1">
                                    {slide.techs.map((tech, i) => (
                                        <span key={i} className="px-2 py-0.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded text-xs font-semibold border border-blue-200">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Bottom section: Diagram */}
                        {(slide.mermaid || slide.diagram || slide.image || slide.detailSections) && (
                            <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200 overflow-hidden shadow-lg">
                                {slide.mermaid ? (
                                    <MermaidDiagram chart={slide.mermaid} />
                                ) : slide.diagram ? (
                                    <Diagram initialNodes={slide.diagram.nodes} initialEdges={slide.diagram.edges} />
                                ) : slide.image ? (
                                    <img src={slide.image} alt={slide.title} className="w-full h-full object-contain" />
                                ) : slide.detailSections ? (
                                    <div className="h-full p-6 flex flex-col">
                                        <h3 className="text-base font-semibold text-gray-700 mb-4 uppercase tracking-wider border-b border-gray-300 pb-2">
                                            Actions Taken
                                        </h3>
                                        <div className="flex-1 grid grid-cols-4 gap-x-6 gap-y-2 content-start">
                                            {slide.detailSections.map((section, idx) => (
                                                <div key={idx} className="space-y-1">
                                                    <h4 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                                                        <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                                                        {section.title}
                                                    </h4>
                                                    <ul className="space-y-0.5 text-gray-600 text-xs leading-relaxed pl-4">
                                                        {section.items.map((item, i) => (
                                                            <li key={i} className="flex items-start">
                                                                <span className="text-gray-400 mr-2">—</span>
                                                                <span>{item}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        )}
                    </div>
                );
            case 'split-image':
                return (
                    <div className="flex-1 flex flex-row items-center gap-12 p-8">
                        <div className="w-1/2 flex flex-col h-full">
                            <h2 className="text-4xl font-bold text-gray-900 mb-8">{slide.title}</h2>
                            {slide.subtitle && <h3 className="text-2xl text-gray-600 mb-6">{slide.subtitle}</h3>}
                            <div className="flex-1 overflow-y-auto">
                                <ul className="space-y-4">
                                    {slide.content?.map((item, index) => (
                                        <li key={index} className="text-2xl text-gray-700 leading-relaxed">
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="w-1/2 h-full flex flex-col items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 p-4">
                            {slide.image ? (
                                <img
                                    src={slide.image}
                                    alt={slide.title}
                                    className="max-h-full max-w-full object-contain rounded-lg shadow-lg"
                                />
                            ) : (
                                <div className="text-center text-gray-400">
                                    <p className="text-xl">Architecture Diagram Placeholder</p>
                                    <p className="text-sm mt-2">(Image generation not yet implemented)</p>
                                </div>
                            )}
                        </div>
                    </div>
                );
            case 'full-image':
                return (
                    <div className="absolute inset-0">
                        {slide.image && (
                            <img
                                src={slide.image}
                                alt={slide.title}
                                className="w-full h-full object-cover"
                            />
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-8">
                            <h2 className="text-4xl font-bold text-white">{slide.title}</h2>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className={baseClasses}>
            {renderContent()}
            <div className="absolute bottom-4 right-4 text-gray-400 text-sm font-medium">
                {slideNumber} / {totalSlides}
            </div>
        </div>
    );
};
