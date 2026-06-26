# NEXORA Design System & Brand Specification

> **Complete visual identity, 3D design guidelines, and component specifications** for the NEXORA AI Brand Architect platform.

---

## Design Philosophy

### Core Principles

**Clarity Over Complexity**
- Every visual element serves a purpose
- Information hierarchy guides user attention
- No decorative elements without function

**Inclusive & Accessible**
- WCAG 2.1 AA compliance minimum
- Color contrast ≥ 4.5:1 for text
- Keyboard navigation throughout
- Semantic HTML + ARIA labels

**Modern & Scalable**
- Responsive design (mobile-first approach)
- Performance-optimized assets
- Dark mode support
- Theme customization via CSS variables

**Enterprise Professional**
- Polished, trustworthy appearance
- Consistent spacing & alignment
- Clear visual hierarchy
- Appropriate use of white space

---

## Brand Colors

### Primary Palette

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Blue 50** | `#EFF6FF` | 239, 246, 255 | Backgrounds, hover states |
| **Blue 100** | `#DBEAFE` | 219, 254, 254 | Secondary backgrounds |
| **Blue 200** | `#BFDBFE` | 191, 219, 254 | Borders, dividers |
| **Blue 300** | `#93C5FD` | 147, 197, 253 | Accents, highlights |
| **Blue 400** | `#60A5FA` | 96, 165, 250 | Interactive states |
| **Blue 500** | `#3B82F6` | 59, 130, 246 | Links, secondary buttons |
| **Blue 600** | `#2563EB` | 37, 99, 235 | Hover states |
| **Blue 700** | `#1D4ED8` | 29, 78, 216 | Active states |
| **Blue 800** | `#1E40AF` | 30, 64, 175 | **PRIMARY COLOR** |
| **Blue 900** | `#1E3A8A` | 30, 58, 138 | Dark mode primary |

### Secondary Palette

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Amber 50** | `#FFFBEB` | 255, 251, 235 | Warning backgrounds |
| **Amber 400** | `#FBBF24` | 251, 191, 36 | Warning states |
| **Amber 500** | `#F59E0B` | 245, 158, 11 | **SECONDARY COLOR** |
| **Amber 600** | `#D97706` | 217, 119, 6 | Warning emphasis |

### Semantic Colors

| State | Color | Hex | Usage |
|-------|-------|-----|-------|
| **Success** | Emerald 500 | `#10B981` | Confirmed, completed, approved |
| **Warning** | Amber 500 | `#F59E0B` | Alerts, caution, pending review |
| **Error** | Red 500 | `#EF4444` | Errors, destructive actions, failed |
| **Info** | Blue 500 | `#3B82F6` | Information, help, notifications |
| **Neutral** | Gray 500 | `#6B7280` | Disabled, secondary, metadata |

### Neutral Palette (Grays)

```
50   → #F9FAFB  (Almost white, backgrounds)
100  → #F3F4F6
200  → #E5E7EB  (Light borders, dividers)
300  → #D1D5DB
400  → #9CA3AF  (Secondary text)
500  → #6B7280
600  → #4B5563  (Primary text, dark mode)
700  → #374151
800  → #1F2937
900  → #111827  (Pure black, headings, dark mode)
950  → #030712
```

### Dark Mode Palette

```
Background: #0F172A (Slate 900)
Surface:   #1E293B (Slate 800)
Border:    #334155 (Slate 700)
Text:      #E2E8F0 (Slate 200)

Primary:   #3B82F6 (Blue 500, brighter in dark)
Secondary: #FBBF24 (Amber 400, more vibrant)
```

---

## Typography

### Type Scale

| Style | Size | Weight | Line-Height | Letter-Spacing | Usage |
|-------|------|--------|-------------|-----------------|-------|
| **Heading 1** | 48px | 700 | 1.2 (57.6px) | -0.02em | Page titles, main heading |
| **Heading 2** | 36px | 600 | 1.25 (45px) | -0.015em | Section titles |
| **Heading 3** | 24px | 600 | 1.33 (32px) | -0.01em | Subsection titles |
| **Heading 4** | 20px | 600 | 1.4 (28px) | 0 | Card titles |
| **Body Large** | 18px | 400 | 1.5 (27px) | 0 | Large content, callouts |
| **Body Regular** | 16px | 400 | 1.5 (24px) | 0 | Primary body text |
| **Body Small** | 14px | 400 | 1.43 (20px) | 0 | Secondary text, metadata |
| **Caption** | 12px | 400 | 1.33 (16px) | 0.01em | Helper text, labels |
| **Code** | 13px | 500 | 1.5 (19.5px) | 0 | `monospace`, code blocks |

