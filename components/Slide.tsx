'use client';

import React from 'react';
import type { SlideData, IconName } from '@/lib/types';
import { Diagram } from './Diagram';
import { MermaidDiagram } from './MermaidDiagram';
import { PresenterVideo } from './PresenterVideo';
import { PresenterAudio } from './PresenterAudio';
import { TLDRButton } from './TLDRButton';
import { FeedbackForm } from './FeedbackForm';
import {
    Shield, MapPin, Code2, Cloud, Database, Globe, Zap,
    TrendingDown, Users, Server, Lock, Rocket, FileCheck,
    Calendar, Mail, CheckCircle2, DollarSign, Sparkles, Bot, Puzzle,
    GitMerge, LucideIcon
} from 'lucide-react';

// Icon mapping for serializable icon names
const iconMap: Record<IconName, LucideIcon> = {
    Code2, Cloud, Database, Globe, Shield, Zap,
    TrendingDown, Users, Server, Lock, MapPin, Rocket,
    FileCheck, Calendar, Mail, CheckCircle2, DollarSign,
    Sparkles, Bot, Puzzle, GitMerge
};

interface SlideProps {
    slide: SlideData;
    slideNumber: number;
    totalSlides: number;
    presentationId: string;
}

export const Slide: React.FC<SlideProps> = ({ slide, slideNumber, totalSlides, presentationId }) => {
    const baseClasses = "w-full min-h-screen flex flex-col p-16 bg-white overflow-visible break-after-page page-break-after-always relative";

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
                        {slide.id === 'closing' && (
                            <div className="mb-6">
                                <img
                                    src="/ribbon.svg"
                                    alt="Swedish Ribbon"
                                    className="w-40 h-40"
                                />
                            </div>
                        )}
                        <h1 className="text-7xl font-bold text-gray-900 mb-6">{slide.title}</h1>
                        {slide.subtitle && (
                            <h2 className="text-4xl text-gray-600 font-light">
                                {slide.subtitle.split('\n').map((line, i) => (
                                    <span key={i} className={i === 0 ? 'text-5xl font-bold text-gray-800 block mb-2' : ''}>
                                        {i > 0 && <br />}
                                        {line}
                                    </span>
                                ))}
                            </h2>
                        )}
                        {slide.content && slide.content.length > 0 && (
                            <div className="mt-8 text-5xl font-bold text-blue-600">{slide.content[0]}</div>
                        )}
                        {slide.footer && (
                            <div className="mt-12 text-xl text-gray-500">
                                {Array.isArray(slide.footer)
                                    ? slide.footer.map((line, i) => {
                                        // Check if line contains links
                                        if (line.includes('|')) {
                                            const parts = line.split('|').map(p => p.trim());
                                            return (
                                                <div key={i} className="flex items-center justify-center gap-2">
                                                    {parts.map((part, idx) => {
                                                        // Check if it's a URL
                                                        if (part.includes('.')) {
                                                            const isLinkedIn = part.includes('linkedin');
                                                            const url = part.startsWith('http') ? part : (isLinkedIn ? `https://${part}` : `https://${part}`);
                                                            return (
                                                                <React.Fragment key={idx}>
                                                                    {idx > 0 && <span className="text-gray-400">|</span>}
                                                                    <a
                                                                        href={url}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                                                                    >
                                                                        {part}
                                                                    </a>
                                                                </React.Fragment>
                                                            );
                                                        }
                                                        return (
                                                            <React.Fragment key={idx}>
                                                                {idx > 0 && <span className="text-gray-400">|</span>}
                                                                <span>{part}</span>
                                                            </React.Fragment>
                                                        );
                                                    })}
                                                </div>
                                            );
                                        }
                                        // Check if it's an email
                                        if (line.includes('@')) {
                                            return (
                                                <div key={i}>
                                                    <a
                                                        href={`mailto:${line}`}
                                                        className="text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                                                    >
                                                        {line}
                                                    </a>
                                                </div>
                                            );
                                        }
                                        return <div key={i}>{line}</div>;
                                    })
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
                        {slide.id === 'closing' && (
                            <div className="mt-8">
                                <FeedbackForm presentationId={presentationId} />
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
                const gridCols = slide.cards && slide.cards.length >= 8 ? 'grid-cols-4' : (slide.cards && slide.cards.length > 4 ? 'grid-cols-3' : 'grid-cols-2');
                return (
                    <div className="flex-1 flex flex-col p-4 overflow-visible">
                        <h2 className="text-3xl font-bold text-gray-900 mb-3 text-center">{slide.title}</h2>
                        <div className={`grid ${gridCols} gap-4 flex-1`}>
                            {slide.cards?.map((card, index) => {
                                const Icon = card.icon ? iconMap[card.icon] : null;
                                return (
                                    <div key={index} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col items-center justify-center text-center">
                                        {Icon && (
                                            <div className="text-blue-600 mb-4">
                                                <Icon size={48} strokeWidth={1.5} />
                                            </div>
                                        )}
                                        <div className="text-4xl font-bold text-blue-600 mb-3">{card.value}</div>
                                        <div className="text-xl font-semibold text-gray-800 mb-2">{card.title}</div>
                                        <div className="text-base text-gray-500">{card.description}</div>
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
                    <div className="flex-1 flex flex-col gap-3 p-6 overflow-visible">
                        {/* Top section: Title + Cards */}
                        <div className="flex flex-col gap-2">
                            <div className="border-b pb-2">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-xl font-bold text-gray-900 leading-tight">{slide.title}</h2>
                                    <TLDRButton slide={slide} isFirstProject={slide.title.includes('#1 -')} />
                                </div>
                                {slide.subtitle && <h3 className="text-base text-gray-600 leading-tight mt-0.5">{slide.subtitle}</h3>}
                            </div>

                            <div className="flex flex-row gap-3">
                                {slide.context && (
                                    <div className="w-full bg-gradient-to-r from-slate-50 to-gray-50 p-3 rounded-lg border-l-4 border-gray-500 mb-2 shadow-sm">
                                        <h4 className="font-bold text-gray-800 mb-2 uppercase text-sm tracking-wider flex items-center gap-2">
                                            <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                                            Context & Overview
                                        </h4>
                                        <ul className="space-y-0.5 text-gray-800 text-sm leading-snug">
                                            {slide.context.map((item, i) => (
                                                <li key={i} className="flex items-start">
                                                    <span className="text-gray-500 mr-2 mt-0.5 flex-shrink-0">•</span>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-row gap-3">
                                {slide.challenge && (
                                    <div className="flex-1 bg-gradient-to-br from-red-50 to-orange-50 p-3 rounded-lg border-l-4 border-red-500 shadow-md hover:shadow-lg transition-shadow">
                                        <h4 className="font-bold text-red-800 mb-2 uppercase text-sm tracking-wider flex items-center gap-2">
                                            <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                                            Challenge
                                        </h4>
                                        <ul className="space-y-0.5 text-gray-800 text-sm leading-snug">
                                            {slide.challenge.map((item, i) => (
                                                <li key={i} className="flex items-start">
                                                    <span className="text-red-600 mr-2 mt-0.5 flex-shrink-0 font-bold">•</span>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {slide.solution && (
                                    <div className="flex-1 bg-gradient-to-br from-blue-50 to-cyan-50 p-3 rounded-lg border-l-4 border-blue-500 shadow-md hover:shadow-lg transition-shadow">
                                        <h4 className="font-bold text-blue-800 mb-2 uppercase text-sm tracking-wider flex items-center gap-2">
                                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                            Solution
                                        </h4>
                                        <ul className="space-y-0.5 text-gray-800 text-sm leading-snug">
                                            {slide.solution.map((item, i) => (
                                                <li key={i} className="flex items-start">
                                                    <span className="text-blue-600 mr-2 mt-0.5 flex-shrink-0 font-bold">•</span>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {slide.impact && (
                                    <div className="flex-1 bg-gradient-to-br from-green-50 to-emerald-50 p-3 rounded-lg border-l-4 border-green-500 shadow-md hover:shadow-lg transition-shadow ring-2 ring-green-200">
                                        <h4 className="font-bold text-green-800 mb-2 uppercase text-sm tracking-wider flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                            Impact ⭐
                                        </h4>
                                        <ul className="space-y-0.5 text-gray-800 text-sm leading-snug font-medium">
                                            {slide.impact.map((item, i) => (
                                                <li key={i} className="flex items-start">
                                                    <span className="text-green-600 mr-2 mt-0.5 flex-shrink-0 font-bold">✓</span>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {slide.techs && (
                                <div className="flex flex-wrap gap-1.5 pt-2">
                                    {slide.techs.map((tech, i) => (
                                        <span key={i} className="px-2.5 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 rounded-md text-sm font-bold border border-blue-300 hover:scale-105 transition-transform shadow-sm">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Bottom section: Diagram */}
                        {(slide.mermaid || slide.diagram || slide.image || slide.detailSections) && (
                            <div className="h-[350px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200 overflow-hidden shadow-lg">
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
            case 'skills-chips':
                return (
                    <div className="flex-1 flex flex-col p-12">
                        <div className="flex items-center justify-center gap-3 mb-10">
                            <h2 className="text-4xl font-bold text-gray-900">{slide.title}</h2>
                            {slide.audioUrl && (
                                <PresenterAudio
                                    src={slide.audioUrl}
                                    id={`${slide.id}-audio`}
                                    subtitles={slide.audioSubtitles}
                                />
                            )}
                        </div>
                        <div className="flex-1 flex flex-col gap-10">
                            {slide.hardSkills && slide.hardSkills.length > 0 && (
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-700 mb-4 uppercase tracking-wider">Hard Skills</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {slide.hardSkills.map((skill, i) => (
                                            <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium border border-blue-200">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {slide.softSkills && slide.softSkills.length > 0 && (
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-700 mb-4 uppercase tracking-wider">Soft Skills</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {slide.softSkills.map((skill, i) => (
                                            <span key={i} className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium border border-emerald-200">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        {slide.footer && (
                            <div className="mt-auto pt-6 text-center text-gray-500 text-xl italic">
                                {Array.isArray(slide.footer) ? slide.footer.join(' ') : slide.footer}
                            </div>
                        )}
                    </div>
                );
            case 'why-stockholm':
                return (
                    <div className="flex-1 flex flex-col p-12 bg-gradient-to-br from-blue-50 to-white">
                        <h2 className="text-5xl font-bold text-gray-900 mb-4 text-center">{slide.title}</h2>
                        {slide.subtitle && (
                            <p className="text-2xl text-gray-600 text-center mb-12 italic">{slide.subtitle}</p>
                        )}
                        <div className="grid grid-cols-3 gap-8 flex-1">
                            {slide.columns?.map((col, index) => (
                                <div key={index} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col">
                                    <h3 className="text-2xl font-bold text-blue-700 mb-6">{col.title}</h3>
                                    <p className="text-xl text-gray-700 leading-relaxed">
                                        {col.content[0]}
                                    </p>
                                </div>
                            ))}
                        </div>
                        {slide.footer && (
                            <div className="mt-10 text-center text-xl text-gray-600 italic max-w-4xl mx-auto">
                                {Array.isArray(slide.footer) ? slide.footer.join(' ') : slide.footer}
                            </div>
                        )}
                    </div>
                );
            case 'logistics':
                return (
                    <div className="flex-1 flex flex-col p-8 overflow-visible">
                        <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">{slide.title}</h2>
                        <div className="grid grid-cols-2 gap-6 place-content-center">
                            {slide.cards?.map((card, index) => {
                                const Icon = card.icon ? iconMap[card.icon] : null;
                                // Parse links from description: "url|text||url|text"
                                const parseLinks = (desc: string) => {
                                    if (!desc.includes('|')) return <span>{desc}</span>;
                                    const parts = desc.split('||');
                                    return (
                                        <span className="flex flex-col gap-1">
                                            {parts.map((part, i) => {
                                                const [url, text] = part.split('|');
                                                return (
                                                    <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                        {text}
                                                    </a>
                                                );
                                            })}
                                        </span>
                                    );
                                };
                                return (
                                    <div key={index} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col items-center justify-center text-center">
                                        {Icon && (
                                            <div className="text-blue-600 mb-4">
                                                <Icon size={48} strokeWidth={1.5} />
                                            </div>
                                        )}
                                        <div className="text-5xl font-bold text-blue-600 mb-3">{card.value}</div>
                                        <div className="text-2xl font-semibold text-gray-800 mb-2">{card.title}</div>
                                        <div className="text-lg text-gray-500">{parseLinks(card.description || '')}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div id={slide.id} className={baseClasses} data-slide={slideNumber}>
            {/* Print-only portfolio link */}
            <a
                href="https://portfolio.wagnersilva.eu"
                className="hidden print:block absolute top-4 left-4 text-sm text-blue-600 hover:underline"
            >
                portfolio.wagnersilva.eu
            </a>
            {renderContent()}
            {slide.videoUrl && (
                <PresenterVideo
                    src={slide.videoUrl}
                    id={slide.id}
                    position={slide.videoPosition}
                    subtitles={slide.videoSubtitles}
                    projectTitle={slide.title}
                    posterTime={slide.videoPosterTime}
                    onEnded={slideNumber === 1 ? () => {
                        const nextSlide = document.querySelector(`[data-slide="${slideNumber + 1}"]`);
                        nextSlide?.scrollIntoView({ behavior: 'smooth' });
                    } : undefined}
                />
            )}
        </div>
    );
};
