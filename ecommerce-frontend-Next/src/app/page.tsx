"use client";
import React from "react";
import Link from "next/link";
import { ArrowRight, Check, Heart, ShoppingBag, Eye } from "lucide-react";
import { Newsletter } from "@/features/newsletter";
import { ImageWithFallback } from "@/components/ui/imageWithFallback";
import { ProductCard } from "@/features/productCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { api } from "@/lib/api";
import type { Product } from "@/model";



// --- DUMMY DATA STRUCTURES ---
const categories = [
  {
    id: "1",
    name: "Women's Collection",
    image: "https://images.unsplash.com/photo-1610209740880-6ecc4b20ea78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    description: "Elegant dresses, sophisticated separates",
    slug: "womens-collection"
  },
  {
    id: "2",
    name: "Men's Collection",
    image: "https://images.unsplash.com/photo-1553315164-49bb0615e0c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    description: "Tailored suits, refined essentials",
    slug: "mens-collection"
  },
  {
    id: "3",
    name: "Accessories",
    image: "https://images.unsplash.com/photo-1569388330292-79cc1ec67270?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    description: "Curated pieces to complete your look",
    slug: "accessories"
  },
];

const showcaseProducts = [
  {
    id: "p1",
    name: "Silk Slip Dress",
    price: "$340",
    category: "Women's",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600"
  },
  {
    id: "p2",
    name: "Tailored Wool Blazer",
    price: "$580",
    category: "Men's",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600"
  },
  {
    id: "p3",
    name: "Classic Leather Tote",
    price: "$420",
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600"
  },
  {
    id: "p4",
    name: "Gold Chain Monograph Cuff",
    price: "$210",
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600"
  }
];

// --- id based navbar
const SectionSubNav: React.FC = () => {
  const links = [
    { label: "Overview", id: "#hero" },
    { label: "The Lookbook", id: "#products" },
    { label: "Our Heritage", id: "#about" },
    { label: "Categories", id: "#categories" },
    { label: "Contact us", id: "#newsletter" }
  ];

  return (
    <div className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 lg:px-8">
        <nav className="flex h-12 items-center justify-center gap-6 sm:gap-10 text-[11px] sm:text-xs uppercase tracking-widest font-medium">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.id}
              className="text-muted-foreground hover:text-[#D4AF37] transition-colors duration-200 relative py-3 group"
            >
              {link.label}
              {/* Premium minimal underline animation on hover */}
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#D4AF37] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
};

// --- FEATURE SECTIONS ---

