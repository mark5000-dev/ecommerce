"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { PageHero } from "@/features/pageHero";
import { ItemsGrid } from "@/features/itemsGrid";
import { ProductCard } from "@/features/productCard";
import type { Product } from "@/model";
import { api } from "@/lib/api";

const subcategories = [
  { id: "womens-collection", label: "Women" },
  { id: "mens-collection", label: "Men" },
  { id: "kids-collection", label: "Kids" },
  { id: "accessories", label: "Accessories" },
  { id: "shoes", label: "Shoes" },
  { id: "jewelry", label: "Jewelry" },
];

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortOption, setSortOption] = useState<string>("featured");
  const [visibleCount, setVisibleCount] = useState<number>(20);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Hydrate data directly from the Express backend API
  useEffect(() => {
    async function loadData() {
      try {
        const data = await api.getProducts({ limit: 100 });
        // Handle both raw arrays or objects containing a products field
        const fallbackArray = Array.isArray(data) ? data : data.products || [];
        setProducts(fallbackArray);
      } catch (error) {
        console.error("Error reading backend products:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Compute sorting workflows locally prior to API integration
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
  const itemsToRender = processedProducts.slice(0, visibleCount);

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
              {subcategories.map((sub) => (
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