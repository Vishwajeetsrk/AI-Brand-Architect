# AI Brand Architect - Component Documentation

## Table of Contents

1. [Form Components](#form-components)
2. [Layout Components](#layout-components)
3. [Navigation Components](#navigation-components)
4. [Overlay Components](#overlay-components)
5. [Data Display Components](#data-display-components)
6. [Feedback Components](#feedback-components)
7. [Media Components](#media-components)
8. [Utility Components](#utility-components)

---

## Form Components

### Button

**File:** `components/ui/button.tsx`

A versatile button component with multiple variants and sizes.

**Variants:**
- `default` - Primary purple button
- `destructive` - Red danger button
- `outline` - Border only button
- `secondary` - Secondary background
- `ghost` - Transparent with hover
- `link` - Underlined link style

**Sizes:**
- `default` - Standard size (h-9)
- `sm` - Small size (h-8)
- `lg` - Large size (h-10)
- `icon` - Square icon button (size-9)

**Usage:**
```tsx
import { Button } from "@/components/ui/button";

<Button>Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline" size="sm">Small</Button>
<Button size="icon"><IconName /></Button>
```

---

### Input

**File:** `components/ui/input.tsx`

Text input field with consistent styling.

**Usage:**
```tsx
import { Input } from "@/components/ui/input";

<Input type="text" placeholder="Enter text..." />
<Input type="email" placeholder="Email" />
<Input type="password" placeholder="Password" />
```

---

### Textarea

**File:** `components/ui/textarea.tsx`

Multi-line text input area.

**Usage:**
```tsx
import { Textarea } from "@/components/ui/textarea";

<Textarea placeholder="Enter message..." rows={4} />
```

---

### Label

**File:** `components/ui/label.tsx`

Form field label component.

**Usage:**
```tsx
import { Label } from "@/components/ui/label";

<Label htmlFor="email">Email Address</Label>
```

---

### Checkbox

**File:** `components/ui/checkbox.tsx`

Checkbox input with label support.

**Usage:**
```tsx
import { Checkbox } from "@/components/ui/checkbox";

<div className="flex items-center space-x-2">
  <Checkbox id="terms" />
  <Label htmlFor="terms">Accept terms</Label>
</div>
```

---

### Radio Group

**File:** `components/ui/radio-group.tsx`

Radio button group for single selection.

**Usage:**
```tsx
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

<RadioGroup defaultValue="option1">
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option1" id="r1" />
    <Label htmlFor="r1">Option 1</Label>
  </div>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option2" id="r2" />
    <Label htmlFor="r2">Option 2</Label>
  </div>
</RadioGroup>
```

---

### Select

**File:** `components/ui/select.tsx`

Dropdown select component.

**Usage:**
```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

<Select>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Select a fruit" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="apple">Apple</SelectItem>
    <SelectItem value="banana">Banana</SelectItem>
    <SelectItem value="cherry">Cherry</SelectItem>
  </SelectContent>
</Select>
```

---

### Switch

**File:** `components/ui/switch.tsx`

Toggle switch for boolean values.

**Usage:**
```tsx
import { Switch } from "@/components/ui/switch";

<div className="flex items-center space-x-2">
  <Switch id="airplane-mode" />
  <Label htmlFor="airplane-mode">Airplane Mode</Label>
</div>
```

---

### Slider

**File:** `components/ui/slider.tsx`

Range slider for numeric values.

**Usage:**
```tsx
import { Slider } from "@/components/ui/slider";

<Slider defaultValue={[50]} max={100} step={1} />
```

---

### Form

**File:** `components/ui/form.tsx`

Form wrapper with validation support (uses react-hook-form).

**Usage:**
```tsx
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="username"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Username</FormLabel>
          <FormControl>
            <Input placeholder="shadcn" {...field} />
          </FormControl>
          <FormDescription>This is your public display name.</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
    <Button type="submit">Submit</Button>
  </form>
</Form>
```

---

## Layout Components

### Card

**File:** `components/ui/card.tsx`

Flexible card container with header, content, and footer sections.

**Usage:**
```tsx
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description goes here</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

---

### Separator

**File:** `components/ui/separator.tsx`

Horizontal or vertical divider line.

**Usage:**
```tsx
import { Separator } from "@/components/ui/separator";

<Separator />
<Separator orientation="vertical" className="h-4" />
```

---

### Scroll Area

**File:** `components/ui/scroll-area.tsx`

Custom scrollbar container for overflow content.

**Usage:**
```tsx
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

<ScrollArea className="h-[200px] w-[350px] rounded-md border p-4">
  <p>Content that scrolls...</p>
  <ScrollBar orientation="vertical" />
</ScrollArea>
```

---

### Aspect Ratio

**File:** `components/ui/aspect-ratio.tsx`

Responsive aspect ratio wrapper.

**Usage:**
```tsx
import { AspectRatio } from "@/components/ui/aspect-ratio";

<AspectRatio ratio={16 / 9}>
  <img src="..." alt="..." className="rounded-md object-cover" />
</AspectRatio>
```

---

### Resizable

**File:** `components/ui/resizable.tsx`

Resizable panel group for adjustable layouts.

**Usage:**
```tsx
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

<ResizablePanelGroup direction="horizontal">
  <ResizablePanel defaultSize={50}>
    <div className="flex h-full items-center justify-center p-6">
      <span className="font-semibold">One</span>
    </div>
  </ResizablePanel>
  <ResizableHandle />
  <ResizablePanel defaultSize={50}>
    <div className="flex h-full items-center justify-center p-6">
      <span className="font-semibold">Two</span>
    </div>
  </ResizablePanel>
</ResizablePanelGroup>
```

---

## Navigation Components

### Sidebar

**File:** `components/ui/sidebar.tsx`

Full sidebar navigation with provider pattern.

**Usage:**
```tsx
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

<SidebarProvider>
  <Sidebar>
    <SidebarHeader>
      <h2>AI Brand Architect</h2>
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Navigation</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>Dashboard</SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter>
      <p>Footer content</p>
    </SidebarFooter>
  </Sidebar>
  <main>
    <SidebarTrigger />
    {/* Page content */}
  </main>
</SidebarProvider>
```

---

### Tabs

**File:** `components/ui/tabs.tsx`

Tab navigation component.

**Usage:**
```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

<Tabs defaultValue="account">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account">Account content</TabsContent>
  <TabsContent value="password">Password content</TabsContent>
</Tabs>
```

---

### Breadcrumb

**File:** `components/ui/breadcrumb.tsx`

Breadcrumb navigation for page hierarchy.

**Usage:**
```tsx
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Current Page</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

---

### Pagination

**File:** `components/ui/pagination.tsx`

Page navigation for lists and tables.

**Usage:**
```tsx
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious href="#" />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#">1</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationNext href="#" />
    </PaginationItem>
  </PaginationContent>
</Pagination>
```

---

### Navigation Menu

**File:** `components/ui/navigation-menu.tsx`

Complex navigation menu with dropdowns.

**Usage:**
```tsx
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";

<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuTrigger>Getting Started</NavigationMenuTrigger>
      <NavigationMenuContent>
        <NavigationMenuLink>Introduction</NavigationMenuLink>
      </NavigationMenuContent>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>
```

---

### Menubar

**File:** `components/ui/menubar.tsx`

Desktop application-style menu bar.

**Usage:**
```tsx
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarTrigger } from "@/components/ui/menubar";

<Menubar>
  <MenubarMenu>
    <MenubarTrigger>File</MenubarTrigger>
    <MenubarContent>
      <MenubarItem>New Tab <MenubarShortcut>⌘T</MenubarShortcut></MenubarItem>
      <MenubarSeparator />
      <MenubarItem>Print...</MenubarItem>
    </MenubarContent>
  </MenubarMenu>
</Menubar>
```

---

## Overlay Components

### Dialog

**File:** `components/ui/dialog.tsx`

Modal dialog for focused interactions.

**Usage:**
```tsx
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>Dialog description goes here</DialogDescription>
    </DialogHeader>
    <div>Dialog content</div>
    <DialogFooter>
      <Button type="submit">Save changes</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

### Alert Dialog

**File:** `components/ui/alert-dialog.tsx`

Confirmation dialog for destructive actions.

**Usage:**
```tsx
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">Delete</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
      <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

---

### Drawer

**File:** `components/ui/drawer.tsx`

Slide-out drawer panel.

**Usage:**
```tsx
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";

<Drawer>
  <DrawerTrigger asChild>
    <Button>Open Drawer</Button>
  </DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Drawer Title</DrawerTitle>
      <DrawerDescription>Drawer description</DrawerDescription>
    </DrawerHeader>
    <div className="p-4">Drawer content</div>
    <DrawerFooter>
      <Button>Submit</Button>
      <DrawerClose asChild>
        <Button variant="outline">Cancel</Button>
      </DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>
```

---

### Popover

**File:** `components/ui/popover.tsx`

Floating popover content.

**Usage:**
```tsx
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

<Popover>
  <PopoverTrigger asChild>
    <Button>Open Popover</Button>
  </PopoverTrigger>
  <PopoverContent className="w-80">
    <div>Popover content</div>
  </PopoverContent>
</Popover>
```

---

### Tooltip

**File:** `components/ui/tooltip.tsx`

Tooltip on hover.

**Usage:**
```tsx
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button>Hover me</Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>Tooltip text</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

---

### Hover Card

**File:** `components/ui/hover-card.tsx`

Rich content preview on hover.

**Usage:**
```tsx
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

<HoverCard>
  <HoverCardTrigger asChild>
    <a href="#">Hover me</a>
  </HoverCardTrigger>
  <HoverCardContent className="w-80">
    <div>Rich preview content</div>
  </HoverCardContent>
</HoverCard>
```

---

### Sheet

**File:** `components/ui/sheet.tsx`

Side sheet overlay panel.

**Usage:**
```tsx
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

<Sheet>
  <SheetTrigger asChild>
    <Button>Open Sheet</Button>
  </SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Sheet Title</SheetTitle>
      <SheetDescription>Sheet description</SheetDescription>
    </SheetHeader>
    <div>Sheet content</div>
  </SheetContent>
</Sheet>
```

---

## Data Display Components

### Table

**File:** `components/ui/table.tsx`

Data table for displaying structured data.

**Usage:**
```tsx
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";

<Table>
  <TableCaption>A list of your recent invoices.</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead className="w-[100px]">Invoice</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Method</TableHead>
      <TableHead className="text-right">Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell className="font-medium">INV001</TableCell>
      <TableCell>Paid</TableCell>
      <TableCell>Credit Card</TableCell>
      <TableCell className="text-right">$250.00</TableCell>
    </TableRow>
  </TableBody>
  <TableFooter>
    <TableRow>
      <TableCell colSpan={3}>Total</TableCell>
      <TableCell className="text-right">$250.00</TableCell>
    </TableRow>
  </TableFooter>
</Table>
```

---

### Badge

**File:** `components/ui/badge.tsx`

Status badge with variants.

**Variants:**
- `default` - Primary purple
- `secondary` - Secondary gray
- `destructive` - Red danger
- `outline` - Border only

**Usage:**
```tsx
import { Badge } from "@/components/ui/badge";

<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="outline">Outline</Badge>
```

---

### Avatar

**File:** `components/ui/avatar.tsx`

User avatar with image and fallback.

**Usage:**
```tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

<Avatar>
  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
  <AvatarFallback>CN</AvatarFallback>
</Avatar>
```

---

### Skeleton

**File:** `components/ui/skeleton.tsx`

Loading skeleton placeholder.

**Usage:**
```tsx
import { Skeleton } from "@/components/ui/skeleton";

<Skeleton className="h-4 w-[250px]" />
<Skeleton className="h-12 w-12 rounded-full" />
```

---

### Progress

**File:** `components/ui/progress.tsx`

Progress bar indicator.

**Usage:**
```tsx
import { Progress } from "@/components/ui/progress";

<Progress value={33} />
```

---

### Calendar

**File:** `components/ui/calendar.tsx`

Date picker calendar.

**Usage:**
```tsx
import { Calendar } from "@/components/ui/calendar";

const [date, setDate] = React.useState<Date | undefined>(new Date())
<Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
```

---

## Feedback Components

### Alert

**File:** `components/ui/alert.tsx`

Alert message display.

**Variants:**
- `default` - Default alert
- `destructive` - Error/danger alert

**Usage:**
```tsx
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

<Alert>
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>You can add components to your app.</AlertDescription>
</Alert>

<Alert variant="destructive">
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>Your session has expired.</AlertDescription>
</Alert>
```

---

### Sonner (Toast)

**File:** `components/ui/sonner.tsx`

Toast notification system.

**Usage:**
```tsx
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

// Add Toaster to your app root
<Toaster />

// Trigger a toast
toast("Event has been created")
toast.success("Success!")
toast.error("Error occurred")
```

---

## Media Components

### Carousel

**File:** `components/ui/carousel.tsx`

Image/content carousel with navigation.

**Usage:**
```tsx
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

<Carousel className="w-full max-w-xs">
  <CarouselContent>
    <CarouselItem>1</CarouselItem>
    <CarouselItem>2</CarouselItem>
    <CarouselItem>3</CarouselItem>
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>
```

---

### Chart

**File:** `components/ui/chart.tsx`

Chart wrapper for Recharts integration.

**Usage:**
```tsx
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

<ChartContainer config={chartConfig}>
  <AreaChart data={data}>
    <ChartTooltip content={<ChartTooltipContent />} />
  </AreaChart>
</ChartContainer>
```

---

## Utility Components

### Accordion

**File:** `components/ui/accordion.tsx`

Collapsible content sections.

**Usage:**
```tsx
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>Is it accessible?</AccordionTrigger>
    <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
  </AccordionItem>
</Accordion>
```

---

### Collapsible

**File:** `components/ui/collapsible.tsx`

Simple collapsible content.

**Usage:**
```tsx
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

<Collapsible>
  <CollapsibleTrigger>Toggle</CollapsibleTrigger>
  <CollapsibleContent>Collapsible content</CollapsibleContent>
</Collapsible>
```

---

### Command

**File:** `components/ui/command.tsx`

Command palette (cmdk) for search and actions.

**Usage:**
```tsx
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut } from "@/components/ui/command";

<CommandDialog open={open} onOpenChange={setOpen}>
  <CommandInput placeholder="Type a command or search..." />
  <CommandList>
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandGroup heading="Suggestions">
      <CommandItem>Calendar</CommandItem>
      <CommandItem>Search Emoji</CommandItem>
    </CommandGroup>
  </CommandList>
</CommandDialog>
```

---

### Context Menu

**File:** `components/ui/context-menu.tsx`

Right-click context menu.

**Usage:**
```tsx
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";

<ContextMenu>
  <ContextMenuTrigger>Right click me</ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem>Profile</ContextMenuItem>
    <ContextMenuItem>Settings</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>
```

---

### Dropdown Menu

**File:** `components/ui/dropdown-menu.tsx`

Dropdown menu component.

**Usage:**
```tsx
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Open</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Settings</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

---

### Toggle

**File:** `components/ui/toggle.tsx`

Toggle button for on/off states.

**Usage:**
```tsx
import { Toggle } from "@/components/ui/toggle";

<Toggle variant="outline" size="sm">Toggle</Toggle>
```

---

### Toggle Group

**File:** `components/ui/toggle-group.tsx`

Toggle button group for multiple selection.

**Usage:**
```tsx
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

<ToggleGroup type="multiple">
  <ToggleGroupItem value="bold">B</ToggleGroupItem>
  <ToggleGroupItem value="italic">I</ToggleGroupItem>
  <ToggleGroupItem value="underline">U</ToggleGroupItem>
</ToggleGroup>
```

---

### Input OTP

**File:** `components/ui/input-otp.tsx`

OTP input fields for verification codes.

**Usage:**
```tsx
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";

<InputOTP maxLength={6}>
  <InputOTPGroup>
    <InputOTPSlot index={0} />
    <InputOTPSlot index={1} />
    <InputOTPSlot index={2} />
  </InputOTPGroup>
  <InputOTPSeparator />
  <InputOTPGroup>
    <InputOTPSlot index={3} />
    <InputOTPSlot index={4} />
    <InputOTPSlot index={5} />
  </InputOTPGroup>
</InputOTP>
```

---

### useIsMobile Hook

**File:** `components/ui/use-mobile.ts`

Hook for detecting mobile devices.

**Usage:**
```tsx
import { useIsMobile } from "@/components/ui/use-mobile";

function MyComponent() {
  const isMobile = useIsMobile();
  return <div>{isMobile ? "Mobile" : "Desktop"}</div>;
}
```

---

### cn Utility

**File:** `components/ui/utils.ts`

Utility function for merging class names (clsx + tailwind-merge).

**Usage:**
```tsx
import { cn } from "@/components/ui/utils";

<div className={cn("base-class", condition && "conditional-class", "extra-class")} />
```

---

## Component Count Summary

| Category | Count |
|----------|-------|
| Form | 10 |
| Layout | 5 |
| Navigation | 6 |
| Overlay | 7 |
| Data Display | 6 |
| Feedback | 2 |
| Media | 2 |
| Utility | 8 |
| **Total** | **46** |

---

**Brand:** AI Brand Architect
**Version:** 1.0.0
**Last Updated:** June 25, 2026
