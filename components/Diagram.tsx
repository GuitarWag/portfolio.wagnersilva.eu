'use client';

import React, { useCallback, useMemo } from 'react';
import {
    ReactFlow,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    BackgroundVariant,
    Handle,
    Position,
    MarkerType,
} from '@xyflow/react';
import type { Connection, NodeProps } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

interface DiagramProps {
    initialNodes: any[];
    initialEdges: any[];
}

const IconNode = ({ data }: NodeProps) => {
    return (
        <div className="px-3 py-2 shadow-lg rounded-lg bg-white border-2 border-blue-200 flex flex-col items-center min-w-[90px] max-w-[120px]">
            <Handle type="target" position={Position.Left} className="!w-2 !h-2 !bg-blue-500 !border-0" />
            <Handle type="target" position={Position.Top} className="!w-2 !h-2 !bg-blue-500 !border-0" id="top" />
            {data.icon ? (
                <div className="mb-1">
                    <img src={String(data.icon)} alt={String(data.label)} className="w-10 h-10 object-contain" />
                </div>
            ) : null}
            <div className="text-xs font-semibold text-gray-700 text-center leading-tight whitespace-pre-line">{String(data.label)}</div>
            <Handle type="source" position={Position.Right} className="!w-2 !h-2 !bg-blue-500 !border-0" />
            <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 !bg-blue-500 !border-0" id="bottom" />
        </div>
    );
};

export const Diagram: React.FC<DiagramProps> = ({ initialNodes, initialEdges }) => {
    const [nodes, , onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(
        initialEdges.map(edge => ({
            ...edge,
            style: { stroke: '#3b82f6', strokeWidth: 2 },
            markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' },
            labelStyle: { fontSize: 10, fontWeight: 600, fill: '#374151' },
            labelBgStyle: { fill: '#f3f4f6', fillOpacity: 0.9 },
            labelBgPadding: [4, 2] as [number, number],
            labelBgBorderRadius: 4,
        }))
    );

    const nodeTypes = useMemo(() => ({ iconNode: IconNode }), []);

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
                fitViewOptions={{
                    padding: { top: 0.2, bottom: 0.2, left: 0.1, right: 0.5 },
                    minZoom: 0.3,
                    maxZoom: 0.9,
                }}
                minZoom={0.3}
                maxZoom={1}
                proOptions={{ hideAttribution: true }}
                nodesDraggable={false}
                nodesConnectable={false}
                elementsSelectable={false}
                panOnDrag={false}
                zoomOnScroll={false}
                zoomOnPinch={false}
                zoomOnDoubleClick={false}
            >
                <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#e5e7eb" />
            </ReactFlow>
        </div>
    );
};
