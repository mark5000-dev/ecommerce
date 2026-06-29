"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CategoryCard } from "@/features/categoryCard";
import type { Category } from "@/model";
import { api } from "@/lib/api";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch categories from Express backend API
  useEffect(() => {
    async function fetchCategoriesData() {
      try {
        const data = await api.getCategories();
        
        // Accommodate standard array formatting fields or top-level wrappers smoothly
        const resolvedData = Array.isArray(data) ? data : data.categories || [];
        setCategories(resolvedData);
      } catch (error) {
        console.error("Critical failure during categories API synchronization:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCategoriesData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1">
        
        {/* Hero Banner Grid Interface Node */}
        <section className="relative h-[50vh] min-h-[400px] bg-foreground text-background overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-full bg-gradient-to-br from-[#D4AF37] to-transparent" />
          </div>
          <div className="relative container mx-auto px-4 lg:px-8 h-full flex flex-col justify-center">
            <div className="w-16 h-1 bg-[#D4AF37] mb-6" />
            <h1 className="font-serif text-[3.5rem] md:text-[5rem] leading-tight mb-4">
              Shop by Category
            </h1>
            <p className="text-background/80 text-lg md:text-xl max-w-2xl font-light">
              Discover our curated collections of luxury fashion and accessories
            </p>
          </div>
        </section>

        {/* Dynamic Presentation Grid Node */}
        <section className="py-20 bg-background border-b border-border">
          <div className="container mx-auto px-4 lg:px-8">
            {isLoading ? (
              <div className="text-center py-20 font-serif tracking-widest text-muted-foreground animate-pulse">
                Assembling archival lookups...
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-20 font-serif tracking-wide text-muted-foreground">
                No categorical indices found in local disk files.
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categories.map((category: Category) => (
                  <CategoryCard key={category.categoryId} category={category} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Fixed Highlight Section Area */}
        <section className="py-20 bg-foreground text-background">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-serif text-[2.5rem] md:text-[3.5rem] mb-6">
                Curated Excellence
              </h2>
              <p className="text-background/80 text-sm md:text-base mb-8 leading-relaxed font-light max-w-2xl mx-auto">
                Each category in our collection represents the finest in luxury fashion. 
                From handcrafted accessories to bespoke tailoring, every piece is selected 
                with meticulous attention to quality and style.
              </p>
              <div className="grid grid-cols-3 gap-8 max-w-xl mx-auto mt-12">
                <div>
                  <div className="text-[#D4AF37] text-[2.25rem] md:text-[2.5rem] font-serif mb-1">600+</div>
                  <p className="text-background/70 text-xs uppercase tracking-wider font-medium">Luxury Items</p>
                </div>
                <div>
                  <div className="text-[#D4AF37] text-[2.25rem] md:text-[2.5rem] font-serif mb-1">50+</div>
                  <p className="text-background/70 text-xs uppercase tracking-wider font-medium">Premium Brands</p>
                </div>
                <div>
                  <div className="text-[#D4AF37] text-[2.25rem] md:text-[2.5rem] font-serif mb-1">100%</div>
                  <p className="text-background/70 text-xs uppercase tracking-wider font-medium">Authentic</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Action Directives Callout Node */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <Card className="p-12 md:p-16 text-center border-0 bg-card rounded-none">
              <CardHeader className="p-0">
                <CardTitle className="font-serif text-[2rem] md:text-[2.75rem] mb-3 text-foreground">
                  Need Help Finding Something?
                </CardTitle>
                <CardDescription className="text-sm md:text-base mb-8 max-w-xl mx-auto font-light text-muted-foreground">
                  Our style experts are here to assist you in discovering the perfect pieces 
                  for your wardrobe
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Button size="lg" className="bg-[#D4AF37] text-black hover:bg-[#C5A028] px-10 tracking-widest text-xs uppercase font-semibold h-12 transition-all">
                  Contact Our Stylists
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
        
      </div>
    </div>
  );
}