### Font Family

```css
/* Primary: Geometric, modern sans-serif */
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Mono: For code, technical content */
--font-mono: 'Monaco', 'Courier New', monospace;

/* Fallback stack */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
             Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
```

---

## Spacing System

### Base Unit: 4px

```
1 unit  = 4px
2 units = 8px  ← Common spacing
3 units = 12px
4 units = 16px ← Standard padding/margin
6 units = 24px ← Larger spacing
8 units = 32px ← Section spacing
12 units = 48px
16 units = 64px
```

### Common Spacing Values

| Name | Pixels | Usage |
|------|--------|-------|
| `xs` | 4px | Icon spacing |
| `sm` | 8px | Component padding, label spacing |
| `md` | 16px | **Default padding**, section margins |
| `lg` | 24px | Card spacing, between sections |
| `xl` | 32px | Major section separation |
| `2xl` | 48px | Hero sections, page padding |
| `3xl` | 64px | Top-level page margins |

### Tailwind CSS Mapping

```
gap-1   = 4px
gap-2   = 8px
gap-3   = 12px
gap-4   = 16px   ← Default
gap-6   = 24px
gap-8   = 32px
gap-12  = 48px
gap-16  = 64px

p-2     = 8px
p-3     = 12px
p-4     = 16px   ← Default
p-6     = 24px
p-8     = 32px

mx-auto = Horizontal centering
```

---

## Shadow System

### Shadow Levels

| Level | Box-Shadow | Usage |
|-------|-----------|-------|
| **None** | `none` | Flat, no elevation |
| **Subtle** | `0 1px 2px 0 rgb(0 0 0 / 0.05)` | Hover states, borders |
| **Base** | `0 4px 12px 0 rgb(0 0 0 / 0.1)` | Cards, dropdowns (default) |
| **Elevated** | `0 12px 24px 0 rgb(0 0 0 / 0.15)` | Modals, popovers |
| **High** | `0 20px 40px 0 rgb(0 0 0 / 0.2)` | Floating action buttons |

### Application

```tsx
// Card component
<div className="shadow-base rounded-lg bg-white">
  {/* content */}
</div>

// Modal component
<div className="fixed shadow-elevated rounded-xl bg-white">
  {/* modal content */}
</div>

// Hover effect
<button className="hover:shadow-base transition-shadow">
  {/* button text */}
</button>
```

---

## Border Radius

### Radius Values

| Name | Pixels | Usage |
|------|--------|-------|
| `none` | 0px | No rounding (rare) |
| `sm` | 2px | Subtle, line-style elements |
| `base` | 4px | **Default**, buttons, inputs |
| `md` | 8px | Cards, modals, larger components |
| `lg` | 12px | Large containers, hero sections |
| `full` | 9999px | Badges, avatars, pills |

### Tailwind Mapping

```
rounded-none = 0px
rounded-sm   = 2px
rounded      = 4px    ← Default
rounded-md   = 8px
rounded-lg   = 12px
rounded-full = 9999px (circle)
```

---

## Component Specifications

### Buttons

```tsx
// Variants
<Button variant="solid" size="md" color="primary">
  Primary Button
</Button>

<Button variant="outline" size="md" color="primary">
  Outline Button
</Button>

<Button variant="ghost" size="md" color="secondary">
  Ghost Button
</Button>

<Button variant="link" size="md">
  Link Button
</Button>
```

| Variant | Background | Border | Text | Hover | Use Case |
|---------|-----------|--------|------|-------|----------|
| **Solid** | Blue 800 | None | White | Blue 900 | Primary actions |
| **Outline** | Transparent | Gray 300 | Gray 700 | Gray 100 bg | Secondary actions |
| **Ghost** | Transparent | Transparent | Gray 700 | Gray 100 bg | Tertiary actions |
| **Link** | Transparent | Transparent | Blue 800 | Underline | Text links |

**Sizes**: `sm` (32px), `md` (40px), `lg` (48px)

### Form Inputs

```tsx
<Input
  type="text"
  placeholder="Enter your brand name"
  label="Brand Name"
  error="Brand name is required"
  required
/>
```

Specifications:
- **Height**: 40px (md), 36px (sm), 44px (lg)
- **Padding**: 12px horizontal, 8px vertical
- **Border**: 1px solid Gray 300
- **Focus**: Blue 500 border, blue shadow (0 0 0 3px rgba(59, 130, 246, 0.1))
- **Disabled**: Gray 100 bg, Gray 400 text
- **Error**: Red 500 border, red text below

