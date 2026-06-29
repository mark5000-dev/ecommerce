"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Grid, List, ChevronDown } from "lucide-react";
import { PageHero } from "@/features/pageHero";
import { ItemsGrid } from "@/features/itemsGrid";
import { ProductCard } from "@/features/productCard";
import { Newsletter } from "@/features/newsletter";
import type { Product, Category } from "@/model";
import { api } from "@/lib/api";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function SingleCategoryPage({ params }: PageProps) {
  const resolvedParams = React.use(params);
  const slug = resolvedParams.id; // Next.js dynamic route segment matching folder [id]

  const [category, setCategory] = useState<Category | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortOption, setSortOption] = useState<string>("featured");
  const [loading, setLoading] = useState(true);

  // Synchronized Multi-Fetch Data Pipeline
  useEffect(() => {
    async function loadCategoryAndProducts() {
      try {
        setLoading(true);
        const data = await api.getCategoryProducts(slug);
        
        if (data && data.category) {
          setCategory(data.category);
          setAllProducts(data.products || []);
        }
      } catch (error) {
        console.error("Migration runtime exception loading category products:", error);
      } finally {
        setLoading(false);
      }
    }

    loadCategoryAndProducts();
  }, [slug]);

  // Compute calculated values across subcategories navigation indices
  const calculatedSubcategories = useMemo(() => {
    if (!category) return [{ id: "all", name: "All Items" }];
    
    // Fallback safe collection extraction mapping arrays
    const rawSubs = (category as any).subcategories || [];
    return [{ id: "all", name: "All Items" }, ...rawSubs];
  }, [category]);

  // Handle nested category filters & multi-variant sort selection matrices
  const processedProducts = useMemo(() => {
    let items = [...allProducts];

    // Subcategory processing logic
    if (selectedSubcategory !== "all") {
      items = items.filter((p) =>
        Array.isArray(p.subCategories) &&
        p.subCategories.some(
          (sub) =>
            sub.toLowerCase() === selectedSubcategory.toLowerCase() ||
            sub.replace(/\s+/g, "-").toLowerCase() === selectedSubcategory.toLowerCase()
        )
      );
    }

    // Sort evaluation rules mapping block
    switch (sortOption) {
      case "price-asc":
        return items.sort((a, b) => a.price - b.price);
      case "price-desc":
        return items.sort((a, b) => b.price - a.price);
      case "newest":
        return items.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      case "featured":
      default:
        return items.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
    }
  }, [allProducts, selectedSubcategory, sortOption]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="font-serif tracking-widest text-muted-foreground animate-pulse">Syncing dynamic category layouts...</p>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-12 bg-background text-center">
        <h2 className="font-serif text-2xl mb-2 text-foreground">Collection Profile Missing</h2>
        <p className="text-muted-foreground text-sm max-w-sm">The specific context index you requested is not indexed inside our database profiles.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Structural Hero Frame Element */}
      <PageHero
        imageUrl={category.image}
        title={category.name}
        description={category.description || `Explore the best ${category.name.toLowerCase()} items from our collection.`}
        breadcrumbs={[
          { label: "Categories", href: "/categories" },
          { label: category.name },
        ]}
      />

      {/* Embedded Subcategory Dynamic Horizontal Navigation */}
      <div className="border-b border-border bg-background sticky top-0 z-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex gap-8 overflow-x-auto no-scrollbar py-4 scroll-smooth">
            {calculatedSubcategories.map((sub: any) => (
              <button
                key={sub.id}
                onClick={() => setSelectedSubcategory(sub.id)}
                className={`text-xs uppercase tracking-widest font-medium whitespace-nowrap transition-all duration-200 border-b-2 pb-1.5 -mb-4 ${
                  selectedSubcategory === sub.id
                    ? "border-[#D4AF37] text-foreground font-semibold"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Unified Toolbar and Presentational Items Context Grid */}
      <section className="py-12 bg-background flex-1">
        <div className="container mx-auto px-4 lg:px-8">
          
          {/* Integrated Multi-Action Control Layout Toolbar Block */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-6 mb-8">
            <span className="text-xs uppercase tracking-widest font-medium text-muted-foreground">
              Showing {processedProducts.length} Results
            </span>

            <div className="flex items-center gap-4 justify-between sm:justify-end">
              {/* Responsive Format View Switches */}
              <div className="hidden md:flex items-center border border-border rounded overflow-hidden bg-background">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 transition-colors ${viewMode === "grid" ? "bg-neutral-100 text-foreground" : "text-muted-foreground hover:bg-neutral-50"}`}
                  aria-label="Grid adjustment display setting"
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 border-l border-border transition-colors ${viewMode === "list" ? "bg-neutral-100 text-foreground" : "text-muted-foreground hover:bg-neutral-50"}`}
                  aria-label="List adjustment display setting"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

              {/* Sorting Filter Selection Trigger */}
              <div className="relative inline-block w-full sm:w-auto">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="w-full sm:w-auto appearance-none bg-background border border-border rounded px-4 py-2 pr-10 text-xs uppercase tracking-widest text-foreground focus:outline-none focus:border-[#D4AF37] font-medium cursor-pointer"
                >
                  <option value="featured">Featured Items</option>
                  <option value="newest">New Arrivals</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
                <ChevronDown className="h-3 w-3 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Primary View Node Map Router Rendering Block */}
          {processedProducts.length === 0 ? (
            <div className="text-center py-20 font-serif text-muted-foreground tracking-wide text-sm">
              No product items fall within this filtered segment matching path criteria.
            </div>
          ) : (
            <ItemsGrid
              items={processedProducts}
              viewMode={viewMode}
              gridCols={{ default: 1, sm: 2, lg: 3 }}
              showLoadMore={false} 
              renderItem={(product: Product) => (
                <ProductCard key={product.id} product={product} />
              )}
            />
          )}

        </div>
      </section>

      {/* Inlined Editorial Component Profile Section Block */}
      <section className="py-24 bg-foreground text-background border-t border-border/10">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-12 h-[1px] bg-[#D4AF37] mx-auto mb-6" />
            <h2 className="font-serif text-[2.25rem] md:text-[3.25rem] mb-6 leading-tight tracking-wide text-background">
              {(category as any).infoTitle || `The Spirit of ${category.name}`}
            </h2>
            <p className="text-background/80 text-sm md:text-base leading-relaxed font-light max-w-2xl mx-auto">
              {(category as any).infoDescription || `Our ${category.name.toLowerCase()} selection celebrates unparalleled luxury and intentional craftsmanship. Each item is meticulously indexed from choice materials, maintaining the strict balance of aesthetic harmony and longevity.`}
            </p>
          </div>
        </div>
      </section>

      {/* High-Impact Targeted Newsletter Sign-up Section Block */}
      <Newsletter />
    </div>
  );
}