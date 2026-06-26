# AI Brand Architect - Design System

## Brand Identity

**Brand Name:** AI Brand Architect
**Tagline:** Intelligent Brand Building Powered by AI
**Design Philosophy:** Dark-first, purple-accented, modern dashboard aesthetic

---

## Color System

### Primary Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `--primary` | `#7c3aed` | Primary actions, CTAs, active states |
| `--primary-foreground` | `#ffffff` | Text on primary backgrounds |
| `--accent` | `#8b5cf6` | Hover states, secondary emphasis |
| `--accent-foreground` | `#ffffff` | Text on accent backgrounds |

### Background Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `--background` | `#07091c` | Main page background |
| `--foreground` | `#e2e8f0` | Primary text color |
| `--card` | `#0c1022` | Card backgrounds |
| `--card-foreground` | `#e2e8f0` | Text on cards |
| `--popover` | `#111830` | Dropdown/popover backgrounds |
| `--popover-foreground` | `#e2e8f0` | Text on popovers |

### UI Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `--secondary` | `#111830` | Secondary backgrounds |
| `--secondary-foreground` | `#e2e8f0` | Text on secondary |
| `--muted` | `#0f1628` | Muted backgrounds |
| `--muted-foreground` | `#64748b` | Subtle/muted text |
| `--destructive` | `#ef4444` | Error states, destructive actions |
| `--destructive-foreground` | `#ffffff` | Text on destructive |

### Border & Input Colors
| Token | Hex/RGBA | Usage |
|-------|----------|-------|
| `--border` | `rgba(124, 58, 237, 0.12)` | Subtle purple borders |
| `--input` | `#111830` | Input field backgrounds |
| `--input-background` | `#111830` | Input fill color |
| `--switch-background` | `#1e2048` | Switch track color |
| `--ring` | `rgba(124, 58, 237, 0.4)` | Focus ring color |

### Chart Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `--chart-1` | `#7c3aed` | Chart series 1 (purple) |
| `--chart-2` | `#0ea5e9` | Chart series 2 (sky blue) |
| `--chart-3` | `#10b981` | Chart series 3 (emerald) |
| `--chart-4` | `#f59e0b` | Chart series 4 (amber) |
| `--chart-5` | `#ef4444` | Chart series 5 (red) |

### Sidebar Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `--sidebar` | `#060912` | Sidebar background |
| `--sidebar-foreground` | `#e2e8f0` | Sidebar text |
| `--sidebar-primary` | `#7c3aed` | Sidebar active items |
| `--sidebar-primary-foreground` | `#ffffff` | Text on sidebar primary |
| `--sidebar-accent` | `rgba(124, 58, 237, 0.15)` | Sidebar hover states |
| `--sidebar-accent-foreground` | `#e2e8f0` | Text on sidebar accent |
| `--sidebar-border` | `rgba(124, 58, 237, 0.08)` | Sidebar dividers |
| `--sidebar-ring` | `rgba(124, 58, 237, 0.4)` | Sidebar focus ring |

---

## Typography

### Font Families
- **Primary:** `'Plus Jakarta Sans', system-ui, sans-serif`
- **Monospace:** `'JetBrains Mono', monospace`

### Font Sizes
| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| `h1` | `1.75rem` (28px) | 700 | 1.25 |
| `h2` | `1.375rem` (22px) | 600 | 1.35 |
| `h3` | `1.1rem` (17.6px) | 600 | 1.4 |
| `h4` | `0.9375rem` (15px) | 600 | 1.5 |
| `label` | `0.8125rem` (13px) | 500 | 1.5 |
| `button` | `0.8125rem` (13px) | 600 | 1.5 |
| `input` | `0.8125rem` (13px) | 400 | 1.5 |
| `body` | `var(--font-size)` (14px) | 400 | - |

### Font Weights
| Token | Value |
|-------|-------|
| `--font-weight-medium` | `600` |
| `--font-weight-normal` | `400` |

---

## Spacing & Radius

### Border Radius
| Token | Value | Usage |
|-------|-------|-------|
| `--radius` | `0.75rem` (12px) | Base radius |
| `--radius-sm` | `calc(var(--radius) - 4px)` (8px) | Small radius |
| `--radius-md` | `calc(var(--radius) - 2px)` (10px) | Medium radius |
| `--radius-lg` | `var(--radius)` (12px) | Large radius |
| `--radius-xl` | `calc(var(--radius) + 4px)` (16px) | Extra large radius |

---

## Component Library

### UI Components (48 total)

#### Form Components
- `button.tsx` - Button with variants (default, destructive, outline, secondary, ghost, link)
- `input.tsx` - Text input field
- `textarea.tsx` - Multi-line text input
- `label.tsx` - Form field label
- `checkbox.tsx` - Checkbox input
- `radio-group.tsx` - Radio button group
- `select.tsx` - Dropdown select
- `switch.tsx` - Toggle switch
- `slider.tsx` - Range slider
- `form.tsx` - Form wrapper with validation

#### Layout Components
- `card.tsx` - Card container with header, content, footer
- `separator.tsx` - Horizontal/vertical divider
- `scroll-area.tsx` - Custom scrollbar container
- `aspect-ratio.tsx` - Responsive aspect ratio wrapper
- `resizable.tsx` - Resizable panel group

#### Navigation Components
- `sidebar.tsx` - Full sidebar with provider pattern
- `tabs.tsx` - Tab navigation
- `breadcrumb.tsx` - Breadcrumb navigation
- `pagination.tsx` - Page navigation
- `navigation-menu.tsx` - Navigation menu
- `menubar.tsx` - Menu bar

