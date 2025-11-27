# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Purpose

Data-driven presentation generator that converts structured TypeScript data into printable/exportable PDF slides. Primary use case: creating professional portfolio presentations with architecture diagrams, metrics cards, and multi-layout slide types.

## Development Commands

```bash
npm run dev       # Start Vite dev server with HMR
npm run build     # TypeScript check + Vite production build
npm run preview   # Preview production build locally
npm run lint      # Run ESLint on codebase
```

## Architecture Overview

### Data-Driven Flow
1. **Data Definition** (`src/data/*.ts`) → TypeScript objects define slide content
2. **Type System** (`src/types.ts`) → SlideData interface with 9 layout types
3. **Rendering** (`src/components/`) → Layout-specific rendering logic
4. **Export** → Browser print to PDF (landscape, exact colors)

### Component Hierarchy
```
App.tsx
  └─ Presentation.tsx (print button, slide container)
      └─ Slide.tsx (layout router)
          ├─ Diagram.tsx (ReactFlow wrapper for architecture diagrams)
          └─ Layout renderers (inline switch statement)
```

### Layout Types & Usage
- `title-only` → Hero slides (opening, closing)
- `section-header` → Section dividers with icon
- `grid-cards` → Metrics/stats showcase (2-6 cards)
- `two-column` / `three-column` → Side-by-side content
- `split-image` → Text content + diagram/image placeholder
- `project-detail` → Challenge/Solution/Impact + full diagram area
- `bullets` → Traditional bullet list
- `full-image` → Background image with overlay

### Diagram System (ReactFlow)
- **Component**: `Diagram.tsx` uses `@xyflow/react`
- **Data Format**: Pass `{ nodes: [], edges: [] }` in `SlideData.diagram`
- **Node Types**: Custom `iconNode` type with GCP service icons
- **Icon Source**: `src/gcp-icons/[Service Name]/PNG/[Service]-512-color.png`

### GCP Icons Directory
19 GCP services available in `src/gcp-icons/`:
- Each service has PNG + SVG formats in subdirectories
- Naming: `[ServiceName]-512-color.{png|svg}`
- Use in diagrams by referencing: `/src/gcp-icons/[Service]/PNG/[icon].png`

### Print/PDF System
- **CSS**: `src/index.css` defines print media queries
- **Layout**: Landscape orientation, zero margins
- **Color**: `print-color-adjust: exact` preserves colors
- **Pagination**: `break-after-page` class on slides
- **Export**: Browser's print dialog → Save as PDF

## Creating New Presentations

1. **Define Data**: Create `src/data/[name].ts` following `PresentationData` interface
2. **Import in App**: Replace `portfolioData` import in `App.tsx`
3. **Icon Usage**: Reference GCP icons from `src/gcp-icons/` for diagram nodes
4. **Diagram Nodes**: Use `type: 'iconNode'` with `data.icon` pointing to icon path

## Styling Approach

- **Framework**: Tailwind CSS 4.1 (PostCSS)
- **Print Optimization**: All colors preserved via `-webkit-print-color-adjust`
- **Responsive**: Fixed h-screen slides (not truly responsive - print-first)
- **Typography**: Large text sizes (2xl-7xl) for readability in presentations

## Common Patterns

### Adding New Slide Layout
1. Add layout type to `SlideData['layout']` union in `types.ts`
2. Add case to switch statement in `Slide.tsx` renderContent()
3. Implement rendering logic with consistent spacing (p-8, p-16)

### Creating Architecture Diagrams
```typescript
diagram: {
  nodes: [
    {
      id: '1',
      type: 'iconNode',
      position: { x: 100, y: 100 },
      data: {
        label: 'BigQuery',
        icon: '/src/gcp-icons/BigQuery/PNG/BigQuery-512-color.png'
      }
    }
  ],
  edges: [
    { id: 'e1-2', source: '1', target: '2', animated: true }
  ]
}
```

## Important Constraints

- **Not Mobile Responsive**: Designed for landscape print, fixed 1920x1080 viewport
- **No Version Control**: Repository not initialized as git repo
- **Static Data**: All content defined at compile time in TypeScript files
- **Print-Only Export**: No programmatic PDF generation, relies on browser print
