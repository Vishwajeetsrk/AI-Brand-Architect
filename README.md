# AI Brand Architect - Design System

## Overview

The AI Brand Architect design system is a comprehensive component library and design token system for building AI-powered brand management dashboards. Built with React, TypeScript, Tailwind CSS, and Radix UI.

## Quick Start

### Installation

```bash
npm install
npm run dev
```

### Using Components

```tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function MyPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome to AI Brand Architect</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Get Started</Button>
      </CardContent>
    </Card>
  );
}
```

## Design Tokens

### Colors

| Token | Hex | Description |
|-------|-----|-------------|
| `--primary` | `#7c3aed` | Primary brand color (purple) |
| `--background` | `#07091c` | Dark background |
| `--foreground` | `#e2e8f0` | Light text |
| `--card` | `#0c1022` | Card background |
| `--accent` | `#8b5cf6` | Accent purple |
| `--destructive` | `#ef4444` | Error/danger |

### Typography

- **Primary Font:** Plus Jakarta Sans
- **Monospace Font:** JetBrains Mono

### Border Radius

- `--radius-sm`: 8px
- `--radius-md`: 10px
- `--radius-lg`: 12px
- `--radius-xl`: 16px

## Component Categories

### Form Components
- Button, Input, Textarea, Label, Checkbox, Radio Group, Select, Switch, Slider

### Layout Components
- Card, Separator, Scroll Area, Aspect Ratio, Resizable

### Navigation Components
- Sidebar, Tabs, Breadcrumb, Pagination, Navigation Menu, Menubar

### Overlay Components
- Dialog, Alert Dialog, Drawer, Popover, Tooltip, Hover Card, Sheet

### Data Display Components
- Table, Badge, Avatar, Skeleton, Progress, Calendar

### Feedback Components
- Alert, Toast (Sonner)

### Media Components
- Carousel, Chart

### Utility Components
- Accordion, Collapsible, Command, Context Menu, Dropdown Menu, Toggle, Input OTP

## Tech Stack

- React 18
- TypeScript 5
- Vite 6
- Tailwind CSS 4
- Radix UI
- class-variance-authority (CVA)
- Recharts
- Framer Motion

## File Structure

```
AI Brand Architect System/
├── design-system/
│   ├── DESIGN.md              # Brand specification
│   ├── README.md              # This file
│   ├── components/
│   │   ├── ui/                # 48 UI components
│   │   └── figma/             # Figma components
│   ├── tokens/                # Design tokens & styles
│   ├── icons/                 # SVG icons
│   ├── assets/                # Images & illustrations
│   └── docs/                  # Documentation
├── src/                       # Source files
├── guidelines/                # Brand guidelines
└── package.json               # Dependencies
```

## Documentation

- [DESIGN.md](./design-system/DESIGN.md) - Complete brand specification
- [Guidelines.md](./guidelines/Guidelines.md) - Brand usage guidelines

## Brand

**Brand Name:** AI Brand Architect
**Version:** 1.0.0
**Last Updated:** June 25, 2026
