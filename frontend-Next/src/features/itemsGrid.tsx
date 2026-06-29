"use client";

import React, { type ReactNode } from "react";
import { Button } from "@/components/ui/button";

// Static mapping objects ensure Tailwind's scanner can read and generate the required grid utility classes
const gridDefaults: Record<number, string> = { 1: "grid-cols-1", 2: "grid-cols-2", 3: "grid-cols-3", 4: "grid-cols-4" };
const gridSm: Record<number, string> = { 1: "sm:grid-cols-1", 2: "sm:grid-cols-2", 3: "sm:grid-cols-3", 4: "sm:grid-cols-4" };
const gridMd: Record<number, string> = { 1: "md:grid-cols-1", 2: "md:grid-cols-2", 3: "md:grid-cols-3", 4: "md:grid-cols-4" };
const gridLg: Record<number, string> = { 1: "lg:grid-cols-1", 2: "lg:grid-cols-2", 3: "lg:grid-cols-3", 4: "lg:grid-cols-4" };
const gridXl: Record<number, string> = { 1: "xl:grid-cols-1", 2: "xl:grid-cols-2", 3: "xl:grid-cols-3", 4: "xl:grid-cols-4" };

interface ItemsGridProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  viewMode?: "grid" | "list";
  gridCols?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  showLoadMore?: boolean;
  onLoadMore?: () => void;
  loadMoreLabel?: string;
  className?: string;
}

export const ItemsGrid = <T,>({
  items,
  renderItem,
  viewMode = "grid",
  gridCols = {
    default: 1,
    sm: 2,
    lg: 3,
    xl: 4,
  },
  showLoadMore = false,
  onLoadMore,
  loadMoreLabel = "Load More",
  className = "",
}: ItemsGridProps<T>) => {
  
  const getGridClass = () => {
    if (viewMode === "list") return "flex flex-col gap-6";
    
    const classes = ["grid gap-6"];
    if (gridCols.default) classes.push(gridDefaults[gridCols.default] || "grid-cols-1");
    if (gridCols.sm) classes.push(gridSm[gridCols.sm] || "");
    if (gridCols.md) classes.push(gridMd[gridCols.md] || "");
    if (gridCols.lg) classes.push(gridLg[gridCols.lg] || "");
    if (gridCols.xl) classes.push(gridXl[gridCols.xl] || "");
    
    return classes.join(" ");
  };

  return (
    <div className={className}>
      <div className={getGridClass()}>
        {items.map((item, index) => renderItem(item, index))}
      </div>

      {/* Load More Controller */}
      {showLoadMore && onLoadMore && (
        <div className="mt-12 text-center">
          <Button
            variant="outline"
            size="lg"
            className="px-12 border-foreground text-foreground hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors tracking-widest text-xs uppercase font-medium"
            onClick={onLoadMore}
          >
            {loadMoreLabel}
          </Button>
        </div>
      )}
    </div>
  );
};