### Cards

```tsx
<Card>
  <CardHeader>
    <h3>Card Title</h3>
  </CardHeader>
  <CardContent>
    {/* Main content */}
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

Specifications:
- **Background**: White (light) / Slate 800 (dark)
- **Border**: 1px solid Gray 200 (light) / Gray 700 (dark)
- **Shadow**: shadow-base
- **Padding**: 24px (lg), 16px (md), 12px (sm)
- **Border Radius**: 8px

### Modals / Dialogs

```tsx
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirm Action</DialogTitle>
    </DialogHeader>
    <DialogBody>
      {/* Content */}
    </DialogBody>
    <DialogFooter>
      <Button variant="ghost" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button variant="solid" onClick={handleConfirm}>
        Confirm
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

Specifications:
- **Size**: 480px (md), 640px (lg)
- **Position**: Center screen
- **Backdrop**: Black 900 with 40% opacity
- **Animation**: Fade in + scale (100% → 100%, 0.3s)
- **Z-index**: 50

### Navigation

```tsx
// Sidebar Navigation
<Sidebar>
  <NavSection title="Main">
    <NavLink to="/brands" icon={<BrandIcon />}>
      Brands
    </NavLink>
    <NavLink to="/projects" icon={<ProjectIcon />}>
      Projects
    </NavLink>
  </NavSection>
</Sidebar>

// Top Navigation
<TopNav>
  <NavBrand logo={<Logo />} />
  <NavSearch />
  <NavNotifications />
  <NavUser />
</TopNav>
```

Specifications:
- **Sidebar Width**: 256px (expanded), 64px (collapsed)
- **Top Nav Height**: 64px
- **Active Link**: Blue 100 background, Blue 800 text
- **Hover**: Gray 100 background
- **Icons**: 20px × 20px

---

## 3D Design Elements

### Logo 3D Model

```javascript
// Three.js/React Three Fiber implementation
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';

export function Logo3D() {
  const { scene } = useGLTF('/models/nexora-logo.glb');
  
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
      <primitive object={scene} />
      <OrbitControls autoRotate />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
    </Canvas>
  );
}
```

### Brand Visualization (3D Scatter)

```
Position: XYZ color space (Lab color space for perceptual accuracy)
Points: Individual brand assets (logos, colors, typographies)
Clusters: Brand categories, competitors
Interaction: Rotate, zoom, hover for details

Rendering: Three.js Points geometry for performance
Performance: LOD (Level of Detail) based on zoom level
```

### Market Positioning (3D Landscape)

```
Axes:
  X: Price (low ← → high)
  Y: Innovation (traditional ← → cutting-edge)
  Z: Market size (small ← → large)

Plot: Competitors + your brand as 3D points
Interaction: Drag to explore positioning
Animation: Smooth transitions as market shifts
```

---

## Responsive Design

### Breakpoints

```css
/* Mobile-first approach */
sm  = 640px   (small phones)
md  = 768px   (tablets, large phones)
lg  = 1024px  (laptops)
xl  = 1280px  (desktops)
2xl = 1536px  (large displays)

/* Tailwind CSS */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
```

### Layout Grids

```
Mobile (< 640px)
  ├─ 1 column
  ├─ Full-width components
  └─ Touch-friendly spacing (48px minimum tap target)

Tablet (640px - 1024px)
  ├─ 2 columns
  ├─ Sidebar nav + content
  └─ Medium spacing

Desktop (> 1024px)
  ├─ 12-column grid
  ├─ Sidebar nav + main content + right panel
  └─ Optimized spacing for reading
```

---

## Animation & Motion

### Timing Functions

```css
/* Easing */
ease-in-out = cubic-bezier(0.4, 0, 0.2, 1)  /* Default, smooth */
ease-in     = cubic-bezier(0.4, 0, 1, 1)    /* Accelerating */
ease-out    = cubic-bezier(0, 0, 0.2, 1)    /* Decelerating */
linear      = linear                         /* Constant speed */

/* Duration */
150ms = Micro-interactions (hover, focus)
300ms = Component transitions (open/close)
500ms = Page transitions
1000ms+ = Complex animations
```

### Common Animations

```tsx
// Fade in
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
animation: fadeIn 300ms ease-out;

// Slide up
@keyframes slideUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
animation: slideUp 300ms ease-out;

// Scale in (modal)
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
animation: scaleIn 300ms ease-out;
```

---

## Icons

### Icon Set

