"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Search, FileText, FolderOpen, Users, Package, BookOpen, MessageSquare, ShoppingBag, Layout, Sparkles, Command, Loader2, Hash } from "lucide-react";
import { CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "./command";
import type { Screen } from "../../types";

interface SearchResult {
  id: string;
  entityType: string;
  entityId: string;
  title: string;
  description: string | null;
  score: number;
}

const TYPE_ICONS: Record<string, typeof FileText> = {
  BRAND: Sparkles,
  PROJECT: FolderOpen,
  ASSET: FileText,
  USER: Users,
  KNOWLEDGE: BookOpen,
  CONVERSATION: MessageSquare,
  MARKETPLACE: ShoppingBag,
  COMPONENT: Layout,
  TEMPLATE: FileText,
};

const TYPE_LABELS: Record<string, string> = {
  BRAND: "Brand",
  PROJECT: "Project",
  ASSET: "Asset",
  USER: "User",
  KNOWLEDGE: "Article",
  CONVERSATION: "Conversation",
  MARKETPLACE: "Listing",
  COMPONENT: "Component",
  TEMPLATE: "Template",
};

const NAV_ITEMS = [
  { label: "Dashboard", screen: "dashboard" as Screen, icon: Layout },
  { label: "Brand Studio", screen: "brand-studio" as Screen, icon: Sparkles },
  { label: "Projects", screen: "projects" as Screen, icon: FolderOpen },
  { label: "Knowledge Hub", screen: "knowledge-hub" as Screen, icon: BookOpen },
  { label: "Marketplace", screen: "marketplace" as Screen, icon: ShoppingBag },
  { label: "Team", screen: "team" as Screen, icon: Users },
  { label: "Templates", screen: "templates" as Screen, icon: FileText },
  { label: "Pricing", screen: "pricing" as Screen, icon: Hash },
];

export function CommandPalette({ open, onOpenChange, navigate }: {
  open: boolean; onOpenChange: (open: boolean) => void; navigate: (s: Screen) => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
    }
  }, [open]);

  const doSearch = useCallback(async (q: string) => {
    if (q.length < 2) { setResults([]); setLoading(false); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=10`);
      const data = await res.json();
      setResults(data.items || []);
    } catch { setResults([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.length >= 2) {
      debounceRef.current = setTimeout(() => doSearch(query), 250);
    } else {
      setResults([]); setLoading(false);
    }
  }, [query, doSearch]);

  const handleNavigate = (screen: Screen) => {
    onOpenChange(false);
    navigate(screen);
  };

  const grouped = groupBy(results, "entityType");

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search brands, projects, people, or navigate..." value={query} onValueChange={setQuery} />
      <CommandList>
        <CommandEmpty>
          {loading ? (
            <span className="flex items-center justify-center gap-2 text-slate-500 py-4"><Loader2 size={14} className="animate-spin" /> Searching...</span>
          ) : "No results found."}
        </CommandEmpty>
        {!query && (
          <CommandGroup heading="Quick Navigation">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <CommandItem key={item.screen} onSelect={() => handleNavigate(item.screen)}>
                  <Icon size={15} className="text-slate-400" />
                  <span>{item.label}</span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        )}
        {Object.entries(grouped).map(([type, items]) => (
          <CommandGroup key={type} heading={TYPE_LABELS[type] || type}>
            {items.map((item) => {
              const Icon = TYPE_ICONS[type] || FileText;
              return (
                <CommandItem key={item.id} onSelect={() => handleNavigate(mapTypeToScreen(type))}>
                  <Icon size={15} className="text-slate-400" />
                  <div className="flex flex-col">
                    <span>{item.title}</span>
                    {item.description && <span className="text-[11px] text-slate-600 truncate max-w-[300px]">{item.description}</span>}
                  </div>
                  <span className="ml-auto text-[10px] text-slate-600 bg-white/[0.04] px-1.5 py-0.5 rounded">{TYPE_LABELS[type] || type}</span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}

function groupBy<T extends Record<string, any>>(arr: T[], key: string): Record<string, T[]> {
  return arr.reduce((acc, item) => {
    const k = item[key];
    if (!acc[k]) acc[k] = [];
    acc[k].push(item);
    return acc;
  }, {} as Record<string, T[]>);
}

function mapTypeToScreen(type: string): Screen {
  switch (type) {
    case "BRAND": return "brand-studio";
    case "PROJECT": return "projects";
    case "KNOWLEDGE": return "knowledge-hub";
    case "CONVERSATION": return "dashboard";
    case "MARKETPLACE": return "marketplace";
    case "USER": return "team";
    case "TEMPLATE": return "templates";
    default: return "dashboard";
  }
}
