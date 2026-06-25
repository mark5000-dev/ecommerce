"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { ImageWithFallback } from "@/components/ui/imageWithFallback";
import type { Category } from "@/model";

export const CategoryCard: React.FC<{ category: Category }> = ({ category }) => {
  return (
    <Link href={`/categories/${category.slug}`} className="block">
      <Card className="group relative overflow-hidden cursor-pointer border-0 aspect-[3/4] bg-background">
        {/* Layered Structural Background Image */}
        <div className="absolute inset-0 overflow-hidden">
          <ImageWithFallback
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
        </div>
        
        {/* Absolute Meta Elements Panel */}
        <CardContent className="absolute bottom-0 left-0 right-0 p-8 text-white z-10">
          <div className="w-12 h-1 bg-[#D4AF37] mb-4 transition-all duration-300 group-hover:w-24" />
          
          <CardTitle className="font-serif text-[1.75rem] mb-2 text-white">
            {category.name}
          </CardTitle>
          
          <CardDescription className="text-white/80 mb-4 font-light text-sm line-clamp-2">
            {category.description}
          </CardDescription>
          
          <div className="flex items-center justify-between gap-4 mt-2">
            <span className="text-[#D4AF37] inline-flex items-center gap-2 group-hover:gap-4 transition-all text-xs tracking-widest uppercase font-medium">
              Explore Collection
              <ArrowRight className="w-4 h-4" />
            </span>
            
            {category.productCount && (
              <span className="text-[11px] uppercase tracking-widest text-white/60 font-medium">
                {category.productCount} items
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};