**Using**: Lucide React + Material UI Icons v7

```
Common icons:
  ├── Navigation: menu, chevron-right, arrow-left
  ├── Action: plus, edit, delete, download
  ├── Status: check, x, alert, info, help
  ├── Social: share, bookmark, thumbs-up
  └── Business: briefcase, users, settings, bell

Size: 16px (small), 20px (default), 24px (large)
Color: Inherit from text color or use semantic colors
```

### Icon Specifications

```
16px × 16px → Label text, data tables
20px × 20px → Default for buttons, navigation
24px × 24px → Section headers, large buttons
32px × 32px → Hero/feature sections
```

---

## Data Visualization

### Charts

```typescript
// Bar chart (Recharts)
<BarChart data={data}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="name" />
  <YAxis />
  <Tooltip />
  <Bar dataKey="value" fill="#1E40AF" />
</BarChart>

// Line chart (trend)
<LineChart data={data}>
  <Line 
    type="monotone" 
    dataKey="value" 
    stroke="#1E40AF" 
    strokeWidth={2}
    dot={{ fill: '#1E40AF', r: 4 }}
  />
</LineChart>

// Pie chart (composition)
<PieChart>
  <Pie
    data={data}
    fill="#1E40AF"
    label
  />
</PieChart>
```

### Chart Colors

```
Primary:    #1E40AF (Blue 800)
Secondary:  #F59E0B (Amber 500)
Success:    #10B981 (Emerald 500)
Warning:    #EF4444 (Red 500)
Neutral:    #9CA3AF (Gray 400)
```

---

## Accessibility Guidelines

### WCAG 2.1 AA Compliance

✅ **Color Contrast**
- Text: 4.5:1 minimum
- Large text (18pt+): 3:1 minimum
- Components: 3:1 minimum

✅ **Keyboard Navigation**
- Tab order logical (top-to-bottom, left-to-right)
- Focus indicators visible (min 2px outline)
- Keyboard-accessible all interactive elements

✅ **Screen Readers**
- Semantic HTML (button, link, form, nav)
- ARIA labels for icon-only buttons
- Form labels associated with inputs
- List semantics for navigation

✅ **Motion & Animation**
- `prefers-reduced-motion` honored
- Animations ≤ 5 seconds
- No auto-playing content

### Testing

```bash
# Accessibility audit
npm install -g axe-cli
axe http://localhost:5173

# Visual contrast
# Use WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/

# Keyboard navigation
# Tab through entire site, no focus trap
# Test with Tab, Shift+Tab, Enter, Space, Escape

# Screen reader (VoiceOver on Mac)
# Cmd+F5 to enable, then navigate with VO (Control+Option)
```

---

## Dark Mode

### Implementation

```tsx
// Use CSS variables
:root {
  --bg-primary: #FFFFFF;
  --text-primary: #111827;
  --border: #E5E7EB;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #0F172A;
    --text-primary: #E2E8F0;
    --border: #334155;
  }
}

// Apply in components
.card {
  background: var(--bg-primary);
  color: var(--text-primary);
  border: 1px solid var(--border);
}
```

### Dark Mode Colors

```
Background:   #0F172A (Slate 900)
Surface:      #1E293B (Slate 800)
Elevation:    #334155 (Slate 700)
Border:       #475569 (Slate 600)
Text Primary: #E2E8F0 (Slate 200)
Text Secondary: #CBD5E1 (Slate 300)

Primary:      #3B82F6 (Blue 500, brighter)
Secondary:    #FBBF24 (Amber 400, more vibrant)
Success:      #34D399 (Emerald 400)
Warning:      #F97316 (Orange 500)
Error:        #EF5350 (Red 400)
```

---

## Design Assets Download

- **Figma File**: [Link to NEXORA Figma workspace]
- **Component Library**: `design-system/components.tsx`
- **Token JSON**: `design-system/tokens.json`
- **Icons SVG**: `public/icons/`
- **3D Models**: `public/models/` (`.glb` format)

---

## Design Debt & Roadmap

### Current (v0.2.0)
✅ Basic component library
✅ Color system
✅ Typography scale
✅ Responsive breakpoints

### Upcoming (v0.3.0)
🚧 Component animations
🚧 Dark mode refinements
🚧 3D visualizations
🚧 Accessibility audit + fixes

### Future (v1.0.0)
❌ Design tokens editor UI
❌ Component composition library
❌ Themeable design system
❌ Storybook integration

---

**Design System Version**: 0.2.0 | **Last Updated**: June 26, 2026 | **Maintained by**: Design System Team
