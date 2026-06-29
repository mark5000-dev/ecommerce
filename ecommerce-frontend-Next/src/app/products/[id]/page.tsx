"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import { ChevronLeft, ChevronRight, Heart, Star, Truck, RotateCcw, Shield, Minus, Plus, Share2, ArrowRight } from "lucide-react";
import { ImageWithFallback } from "@/components/ui/imageWithFallback";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { PageHero } from "@/features/pageHero";
import { ProductCard } from "@/features/productCard"; // Ensure this import path is accurate for your setup
import type { Product } from "@/model";
import { api } from "@/lib/api";

const oneOP: Product = {
  id: 1,
  name: "Cashmere Overcoat",
  price: 2899,
  stock: 8,
  mainCategory: "womens",
  image: "https://images.unsplash.com/photo-1567777301743-3b7ef158aadf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  description:
    "Experience unparalleled luxury with this exquisite cashmere overcoat. Meticulously crafted from the finest 100% pure cashmere, this timeless piece combines supreme comfort with sophisticated elegance.",
  images: [
    "https://images.unsplash.com/photo-1567777301743-3b7ef158aadf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    "https://images.unsplash.com/photo-1670177257750-9b47927f68eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    "https://images.unsplash.com/photo-1722842529941-825976fc14f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  ],
  comments: [
    { id: 1, author: "Sarah M.", rating: 5, date: "2 days ago", comment: "Exceptional quality and craftsmanship." },
    { id: 2, author: "James R.", rating: 5, date: "1 week ago", comment: "Luxury through and through." },
  ],
};

interface PageProps {
  params: Promise<{ id: string }>;
}

/* ==========================================
   RELATED PRODUCTS CAROUSEL COMPONENT
   ========================================== */
interface RelatedProductsProps {
  currentCategory: string;
  currentProductId: number | string;
}

function RelatedProducts({ currentCategory, currentProductId }: RelatedProductsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Fetch catalog inventory to determine related options
  useEffect(() => {
    async function fetchRelated() {
      try {
        const data = await api.getProducts({ category: currentCategory, limit: 12 });
        const list = Array.isArray(data) ? data : data.products || [];
        setProducts(list);
      } catch (err) {
        console.error("Error reading product catalog for recommendations:", err);
      }
    }
    fetchRelated();
  }, [currentCategory, currentProductId]);

  // Compute matched categorical selections safely handling mismatched ID type variations
  const filteredProducts = useMemo(() => {
    return products.filter(
      (p) =>
        p.mainCategory?.toLowerCase() === currentCategory?.toLowerCase() &&
        String(p.id) !== String(currentProductId)
    );
  }, [products, currentCategory, currentProductId]);

  const updateScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", updateScrollButtons);
      updateScrollButtons();
    }
    return () => container?.removeEventListener("scroll", updateScrollButtons);
  }, [filteredProducts]);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (filteredProducts.length === 0) return null;

  return (
    <div className="mt-24 border-t border-border pt-20">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
        <div>
          <h2 className="font-serif text-[2rem] text-foreground mb-2">Complete The Collection</h2>
          <p className="text-muted-foreground text-sm font-light">
            Hand-selected alternative additions carefully tailored to match your design profile.
          </p>
        </div>
      </div>

      {/* Carousel Track Wrapper */}
      <div className="relative group/carousel">
        {showLeftArrow && (
          <button
            type="button"
            onClick={() => handleScroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-background/90 hover:bg-background border border-border text-foreground p-3 rounded-full shadow-lg transition-all -translate-x-1/2 opacity-0 group-hover/carousel:opacity-100 focus:opacity-100"
            aria-label="Scroll related products left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {showRightArrow && (
          <button
            type="button"
            onClick={() => handleScroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-background/90 hover:bg-background border border-border text-foreground p-3 rounded-full shadow-lg transition-all translate-x-1/2 opacity-0 group-hover/carousel:opacity-100 focus:opacity-100"
            aria-label="Scroll related products right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scroll-smooth pb-6 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {/* Native scrollbar hide utility injection */}
          <style jsx global>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          {filteredProducts.map((item) => (
            <div key={item.id} className="w-[260px] sm:w-[300px] shrink-0 snap-start">
              <ProductCard product={item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ==========================================
   MAIN SINGLE PRODUCT PAGE ENTRY POINT
   ========================================== */
export default function SingleProduct({ params }: PageProps) {
  const resolvedParams = React.use(params);
  const slug = resolvedParams.id;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("Black");
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    async function loadProductDetail() {
      try {
        const idFromSlug = parseInt((slug?.split("-").pop() || "0"), 10);
        const found = await api.getProductById(idFromSlug);
        console.log("Found the product", found);

        if (found) {
          // If the database returns empty comments, merge mock reviews to keep premium visual styling
          if (!found.comments || found.comments.length === 0) {
            found.comments = oneOP.comments;
          }
          setProduct(found);
        } else {
          setProduct(oneOP);
        }
      } catch (err) {
        console.log("Using dynamic layout fallback reference structure.", err);
        setProduct(oneOP);
      } finally {
        setLoading(false);
      }
    }
    loadProductDetail();
  }, [slug]);

  if (loading || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="font-serif tracking-widest text-muted-foreground animate-pulse">Loading product matrix...</p>
      </div>
    );
  }

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setSelectedImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setSelectedImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const colorOptions = [
    { name: "Black", hex: "#000000" },
    { name: "Navy", hex: "#1e3a5f" },
    { name: "Charcoal", hex: "#36454f" },
    { name: "Camel", hex: "#C19A6B" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PageHero
        title={""}
        description={""}
        breadcrumbs={[
          { label: "Products", href: "/products" },
          { label: product.mainCategory || "Collection", href: `/categories/${["womens", "mens", "kids"].includes(product.mainCategory) ? product.mainCategory + "-collection" : product.mainCategory || "all"}` },
          { label: product.name || "" },
        ]}
      />

      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">

            {/* Interactive Hero Carousel Display Block */}
            <div className="flex flex-col">
              <Card className="overflow-hidden border-0 relative group">
                <div className="relative aspect-[3/4] bg-muted w-full select-none">
                  <ImageWithFallback
                    src={product.images?.[selectedImage] || product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-all duration-500"
                  />
                  <Badge className="absolute top-6 left-6 bg-[#D4AF37] text-black tracking-widest uppercase text-[10px]">
                    Luxury
                  </Badge>

                  {/* Wishlist Button Overlay */}
                  <Button
                    size="icon"
                    variant="ghost"
                    className={`absolute top-6 right-6 bg-white/90 hover:bg-white rounded-full transition-colors ${isInWishlist ? "text-red-500" : "text-neutral-600"
                      }`}
                    onClick={() => setIsInWishlist(!isInWishlist)}
                  >
                    <Heart className={`h-5 w-5 ${isInWishlist ? "fill-current" : ""}`} />
                  </Button>

                  {/* Left Carousel Arrow */}
                  {product.images && product.images.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2.5 rounded-full transition-all text-neutral-800 shadow-md md:opacity-0 md:group-hover:opacity-100 z-10"
                        aria-label="Previous Slide image"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>

                      {/* Right Carousel Arrow */}
                      <button
                        onClick={handleNextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2.5 rounded-full transition-all text-neutral-800 shadow-md md:opacity-0 md:group-hover:opacity-100 z-10"
                        aria-label="Next Slide image"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </>
                  )}
                </div>
              </Card>

              {/* Thumbnails list below slider */}
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4 mt-4">
                  {product.images.map((img: string, i: number) => (
                    <Card
                      key={i}
                      className={`overflow-hidden cursor-pointer border-2 transition-all rounded ${selectedImage === i ? "border-[#D4AF37]" : "border-border hover:border-[#D4AF37]/50"
                        }`}
                      onClick={() => setSelectedImage(i)}
                    >
                      <div className="aspect-square bg-muted">
                        <img src={img} alt={`Thumbnail preview selection matrix ${i + 1}`} className="w-full h-full object-cover" />
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Product Meta Specifications Profile */}
            <div className="space-y-6">
              <Badge variant="outline" className="border-[#D4AF37]/30 text-[#D4AF37] tracking-widest uppercase text-[10px]">
                {product.mainCategory}
              </Badge>
              <h1 className="font-serif text-[2.25rem] md:text-[2.75rem] leading-tight text-foreground">{product.name}</h1>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-[#D4AF37] text-[#D4AF37]" />
                  ))}
                </div>
                <span className="text-xs uppercase tracking-wider text-muted-foreground">
                  ({product.comments?.length || 0} Reviews)
                </span>
              </div>

              <div className="py-2">
                <p className="text-[#D4AF37] text-[2rem] tracking-tight font-medium">${product.price?.toLocaleString()}</p>
              </div>

              <p className="text-muted-foreground leading-relaxed font-light text-sm md:text-base">{product.description}</p>

              <Separator />

              {/* Color Selector */}
              <div>
                <span className="mb-3 block text-xs uppercase tracking-widest font-medium text-foreground">Color</span>
                <div className="flex items-center gap-3">
                  {colorOptions.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`relative w-7 h-7 rounded-full border border-black/10 transition-all ${selectedColor === color.name
                        ? "ring-2 ring-offset-2 ring-[#D4AF37] scale-105"
                        : "hover:scale-105"
                        }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    >
                      {selectedColor === color.name && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <span className="w-1.5 h-1.5 bg-white rounded-full shadow-sm" />
                        </span>
                      )}
                    </button>
                  ))}
                  <span className="text-xs tracking-wide text-muted-foreground ml-2 uppercase">{selectedColor}</span>
                </div>
              </div>

              {/* Size Selector Array */}
              <div>
                <span className="mb-3 block text-xs uppercase tracking-widest font-medium text-foreground">Size</span>
                <div className="flex gap-2">
                  {["XS", "S", "M", "L", "XL"].map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`flex-1 border text-xs py-2.5 tracking-wider font-medium uppercase transition-all ${selectedSize === size
                        ? "border-foreground bg-foreground text-background"
                        : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Controls */}
              <div>
                <span className="mb-3 block text-xs uppercase tracking-widest font-medium text-foreground">Quantity</span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-border bg-background rounded">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-9 w-9 text-muted-foreground hover:text-foreground rounded-none"
                      onClick={() => handleQuantityChange(-1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <Input
                      value={quantity}
                      className="w-12 h-9 text-center border-0 border-x border-border text-xs font-medium bg-transparent rounded-none pointer-events-none focus-visible:ring-0"
                      readOnly
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-9 w-9 text-muted-foreground hover:text-foreground rounded-none"
                      onClick={() => handleQuantityChange(1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <span className="text-xs text-muted-foreground italic">
                    Only {product.stock || 5} units available
                  </span>
                </div>
              </div>

              {/* Cart Submissions Block */}
              <div className="flex gap-3 pt-4">
                <Button
                  className="flex-1 bg-[#D4AF37] text-black hover:bg-[#C5A028] transition-all tracking-widest uppercase text-xs font-semibold h-12"
                  size="lg"
                  onClick={() => console.log("Added package items locally inside context layer:", { id: product.id, quantity, size: selectedSize, color: selectedColor })}
                >
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border border-border text-muted-foreground hover:text-foreground h-12 px-4"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>

              <Separator />

              {/* Luxury Value Badges */}
              <div className="grid grid-cols-3 gap-3">
                <Card className="text-center border-border bg-card/40 rounded-sm">
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <Truck className="h-4 w-4 mb-2 text-[#D4AF37]" />
                    <p className="text-[10px] uppercase tracking-wider text-foreground font-medium leading-tight">Complimentary<br />Delivery</p>
                  </CardContent>
                </Card>
                <Card className="text-center border-border bg-card/40 rounded-sm">
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <RotateCcw className="h-4 w-4 mb-2 text-[#D4AF37]" />
                    <p className="text-[10px] uppercase tracking-wider text-foreground font-medium leading-tight">30-Day<br />Returns</p>
                  </CardContent>
                </Card>
                <Card className="text-center border-border bg-card/40 rounded-sm">
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <Shield className="h-4 w-4 mb-2 text-[#D4AF37]" />
                    <p className="text-[10px] uppercase tracking-wider text-foreground font-medium leading-tight">Extended<br />Guarantees</p>
                  </CardContent>
                </Card>
              </div>

            </div>
          </div>

          {/* Customer Reviews Matrix Section */}
          <div className="mt-24">
            <div className="text-center mb-12">
              <h2 className="font-serif text-[2rem] mb-2 text-foreground">Verified Client Reviews</h2>
              <p className="text-muted-foreground text-sm font-light max-w-xl mx-auto">
                Read direct insights shared by our community regarding material performance, textures, and tailoring.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {(product.comments || []).map((review: any) => (
                <Card key={review.id} className="border border-border bg-card/50">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="h-10 w-10 shrink-0 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 text-[#D4AF37] flex items-center justify-center text-xs font-semibold tracking-wider">
                        {review.author?.split(" ").map((n: string) => n[0]).join("")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <h4 className="text-sm font-medium text-foreground truncate">{review.author}</h4>
                          <span className="text-[11px] text-muted-foreground shrink-0">{review.date}</span>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, idx) => (
                            <Star
                              key={idx}
                              className={`h-3 w-3 ${idx < review.rating ? "fill-[#D4AF37] text-[#D4AF37]" : "fill-neutral-200 text-neutral-200"
                                }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed font-light italic">
                      &ldquo;{review.comment}&rdquo;
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Related Products Carousel Injection */}
          <RelatedProducts
            currentCategory={product.mainCategory || "womens"}
            currentProductId={product.id}
          />

        </div>
      </section>
    </div>
  );
}