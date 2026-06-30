"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Heart, ShoppingBag, Share2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ItemsGrid } from "@/features/itemsGrid";
import { ProductCard } from "@/features/productCard";
import type { Product } from "@/model";
import { useProductsQuery } from "@/hooks/useProducts";
import { useWishlistQuery, useDeleteWishlistItemMutation } from "@/hooks/useWishlist";

export default function WishlistPage() {
  // Query Stream Sync Hook Interfaces
  const { data: wishlistItems = [], isLoading: wishlistLoading } = useWishlistQuery();
  const { data: productsData, isLoading: productsLoading } = useProductsQuery({ limit: 100 });

  // Destruct mutation actions cleanly
  const deleteWishlistItemMutation = useDeleteWishlistItemMutation();

  // Extract all loaded core product entries from API query wrappers
  const allProducts: Product[] = useMemo(() => {
    if (!productsData) return [];
    return Array.isArray(productsData) ? productsData : productsData.products || [];
  }, [productsData]);

  // Compute product payload intersections using tracking maps
  const wishlistProducts = useMemo(() => {
    const targetSet = new Set(wishlistItems.map((item: any) => Number(item.productId)));
    return allProducts.filter((product) => targetSet.has(product.id));
  }, [allProducts, wishlistItems]);

  const handleShare = () => {
    alert("Share link copied! Your curated luxury capsule lookbook is ready to send.");
  };

  const clearAllWishlistItems = () => {
    // Sequentially dispatch parallel cache updates natively across current saved array states
    wishlistItems.forEach((item: any) => {
      deleteWishlistItemMutation.mutate({ productId: item.productId });
    });
  };

  const isLoading = wishlistLoading || productsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="font-serif tracking-widest text-muted-foreground animate-pulse">
          Synchronizing curated files...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1">
        {/* Breadcrumb Navigation Segment */}
        <section className="border-b border-border bg-card">
          <div className="container mx-auto px-4 lg:px-8 py-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild className="hover:text-[#D4AF37] transition-colors text-xs uppercase tracking-wider font-medium">
                    <Link href="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-xs uppercase tracking-wider font-semibold text-foreground">
                    Wishlist
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </section>

        {/* Wishlist Header Grid Workspace */}
        <section className="py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
              <div>
                <h1 className="font-serif text-[2.5rem] md:text-[3.5rem] leading-tight mb-2 text-foreground">
                  My Wishlist
                </h1>
                <p className="text-muted-foreground text-sm font-light">
                  {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"} saved inside temporary tracking indexes
                </p>
              </div>

              {wishlistItems.length > 0 && (
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    onClick={handleShare}
                    className="rounded-none text-xs uppercase tracking-wider font-medium border-border h-10 px-4"
                  >
                    <Share2 className="h-4 w-4 mr-2 text-[#D4AF37]" />
                    Share Wishlist
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={clearAllWishlistItems}
                    disabled={deleteWishlistItemMutation.isPending}
                    className="rounded-none text-xs uppercase tracking-wider font-medium text-red-600 hover:text-red-700 hover:bg-red-50/50 h-10 px-4"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {deleteWishlistItemMutation.isPending ? "Clearing..." : "Clear All"}
                  </Button>
                </div>
              )}
            </div>

            {/* Content Segment Switchboard Matrix */}
            {wishlistItems.length === 0 ? (
              <Card className="text-center py-20 border-border rounded-none bg-card shadow-none">
                <CardContent className="space-y-4 max-w-md mx-auto">
                  <div className="flex justify-center">
                    <div className="h-20 w-20 rounded-none bg-background border border-border flex items-center justify-center transform rotate-45 group">
                      <Heart className="h-8 w-8 text-muted-foreground -rotate-45" />
                    </div>
                  </div>
                  <h2 className="font-serif text-xl pt-4 text-foreground">Your Wishlist is Empty</h2>
                  <p className="text-xs text-muted-foreground font-light leading-relaxed">
                    Save your favorite items to your personal wishlist and keep track of premium products you love.
                  </p>
                  <div className="pt-4">
                    <Button
                      asChild
                      className="bg-[#D4AF37] text-black hover:bg-[#C5A028] rounded-none text-xs font-semibold uppercase tracking-widest h-11 px-8 transition-colors"
                    >
                      <Link href="/products">Explore Products</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div>
                <ItemsGrid
                  items={wishlistProducts}
                  viewMode="grid"
                  gridCols={{ default: 1, sm: 2, lg: 3 }}
                  renderItem={(product: Product) => (
                    <ProductCard product={product} key={product.id} />
                  )}
                />
              </div>
            )}

            {/* Informational Core Pillars Section */}
            {wishlistItems.length > 0 && (
              <div className="mt-20 grid md:grid-cols-3 gap-8 border-t border-border pt-16">
                <Card className="border-border bg-card/40 rounded-none shadow-none p-6 text-center">
                  <CardContent className="p-0">
                    <Heart className="h-6 w-6 mx-auto mb-4 text-[#D4AF37]" />
                    <h3 className="font-serif text-sm mb-2 text-foreground">Save Across Devices</h3>
                    <p className="text-xs text-muted-foreground font-light leading-relaxed">
                      Log in to sync your active capsule collections across all mobile and desktop frames seamlessly.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-border bg-card/40 rounded-none shadow-none p-6 text-center">
                  <CardContent className="p-0">
                    <ShoppingBag className="h-6 w-6 mx-auto mb-4 text-[#D4AF37]" />
                    <h3 className="font-serif text-sm mb-2 text-foreground">Effortless Cart Checkout</h3>
                    <p className="text-xs text-muted-foreground font-light leading-relaxed">
                      Move your favorites directly to the active shipping bag structure with quick-action click hooks.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-border bg-card/40 rounded-none shadow-none p-6 text-center">
                  <CardContent className="p-0">
                    <Share2 className="h-6 w-6 mx-auto mb-4 text-[#D4AF37]" />
                    <h3 className="font-serif text-sm mb-2 text-foreground">Exclusive Private Access</h3>
                    <p className="text-xs text-muted-foreground font-light leading-relaxed">
                      Generate explicit, unique portfolio tracking links to securely share options with personal stylists.
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}