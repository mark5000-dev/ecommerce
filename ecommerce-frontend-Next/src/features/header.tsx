import React from "react";
import Link from "next/link";
import { ShoppingBag, Search, User, Menu, Heart } from "lucide-react";

export const Header: React.FC = () => {
  // Static filler numbers for layout mapping
  const wishlistCountFiller = 3;
  const cartCountFiller = 2;

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link href="/">
            <h1 className="font-serif text-[2rem] tracking-tight">
              <span className="text-foreground">LUX</span>
              <span className="text-[#D4AF37]">É</span>
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/products" className="text-foreground hover:text-[#D4AF37] transition-colors">
              New Arrivals
            </Link>
            <Link href="/category/womens-collection" className="text-foreground hover:text-[#D4AF37] transition-colors">
              Women
            </Link>
            <Link href="/category/mens-collection" className="text-foreground hover:text-[#D4AF37] transition-colors">
              Men
            </Link>
            <Link href="/category/kids-collection" className="text-foreground hover:text-[#D4AF37] transition-colors">
              Kids
            </Link>
            <Link href="/categories" className="text-foreground hover:text-[#D4AF37] transition-colors">
              Collections
            </Link>
            <Link href="/about" className="text-foreground hover:text-[#D4AF37] transition-colors">
              About
            </Link>
          </nav>

          {/* Actions Workspace */}
          <div className="flex items-center gap-2">
            
            {/* Search Trigger */}
            <button
              type="button"
              aria-label="Search items"
              className="hidden sm:inline-flex items-center justify-center h-10 w-10 rounded-md text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Profile Route */}
            <Link
              href="/profile"
              aria-label="View account profile"
              className="hidden sm:inline-flex items-center justify-center h-10 w-10 rounded-md text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <User className="h-5 w-5" />
            </Link>

            {/* Wishlist Link + Badge Filler */}
            <Link
              href="/wishlist"
              aria-label="View wishlist"
              className="relative flex items-center justify-center h-10 w-10 rounded-md text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Heart className="h-5 w-5" />
              {wishlistCountFiller > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-black h-5 w-5 flex items-center justify-center text-xs font-semibold rounded-full">
                  {wishlistCountFiller}
                </span>
              )}
            </Link>
            
            {/* Shopping Bag Trigger + Badge Filler */}
            <button
              type="button"
              aria-label="Open shopping cart"
              className="relative flex items-center justify-center h-10 w-10 rounded-md text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCountFiller > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-black h-5 w-5 flex items-center justify-center text-xs font-semibold rounded-full">
                  {cartCountFiller}
                </span>
              )}
            </button>

            {/* Mobile Menu Trigger Placeholder */}
            <button
              type="button"
              aria-label="Toggle menu"
              className="inline-flex md:hidden items-center justify-center h-10 w-10 rounded-md text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};