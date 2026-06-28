"use client";
import { useState } from "react";
import { motion } from "motion/react";

export interface FolderProps {
  color?: string;
  size?: number;
  items?: React.ReactNode[];
  className?: string;
  label?: string;
}

function darken(hex: string, pct: number): string {
  let c = hex.startsWith("#") ? hex.slice(1) : hex;
  if (c.length === 3) c = c.split("").map(ch => ch + ch).join("");
  const n = parseInt(c, 16);
  let r = (n >> 16) & 0xff, g = (n >> 8) & 0xff, b = n & 0xff;
  r = Math.max(0, Math.min(255, Math.floor(r * (1 - pct))));
  g = Math.max(0, Math.min(255, Math.floor(g * (1 - pct))));
  b = Math.max(0, Math.min(255, Math.floor(b * (1 - pct))));
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

export function InteractiveFolder({
  color = "#8b5cf6", size = 1, items = [], className = "", label,
}: FolderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const maxVisible = 3;
  const displayItems = items.slice(0, maxVisible);
  while (displayItems.length < maxVisible) displayItems.push(null);

  const backColor = darken(color, 0.12);
  const paperColors = [darken("#1e1e2e", 0.1), darken("#1e1e2e", 0.05), "#1e1e2e"];

  const handleMove = (e: React.MouseEvent, i: number) => {
    if (!isOpen) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - (rect.left + rect.width / 2)) * 0.15,
      y: (e.clientY - (rect.top + rect.height / 2)) * 0.15,
    });
    setHoveredIndex(i);
  };

  const getT = (idx: number) => {
    if (!isOpen) return { x: "-50%", y: "10%", rotate: 0 };
    const b = [{ x: "-120%", y: "-75%", rotate: -15 }, { x: "10%", y: "-75%", rotate: 15 }, { x: "-50%", y: "-105%", rotate: 5 }];
    const base = b[idx] || { x: "-50%", y: "-50%", rotate: 0 };
    if (hoveredIndex === idx) return { x: `calc(${base.x} + ${mousePos.x}px)`, y: `calc(${base.y} + ${mousePos.y}px)`, rotate: base.rotate, scale: 1.08 };
    return base;
  };

  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ transform: `scale(${size})`, width: 120, height: 100 }}>
      <div className="relative cursor-pointer group select-none" onClick={() => setIsOpen(!isOpen)}>
        <div className="relative w-[110px] h-[85px] transition-all duration-500 rounded-tr-[12px] rounded-br-[12px] rounded-bl-[12px]" style={{ backgroundColor: backColor, boxShadow: isOpen ? "0 10px 30px -5px rgba(0,0,0,0.3)" : "0 4px 12px -2px rgba(0,0,0,0.1)" }}>
          <div className="absolute bottom-full left-0 w-[35px] h-[12px] rounded-t-[6px]" style={{ backgroundColor: backColor }} />
          {displayItems.map((item, i) => (
            <motion.div key={i} onMouseMove={e => handleMove(e, i)} onMouseLeave={() => { setMousePos({ x: 0, y: 0 }); setHoveredIndex(null); }}
              animate={getT(i)}
              transition={{ type: "spring", stiffness: 260, damping: 20, mass: 1 }}
              className="absolute left-1/2 flex items-center justify-center overflow-hidden"
              style={{
                zIndex: 20, backgroundColor: paperColors[i], borderRadius: "8px",
                width: i === 0 ? "75px" : i === 1 ? "85px" : "95px",
                height: i === 0 ? "65px" : i === 1 ? "70px" : "75px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)", border: "1px solid rgba(255,255,255,0.03)",
              }}
            >
              {item || (
                <div className="w-full h-full p-2 flex flex-col gap-1.5 opacity-20">
                  <div className="w-3/4 h-1 bg-current rounded-full" />
                  <div className="w-1/2 h-1 bg-current rounded-full" />
                  <div className="w-2/3 h-1 bg-current rounded-full" />
                </div>
              )}
            </motion.div>
          ))}
          <motion.div animate={{ skewX: isOpen ? 15 : 0, scaleY: isOpen ? 0.6 : 1, y: isOpen ? 4 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute inset-0 z-30 origin-bottom" style={{
              backgroundColor: color, borderRadius: "6px 12px 12px 12px",
              clipPath: "polygon(0 0, 50% 0, 50% 100%, 0 100%)",
            }}
          />
          <motion.div animate={{ skewX: isOpen ? -15 : 0, scaleY: isOpen ? 0.6 : 1, y: isOpen ? 4 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute inset-0 z-30 origin-bottom" style={{
              backgroundColor: color, borderRadius: "6px 12px 12px 12px",
              clipPath: "polygon(50% 0, 100% 0, 100% 100%, 50% 100%)",
            }}
          >
            {label && !isOpen && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/90 text-[10px] font-medium tracking-tight whitespace-nowrap px-2">
                {label}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
