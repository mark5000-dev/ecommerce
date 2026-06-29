"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ImageWithFallback } from "@/components/ui/imageWithFallback";
import type { Product } from "@/model";

// Generates a URL-friendly slug with the ID appended at the end
// This maps directly to Next.js dynamic routing: app/products/[id]/page.tsx
const slugify = (name: string, id: number) =>
  `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${id}`;

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  // Temporary local state implementation replacing the removed Redux architecture
  const [isInWishlist, setIsInWishlist] = useState(false);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsInWishlist(!isInWishlist);
  };

  return (
    <Link href={`/products/${slugify(product.name, product.id)}`} className="block">
      <Card className="group relative overflow-hidden transition-all hover:shadow-xl cursor-pointer border-0 bg-background">
        
        {/* Product Imagery & Interactive Overlays */}
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          <ImageWithFallback
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Status Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
            {product.isNew && (
              <Badge className="bg-[#D4AF37] text-black hover:bg-[#C5A028]">
                New
              </Badge>
            )}
            {product.isBestseller && (
              <Badge variant="secondary">Bestseller</Badge>
            )}
          </div>

          {/* Wishlist Toggle Trigger */}
          <Button
            size="icon"
            variant="ghost"
            className={`absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full z-10 transition-opacity md:opacity-0 md:group-hover:opacity-100 ${
              isInWishlist ? "text-red-500 hover:text-red-600" : "text-neutral-500"
            }`}
            onClick={handleToggleWishlist}
          >
            <Heart className={`h-5 w-5 ${isInWishlist ? "fill-current" : ""}`} />
          </Button>

          {/* Hover-reveal Quick View Action */}
          <div className="absolute bottom-0 left-0 right-0 bg-foreground/10 backdrop-blur-sm p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
            <Button className="w-full bg-[#D4AF37] text-black hover:bg-[#C5A028] font-medium tracking-wide text-xs uppercase">
              Quick View
            </Button>
          </div>
        </div>

        {/* Text Details Area */}
        <CardContent className="p-4 px-1">
          <h3 className="font-serif text-base text-foreground mb-1 group-hover:text-[#D4AF37] transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-[#D4AF37] font-medium text-sm">
            ${product.price.toLocaleString()}
          </p>
        </CardContent>

      </Card>
    </Link>
  );
};