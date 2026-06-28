"use client";
import { motion, MotionValue, useMotionValue, useSpring, useTransform, AnimatePresence, type SpringOptions } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";

export type DockItemData = {
  icon: React.ReactNode;
  label: React.ReactNode;
  onClick: () => void;
  className?: string;
};

export type DockProps = {
  items: DockItemData[];
  className?: string;
  distance?: number;
  panelHeight?: number;
  baseItemSize?: number;
  magnification?: number;
  spring?: SpringOptions;
};

function DockItem({ children, className = "", onClick, mouseX, spring, distance, magnification, baseItemSize }: {
  className?: string; children: React.ReactNode; onClick?: () => void;
  mouseX: MotionValue<number>; spring: SpringOptions; distance: number;
  baseItemSize: number; magnification: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isHovered = useMotionValue(0);
  const mouseDistance = useTransform(mouseX, val => {
    const rect = ref.current?.getBoundingClientRect() ?? { x: 0, width: baseItemSize };
    return val - rect.x - baseItemSize / 2;
  });
  const targetSize = useTransform(mouseDistance, [-distance, 0, distance], [baseItemSize, magnification, baseItemSize]);
  const size = useSpring(targetSize, spring);

  return (
    <motion.div
      ref={ref}
      style={{ width: size, height: size }}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onClick={onClick}
      className={`relative inline-flex items-center justify-center rounded-full bg-card border border-white/[0.06] shadow-lg cursor-pointer ${className}`}
      tabIndex={0} role="button"
    >
      <div className="flex items-center justify-center text-foreground">{children}</div>
      <DockLabel isHovered={isHovered}>{children}</DockLabel>
    </motion.div>
  );
}

function DockLabel({ children, isHovered }: { children: React.ReactNode; isHovered?: MotionValue<number> }) {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    if (!isHovered) return;
    const unsub = isHovered.on("change", v => setIsVisible(v === 1));
    return () => unsub();
  }, [isHovered]);
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: -10 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute -top-8 left-1/2 w-fit whitespace-pre rounded-md border border-white/[0.06] bg-card px-2 py-1 text-xs text-foreground shadow-sm"
          style={{ x: "-50%" }} role="tooltip"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function MagnificationDock({
  items, className = "",
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = 70, distance = 200, panelHeight = 64, baseItemSize = 50,
}: DockProps) {
  const mouseX = useMotionValue(Infinity);
  const isHovered = useMotionValue(0);
  const maxHeight = useMemo(() => Math.max(magnification, magnification + magnification / 2 + 4), [magnification]);
  const heightRow = useTransform(isHovered, [0, 1], [panelHeight, maxHeight]);
  const height = useSpring(heightRow, spring);

  return (
    <motion.div style={{ height }} className="flex max-w-full items-center justify-center">
      <motion.div
        onMouseMove={({ pageX }) => { isHovered.set(1); mouseX.set(pageX); }}
        onMouseLeave={() => { isHovered.set(0); mouseX.set(Infinity); }}
        className={`${className} flex items-end w-fit gap-3 rounded-3xl border border-white/[0.06] bg-card/50 backdrop-blur-md pb-2 px-4 shadow-xl`}
        style={{ height: panelHeight }} role="toolbar"
      >
        {items.map((item, i) => (
          <DockItem key={i} onClick={item.onClick} className={item.className}
            mouseX={mouseX} spring={spring} distance={distance}
            magnification={magnification} baseItemSize={baseItemSize}
          >
            {item.icon}
          </DockItem>
        ))}
      </motion.div>
    </motion.div>
  );
}
