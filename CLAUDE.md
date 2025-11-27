# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Purpose

Data-driven presentation generator that converts structured TypeScript data into printable/exportable PDF slides. Primary use case: creating professional portfolio presentations with architecture diagrams, metrics cards, and multi-layout slide types.

## Development Commands

```bash
npm run dev       # Start Next.js dev server with Turbopack
npm run build     # Production build
npm run start     # Run production build locally
npm run lint      # Run ESLint on codebase
npm run pdf       # Export PDF via Puppeteer (requires dev server running)
```

## How to read app logs in development

just tail the server.log file

## Architecture Overview

### Next.js App Router Structure
```
app/
  ├── layout.tsx      # Root layout with metadata
  ├── globals.css     # Tailwind + print styles
  └── page.tsx        # Home page rendering presentation
components/
  ├── Presentation.tsx  # Print/PDF buttons, slide container ('use client')
  ├── Slide.tsx         # Layout router with icon mapping ('use client')
  ├── Diagram.tsx       # ReactFlow wrapper ('use client')
  └── MermaidDiagram.tsx # Mermaid chart renderer ('use client')
lib/
  ├── types.ts          # SlideData, PresentationData, IconName types
  └── data/             # Presentation data files
      ├── new-presentation.ts
      └── portfolio-data-engineer.ts
public/
  ├── gcp-icons/        # GCP service icons for diagrams
  └── wagner.png        # Profile image
```

### Data-Driven Flow
1. **Data Definition** (`lib/data/*.ts`) → TypeScript objects define slide content
2. **Type System** (`lib/types.ts`) → SlideData interface with 9 layout types, IconName union
3. **Rendering** (`components/`) → Client components with layout-specific rendering
4. **Export** → Browser print to PDF or html2pdf.js download

### Icon System (Server/Client Boundary)
- Icons are passed as **string names** (e.g., `'Code2'`, `'Cloud'`) to avoid serialization issues
- `IconName` type union in `lib/types.ts` defines allowed icon names
- `iconMap` in `Slide.tsx` maps string names to Lucide components
- Add new icons: update `IconName` type and `iconMap` object

### Layout Types & Usage
- `title-only` → Hero slides (opening, closing)
- `section-header` → Section dividers with icon
- `grid-cards` → Metrics/stats showcase (2-6 cards)
- `two-column` / `three-column` → Side-by-side content
- `split-image` → Text content + diagram/image placeholder
- `project-detail` → Context/Challenge/Solution/Impact + diagram area
- `bullets` → Traditional bullet list
- `full-image` → Background image with overlay

### Diagram System (ReactFlow)
- **Component**: `Diagram.tsx` uses `@xyflow/react`
- **Data Format**: Pass `{ nodes: [], edges: [] }` in `SlideData.diagram`
- **Node Types**: Custom `iconNode` type with GCP service icons
- **Icon Source**: `/gcp-icons/[Service Name]/PNG/[Service]-512-color.png`

### Mermaid Diagrams
- **Component**: `MermaidDiagram.tsx` renders Mermaid flowcharts
- **Data Format**: Pass Mermaid syntax string in `SlideData.mermaid`
- **Styling**: Custom theme variables for consistent look

### GCP Icons Directory
19 GCP services available in `public/gcp-icons/`:
- Each service has PNG + SVG formats in subdirectories
- Naming: `[ServiceName]-512-color.{png|svg}`
- Use in diagrams: `/gcp-icons/[Service]/PNG/[icon].png`

### Print/PDF System
- **CSS**: `app/globals.css` defines print media queries
- **Layout**: Landscape orientation, zero margins
- **Color**: `print-color-adjust: exact` preserves colors
- **Pagination**: `break-after-page` class on slides
- **Export Options**:
  - Browser print dialog → Save as PDF
  - html2pdf.js download button (dynamically imported)

## Creating New Presentations

1. **Define Data**: Create `lib/data/[name].ts` following `PresentationData` interface
2. **Use String Icons**: Reference icons by name string (e.g., `icon: 'Code2'`)
3. **Import in page.tsx**: Update import to use new data file
4. **Icon Usage**: For diagrams, reference GCP icons from `/gcp-icons/`
5. **Diagram Nodes**: Use `type: 'iconNode'` with `data.icon` pointing to public icon path

## Styling Approach

- **Framework**: Tailwind CSS 4.1 (PostCSS)
- **Print Optimization**: All colors preserved via `-webkit-print-color-adjust`
- **Responsive**: Fixed h-screen slides (not truly responsive - print-first)
- **Typography**: Large text sizes (2xl-7xl) for readability in presentations

## Common Patterns

### Adding New Slide Layout
1. Add layout type to `SlideData['layout']` union in `lib/types.ts`
2. Add case to switch statement in `components/Slide.tsx` renderContent()
3. Implement rendering logic with consistent spacing (p-8, p-16)

### Adding New Icons
1. Add icon name to `IconName` union in `lib/types.ts`
2. Import icon from `lucide-react` in `components/Slide.tsx`
3. Add to `iconMap` object in `components/Slide.tsx`

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
        icon: '/gcp-icons/BigQuery/PNG/BigQuery-512-color.png'
      }
    }
  ],
  edges: [
    { id: 'e1-2', source: '1', target: '2', animated: true }
  ]
}
```

### Using Mermaid Diagrams
```typescript
mermaid: `flowchart LR
  A[Client] --> B[Server]
  B --> C[(Database)]
  style A fill:#dbeafe,stroke:#3b82f6
  style B fill:#dcfce7,stroke:#22c55e
  style C fill:#e0e7ff,stroke:#6366f1`
```

## Important Constraints

- **Not Mobile Responsive**: Designed for landscape print, fixed viewport
- **Static Data**: All content defined at compile time in TypeScript files
- **Client Components**: All interactive components use 'use client' directive
- **Icon Serialization**: Icons must be string names, not component references
