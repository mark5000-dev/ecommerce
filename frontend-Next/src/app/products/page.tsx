"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { PageHero } from "@/features/pageHero";
import { ItemsGrid } from "@/features/itemsGrid";
import { ProductCard } from "@/features/productCard";
import { useProductsQuery } from "@/hooks/useProducts"; // Adjust import path as needed
import type { Product } from "@/model";

const maincategories = [
  { id: "womens-collection", label: "Women" },
  { id: "mens-collection", label: "Men" },
  { id: "kids-collection", label: "Kids" },
  { id: "accessories", label: "Accessories" },
  { id: "shoes", label: "Shoes" },
  { id: "jewelry", label: "Jewelry" },
];

export default function ProductsPage() {
  const router = useRouter();

  // TanStack Query handles local loading, caching, and background sync instantly
  const { data, isLoading, isError } = useProductsQuery({ limit: 100 });

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortOption, setSortOption] = useState<string>("featured");
  const [visibleCount, setVisibleCount] = useState<number>(20);

  // Safely extract the fallback array from unified API structure
  const products: Product[] = useMemo(() => {
    if (!data) return [];
    return Array.isArray(data) ? data : data.products || [];
  }, [data]);

  // Compute sorting workflows locally using the raw data cache stream
  const processedProducts = useMemo(() => {
    const items = [...products];
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
  }, [products, sortOption]);

  const handleSubcategoryClick = (id: string) => {
    router.push(`/categories/${id}`);
  };

  // Paginated array block passed downward to your item template handler
  const itemsToRender = useMemo(() => {
    return processedProducts.slice(0, visibleCount);
  }, [processedProducts, visibleCount]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PageHero
        title="All Products"
        description="Explore our complete collection of luxury fashion and accessories, carefully curated for the discerning individual."
        breadcrumbs={[{ label: "All Products" }]}
        badge={{ label: "Luxury Collection" }}
      />

      {/* Control Toolbar Panel */}
      <section className="py-6 bg-background border-b border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

            {/* Left: Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              {maincategories.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => handleSubcategoryClick(sub.id)}
                  className="px-4 py-2 text-xs uppercase tracking-wider font-medium border border-border bg-background hover:bg-neutral-50 rounded transition-all duration-200 text-muted-foreground hover:text-foreground"
                >
                  {sub.label}
                </button>
              ))}
            </div>

            {/* Right: Metrics, Sort options & View toggles */}
            <div className="flex items-center justify-between sm:justify-end gap-6">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                {isLoading ? "Loading..." : `${processedProducts.length} Products`}
              </span>

              <div className="flex items-center gap-4">
                {/* Visual View Mode Selectors */}
                <div className="hidden sm:flex border border-border rounded overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`px-3 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors ${viewMode === "grid" ? "bg-neutral-100 text-foreground" : "bg-background text-muted-foreground"
                      }`}
                  >
                    Grid
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`px-3 py-1.5 text-xs font-medium uppercase tracking-wider border-l border-border transition-colors ${viewMode === "list" ? "bg-neutral-100 text-foreground" : "bg-background text-muted-foreground"
                      }`}
                  >
                    List
                  </button>
                </div>

                {/* Sort Action Matrix Dropdown */}
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="border border-border bg-background px-3 py-2 text-xs uppercase tracking-wider text-foreground rounded focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="featured">Featured</option>
                  <option value="newest">Newest</option>
                  <option value="price-asc">Price: Low → High</option>
                  <option value="price-desc">Price: High → Low</option>
                </select>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Primary Presentational Grid Node */}
      <section className="py-12 bg-card flex-1">
        <div className="container mx-auto px-4 lg:px-8">
          {isLoading ? (
            <div className="text-center py-24 text-muted-foreground font-serif tracking-wide">
              Curating collection view...
            </div>
          ) : isError ? (
            <div className="text-center py-24 text-destructive font-serif tracking-wide">
              Critical context synchronization error. Failed to load product catalogue.
            </div>
          ) : itemsToRender.length === 0 ? (
            <div className="text-center py-24 text-muted-foreground font-serif tracking-wide">
              No archival entries located in storage profile.
            </div>
          ) : (
            <ItemsGrid
              items={itemsToRender}
              viewMode={viewMode}
              gridCols={{ default: 1, sm: 2, lg: 3, xl: 4 }}
              showLoadMore={visibleCount < processedProducts.length}
              onLoadMore={() => setVisibleCount((prev) => prev + 8)}
              loadMoreLabel="Load More Products"
              renderItem={(product: Product) => (
                <ProductCard key={product.id} product={product} />
              )}
            />
          )}
        </div>
      </section>
    </div>
  );
}