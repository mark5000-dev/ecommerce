"use client";
import React from "react";
import Link from "next/link";
import { ArrowRight, Check, Heart, ShoppingBag, Eye } from "lucide-react";

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

// --- FEATURE SECTIONS ---

const Hero: React.FC = () => {
  return (
    <section className="relative h-[90vh] min-h-[600px] overflow-hidden">
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

const FeaturedCollection: React.FC = () => {
  return (
    <section className="py-20 bg-card">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center">
          
          {/* Showcase Display Image */}
          <div className="order-2 md:order-1">
            <div className="relative aspect-[3/4] overflow-hidden rounded-lg shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1759323321196-2813db509285?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                alt="Featured Luxury Line"
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
              />
              <span className="absolute top-6 left-6 bg-[#D4AF37] text-black font-semibold text-xs tracking-wider uppercase px-5 py-2.5 rounded-sm shadow-md">
                New Arrivals
              </span>
            </div>
          </div>

          {/* Copy Deck / Specs */}
          <div className="order-1 md:order-2">
            <div className="max-w-lg">
              <div className="w-16 h-1 bg-[#D4AF37] mb-6" />
              <h2 className="font-serif text-[2.5rem] md:text-[3.5rem] leading-tight mb-6 text-foreground">
                Crafted for the Discerning
              </h2>
              <p className="text-muted-foreground mb-8 text-lg font-light leading-relaxed">
                Every piece in our collection is meticulously selected to embody luxury, 
                quality, and timeless style. From the finest fabrics to impeccable craftsmanship, 
                we bring you fashion that makes a statement.
              </p>
              
              <div className="space-y-4 mb-8">
                {[
                  { title: "Premium Materials", desc: "Sourced from the world's finest manufacturers" },
                  { title: "Expert Craftsmanship", desc: "Each piece made with attention to detail" },
                  { title: "Timeless Design", desc: "Styles that transcend seasonal trends" }
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
                href="/collections/curated"
                className="inline-flex items-center justify-center bg-foreground text-background hover:bg-foreground/90 transition-colors font-medium rounded-md px-8 h-12"
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

const CategoryShowcase: React.FC = () => {
  return (
    <section className="py-20 bg-background">
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
  return (
    <section className="py-20 bg-card">
      <div className="container mx-auto px-4 lg:px-8">
        
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

        {/* Dynamic Static Product Blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {showcaseProducts.map((product) => (
            <div className="group flex flex-col h-full" key={product.id}>
              {/* Card Thumbnail Box */}
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-muted mb-4 shadow-sm">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Floating Utility Overlay Frame */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button 
                    type="button"
                    aria-label="Add to Wishlist"
                    className="h-10 w-10 rounded-full bg-background flex items-center justify-center text-foreground hover:text-red-500 hover:scale-110 transition-all shadow-md"
                  >
                    <Heart className="w-5 h-5" />
                  </button>
                  <button 
                    type="button"
                    aria-label="Quick view"
                    className="h-10 w-10 rounded-full bg-background flex items-center justify-center text-foreground hover:text-[#D4AF37] hover:scale-110 transition-all shadow-md"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Descriptions Footer Block */}
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">
                    {product.category}
                  </span>
                  <h3 className="font-medium text-foreground group-hover:text-[#D4AF37] transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                </div>
                <p className="font-serif text-foreground font-medium shrink-0 ml-4">
                  {product.price}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

const Newsletter: React.FC = () => {
  return (
    <section className="py-24 bg-background border-t border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-[2.5rem] md:text-[3.5rem] text-foreground mb-4">
            Join the Club
          </h2>
          <p className="text-muted-foreground text-lg mb-8 font-light max-w-xl mx-auto">
            Subscribe to receive exclusive early access to new collections, lookbooks, and insider updates.
          </p>
          
          {/* Custom Interactive Pure Styling Box */}
          <form 
            onSubmit={(e) => e.preventDefault()} 
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              placeholder="Enter your email address"
              required
              className="flex-1 px-4 h-12 rounded-md border border-border bg-card text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] transition-shadow text-sm"
            />
            <button
              type="submit"
              className="h-12 px-6 bg-[#D4AF37] text-black hover:bg-[#C5A028] font-medium rounded-md tracking-wide transition-colors shrink-0 text-sm"
            >
              Subscribe
            </button>
          </form>
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
        <Hero />
        <FeaturedCollection />
        <CategoryShowcase />
        <ProductGrid />
        <Newsletter />
      </main>
    </div>
  );
}