#### Overlay Components
- `dialog.tsx` - Modal dialog
- `alert-dialog.tsx` - Confirmation dialog
- `drawer.tsx` - Slide-out drawer
- `popover.tsx` - Popover content
- `tooltip.tsx` - Tooltip on hover
- `hover-card.tsx` - Rich hover preview
- `sheet.tsx` - Side sheet overlay

#### Data Display Components
- `table.tsx` - Data table
- `badge.tsx` - Status badges
- `avatar.tsx` - User avatar with fallback
- `skeleton.tsx` - Loading skeleton
- `progress.tsx` - Progress bar
- `calendar.tsx` - Date picker calendar

#### Feedback Components
- `alert.tsx` - Alert messages
- `sonner.tsx` - Toast notifications

#### Media Components
- `carousel.tsx` - Image/content carousel
- `chart.tsx` - Chart wrapper (Recharts)

#### Utility Components
- `accordion.tsx` - Collapsible content sections
- `collapsible.tsx` - Simple collapsible
- `command.tsx` - Command palette (cmdk)
- `context-menu.tsx` - Right-click context menu
- `dropdown-menu.tsx` - Dropdown menu
- `toggle.tsx` - Toggle button
- `toggle-group.tsx` - Toggle button group
- `input-otp.tsx` - OTP input fields
- `use-mobile.ts` - Mobile detection hook
- `utils.ts` - cn() utility (clsx + tailwind-merge)

#### Figma Components
- `ImageWithFallback.tsx` - Image with error fallback

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.x | UI framework |
| TypeScript | 5.x | Type safety |
| Vite | 6.x | Build tool |
| Tailwind CSS | 4.x | Utility-first CSS |
| Radix UI | Latest | Headless components |
| CVA | Latest | Variant management |
| Recharts | Latest | Chart library |
| Framer Motion | Latest | Animations |
| class-variance-authority | Latest | Component variants |
| clsx | Latest | Conditional classes |
| tailwind-merge | Latest | Class merging |

---

## Design Tokens JSON

```json
{
  "colors": {
    "primary": "#7c3aed",
    "primary-foreground": "#ffffff",
    "background": "#07091c",
    "foreground": "#e2e8f0",
    "card": "#0c1022",
    "card-foreground": "#e2e8f0",
    "popover": "#111830",
    "popover-foreground": "#e2e8f0",
    "secondary": "#111830",
    "secondary-foreground": "#e2e8f0",
    "muted": "#0f1628",
    "muted-foreground": "#64748b",
    "accent": "#8b5cf6",
    "accent-foreground": "#ffffff",
    "destructive": "#ef4444",
    "destructive-foreground": "#ffffff",
    "border": "rgba(124, 58, 237, 0.12)",
    "input": "#111830",
    "ring": "rgba(124, 58, 237, 0.4)",
    "chart-1": "#7c3aed",
    "chart-2": "#0ea5e9",
    "chart-3": "#10b981",
    "chart-4": "#f59e0b",
    "chart-5": "#ef4444",
    "sidebar": "#060912",
    "sidebar-foreground": "#e2e8f0",
    "sidebar-primary": "#7c3aed",
    "sidebar-primary-foreground": "#ffffff",
    "sidebar-accent": "rgba(124, 58, 237, 0.15)",
    "sidebar-accent-foreground": "#e2e8f0",
    "sidebar-border": "rgba(124, 58, 237, 0.08)",
    "sidebar-ring": "rgba(124, 58, 237, 0.4)"
  },
  "fonts": {
    "primary": "'Plus Jakarta Sans', system-ui, sans-serif",
    "mono": "'JetBrains Mono', monospace"
  },
  "radius": {
    "sm": "8px",
    "md": "10px",
    "lg": "12px",
    "xl": "16px"
  }
}
```

---

## Usage Guidelines

### Importing Components
```tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
```

### Applying Variants
```tsx
<Button variant="default">Primary Action</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>
<Button variant="ghost">Skip</Button>
```

### Using Design Tokens
```css
.my-component {
  background: var(--card);
  color: var(--foreground);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
}
```

---

## File Structure

```
AI Brand Architect System/
├── design-system/
│   ├── DESIGN.md              # This file
│   ├── README.md              # Getting started guide
│   ├── components/
│   │   ├── ui/                # 48 UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   └── ...
│   │   └── figma/             # Figma-specific components
│   │       └── ImageWithFallback.tsx
│   ├── tokens/
│   │   ├── theme.css          # CSS custom properties
│   │   ├── fonts.css          # Google Fonts import
│   │   ├── tailwind.css       # Tailwind v4 config
│   │   ├── globals.css        # Global styles
│   │   └── index.css          # Entry point styles
│   ├── icons/                 # SVG icon library
│   ├── assets/                # Images, illustrations, patterns
│   │   ├── dashboard/         # Dashboard UI screenshots
│   │   ├── illustrations/     # AI-generated illustrations
│   │   ├── gradients/         # Gradient backgrounds
│   │   └── patterns/          # Decorative patterns
│   └── docs/                  # Component documentation
├── src/
│   ├── App.tsx                # Main application (30+ screens)
│   └── imports/               # Figma asset imports
├── guidelines/
│   └── Guidelines.md          # Brand guidelines
├── package.json               # Dependencies
├── vite.config.ts             # Build configuration
└── index.html                 # Entry HTML
```

---

## Version

**Design System Version:** 1.0.0
**Last Updated:** June 25, 2026
**Brand:** AI Brand Architect
