'use client';

import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
    chart: string;
}

mermaid.initialize({
    startOnLoad: false,
    theme: 'base',
    themeVariables: {
        primaryColor: '#dbeafe',
        primaryTextColor: '#1e3a5f',
        primaryBorderColor: '#3b82f6',
        lineColor: '#3b82f6',
        secondaryColor: '#f0fdf4',
        tertiaryColor: '#fef3c7',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: '14px',
    },
    flowchart: {
        htmlLabels: true,
        curve: 'basis',
        padding: 20,
        nodeSpacing: 50,
        rankSpacing: 80,
    },
});

export const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ chart }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const renderChart = async () => {
            if (containerRef.current) {
                containerRef.current.innerHTML = '';
                const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
                try {
                    const { svg } = await mermaid.render(id, chart);
                    containerRef.current.innerHTML = svg;
                    const svgElement = containerRef.current.querySelector('svg');
                    if (svgElement) {
                        svgElement.style.width = '100%';
                        svgElement.style.height = '100%';
                        svgElement.style.maxWidth = '100%';
                        svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');
                    }
                } catch (error) {
                    console.error('Mermaid rendering error:', error);
                    containerRef.current.innerHTML = `<pre style="color: red;">Error rendering diagram</pre>`;
                }
            }
        };
        renderChart();
    }, [chart]);

    return (
        <div
            ref={containerRef}
            className="w-full h-full flex items-center justify-start p-4"
            style={{ minHeight: '200px' }}
        />
    );
};