const Hero: React.FC = () => {
  return (
    <section id="hero" className="relative h-[70vh] min-h-[500px] overflow-hidden">
      {/* Background Image Panel */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1567777301743-3b7ef158aadf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
          alt="Luxury Fashion Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-transparent" />
      </div>

      {/* Content Layer */}
      <div className="relative container mx-auto px-4 lg:px-8 h-full flex items-center">
        <div className="max-w-2xl">
          <div className="inline-block mb-6">
            <span className="px-4 py-2 bg-[#D4AF37]/10 border border-[#D4AF37] text-[#D4AF37] backdrop-blur-sm text-sm font-medium tracking-wider uppercase">
              Winter 2025 Collection
            </span>
          </div>
          
          <h1 className="font-serif text-white text-[3.5rem] md:text-[5rem] lg:text-[6rem] leading-[1.1] mb-6">
            Timeless
            <br />
            Elegance
          </h1>
          
          <p className="text-white/90 text-lg md:text-xl mb-8 max-w-lg font-light">
            Discover our curated collection of luxury fashion pieces that define sophistication and style.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/categories"
              className="inline-flex items-center justify-center bg-[#D4AF37] text-black hover:bg-[#C5A028] transition-all font-medium rounded-md px-8 h-14"
            >
              Shop Collections
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center border border-white text-white hover:bg-white hover:text-black transition-all font-medium rounded-md px-8 h-14"
            >
              Explore Lookbook
            </Link>
          </div>
        </div>
      </div>

      {/* Bounce Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden sm:block">
        <div className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-1">
          <div className="w-1 h-2 bg-white/60 rounded-full" />
        </div>
      </div>
    </section>
  );
};


const CategoryShowcase: React.FC = () => {
  return (
    <section id="categories" className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        
        {/* Module Title Deck */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-[2.5rem] md:text-[3.5rem] mb-4 text-foreground">
            Shop by Category
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-light">
            Explore our carefully curated collections designed for the modern connoisseur
          </p>
        </div>

        {/* Dynamic Card Assembly Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link 
              href={`/category/${category.slug}`} 
              key={category.id}
              className="group relative h-[450px] overflow-hidden rounded-lg shadow-md block"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              {/* Linear Matte Shade */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              {/* Core Anchored Text Metrics */}
              <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="font-serif text-white text-2xl mb-1 flex items-center gap-2">
                  {category.name}
                  <ArrowRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[#D4AF37]" />
                </h3>
                <p className="text-white/80 text-sm font-light opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {category.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};

const ProductGrid: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadShowcase() {
      try {
        setIsLoading(true);
        const data = await api.getProducts({ limit: 8 });
        const list = Array.isArray(data) ? data : data.products || [];
        setProducts(list);
      } catch (err) {
        console.error("Failed to load showcase products:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadShowcase();
  }, []);

  // Monitor scroll positioning to dynamically reveal or hide control buttons
  const updateScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      
      // Show left button only after scrolling right (buffer of 10px)
      setShowLeftArrow(scrollLeft > 10);
      
      // Hide right button if we've reached the end of the container track
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", updateScrollButtons);
      // Run an initial evaluation frame
      updateScrollButtons();
    }
    return () => container?.removeEventListener("scroll", updateScrollButtons);
  }, []);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { clientWidth } = scrollContainerRef.current;
      // Scroll by 80% of the visible container frame width for context continuation
      const scrollAmount = clientWidth * 0.8; 

      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section id="products" className="py-20 bg-card">
      <div className="container mx-auto px-4 lg:px-8">
        
        {/* Header Segment */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="font-serif text-[2.5rem] md:text-[3.5rem] text-foreground mb-2">
              The Lookbook
            </h2>
            <p className="text-muted-foreground text-lg font-light">
              Highly coveted seasonal releases, tailored for distinction.
            </p>
          </div>
          <Link 
            href="/products" 
            className="text-[#D4AF37] hover:text-[#C5A028] font-medium inline-flex items-center gap-1 shrink-0 group"
          >
            View All Lookbook items 
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Carousel Slider Workspace Area */}
        <div className="relative group">
          
          {/* Left Arrow Controller Button */}
          {showLeftArrow && (
            <button
              type="button"
              onClick={() => handleScroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-background/90 hover:bg-background border border-border text-foreground p-3 rounded-full shadow-lg transition-all -translate-x-1/2 opacity-0 group-hover:opacity-100 focus:opacity-100"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {/* Right Arrow Controller Button */}
          {showRightArrow && (
            <button
              type="button"
              onClick={() => handleScroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-background/90 hover:bg-background border border-border text-foreground p-3 rounded-full shadow-lg transition-all translate-x-1/2 opacity-0 group-hover:opacity-100 focus:opacity-100"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          {/* Horizontal Scrolling Component Row Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-8 overflow-x-auto scroll-smooth pb-6 snap-x snap-mandatory"
            style={{ 
              scrollbarWidth: "none",     /* Hides Firefox scrollbar */
              msOverflowStyle: "none",    /* Hides IE/Edge scrollbar */
            }}
          >
            {/* Direct Webkit dynamic scrollbar styling bypass injection */}
            <style jsx global>{`
              div::-webkit-scrollbar {
                display: none;            /* Hides Chrome/Safari/Webkit scrollbars */
              }
            `}</style>

            {isLoading ? (
              <div className="py-12 text-center text-muted-foreground w-full">Curating showcase...</div>
            ) : products.map((product) => (
              <div 
                key={product.id} 
                className="w-[280px] sm:w-[320px] shrink-0 snap-start"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};


// -- About us
export const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-card border-b border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center">
          
          {/* Showcase Display Image */}
          <div className="order-2 md:order-1">
            <div className="relative aspect-[3/4] overflow-hidden rounded-lg shadow-xl group">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1759323321196-2813db509285?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                alt="The Craftsmanship of LUXÉ"
                className="w-full h-full transform group-hover:scale-105 transition-transform duration-700"
              />
              <span className="absolute top-6 left-6 bg-[#D4AF37] text-black font-semibold text-xs tracking-wider uppercase px-5 py-2.5 rounded-sm shadow-md z-10">
                Our Heritage
              </span>
            </div>
          </div>

          {/* Copy Deck / Brand Manifesto */}
          <div className="order-1 md:order-2">
            <div className="max-w-lg">
              <div className="w-16 h-1 bg-[#D4AF37] mb-6" />
              <h2 className="font-serif text-[2.5rem] md:text-[3.5rem] leading-tight mb-6 text-foreground">
                The Essence of LUXÉ
              </h2>
              <p className="text-muted-foreground mb-8 text-lg font-light leading-relaxed">
                Founded on the principles of timeless elegance and uncompromised craftsmanship, 
                LUXÉ bridges the gap between classical tailoring and modern sophistication. 
                We believe exceptional garments shouldn't just turn heads—they should tell a story.
              </p>
              
              <div className="space-y-4 mb-8">
                {[
                  { title: "Sartorial Excellence", desc: "Partnering with multi-generational European ateliers." },
                  { title: "Conscious Luxury", desc: "Committed to circular fashion and strictly ethical sourcing." },
                  { title: "Tailored to You", desc: "An unwavering focus on silhouette, fit, and daily comfort." }
                ].map((item, i) => (
                  <div className="flex items-start gap-4" key={i}>
                    <span className="flex items-center justify-center rounded-full w-6 h-6 border border-[#D4AF37] shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-[#D4AF37]" />
                    </span>
                    <div>
                      <p className="font-medium text-foreground">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/about"
                className="inline-flex items-center justify-center bg-foreground text-background hover:bg-foreground/90 transition-colors font-medium rounded-md px-8 h-12 shadow-sm"
              >
                Discover More
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};



// --- CORE LAYOUT ROUTE EXPORT ---
export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <SectionSubNav />
        <Hero />
        <ProductGrid />
        <AboutSection />
        <CategoryShowcase />
        <div id="newsletter"><Newsletter /></div>
      </main>
    </div>
  );
}