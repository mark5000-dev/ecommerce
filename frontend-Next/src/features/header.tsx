"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Search, User, Menu, Heart,LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Cart } from "./cartslider";
import { useAuthState } from "@/app/provider";
import { useCartQuery } from "@/hooks/useCart";
import { useWishlistQuery } from "@/hooks/useWishlist";
import { api } from "@/lib/api";


// TODO: Link these to your updated state management layout 
// (e.g., Zustand store or React Query counts)

export function LogoutButton() {
  const { setIsAuthenticated } = useAuthState();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // 1. Tell backend to clear session and let api.ts run setToken(null)
      await api.logout(); 
      
      // 2. Synchronously flip the UI state flag to false
      setIsAuthenticated(false); 
      
      // 3. Kick them back out to public territory
      router.push("/"); 
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <button onClick={handleLogout} className="text-xs uppercase tracking-widest text-destructive">
      <LogOut className="h-4 w-4"/>
    </button>
  );
};

const useHeaderCounters = () => {
  // 1. Alias 'data' to avoid naming collisions, and default to an empty array if undefined
  const { data: cartRes } = useCartQuery();
  const { data: wishlistRes } = useWishlistQuery();

  // 2. Safely normalize data types using your API's structured payload fallback patterns
  const cartItems = cartRes ? (Array.isArray(cartRes) ? cartRes : cartRes.items || []) : [];
  const wishlistItems = wishlistRes || [];

  // 3. Compute counts using the standard array .length property
  return {
    cartItemsCount: cartItems.length,
    wishlistItemsCount: wishlistItems.length,
  };
};

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cartItemsCount, wishlistItemsCount } = useHeaderCounters();

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link href="/">
            <div className="flex-shrink-0 cursor-pointer">
              <h1 className="font-serif text-[2rem] tracking-tight">
                <span className="text-foreground">LUX</span>
                <span className="text-[#D4AF37]">É</span>
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/products" className="text-foreground hover:text-[#D4AF37] transition-colors font-medium text-sm tracking-wide uppercase">
              New Arrivals
            </Link>
            
            <Link href="/categories/womens-collection" className="text-foreground hover:text-[#D4AF37] transition-colors font-medium text-sm tracking-wide uppercase">
              Women
            </Link>
            <Link href="/categories/mens-collection" className="text-foreground hover:text-[#D4AF37] transition-colors font-medium text-sm tracking-wide uppercase">
              Men
            </Link>
            <Link href="/categories/kids-collection" className="text-foreground hover:text-[#D4AF37] transition-colors font-medium text-sm tracking-wide uppercase">
              Kids
            </Link>
            <Link href="/categories" className="text-foreground hover:text-[#D4AF37] transition-colors font-medium text-sm tracking-wide uppercase">
              Collections
            </Link>
            <Link href="/products" className="text-foreground hover:text-[#D4AF37] transition-colors font-medium text-sm tracking-wide uppercase">
              Products
            </Link>
            
            <Link href="/about" className="text-foreground hover:text-[#D4AF37] transition-colors font-medium text-sm tracking-wide uppercase">
              About
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
              <Search className="h-5 w-5" />
            </Button>
            
            <Button variant="ghost" size="icon" className="hidden sm:inline-flex" asChild>
              <Link href="/profile">
                <User className="h-5 w-5" />
              </Link>
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
              asChild
            >
              <Link href="/wishlist">
                <Heart className="h-5 w-5" />
                {wishlistItemsCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-[#D4AF37] text-black hover:bg-[#C5A028] h-5 w-5 flex items-center justify-center p-0 text-xs rounded-full">
                    {wishlistItemsCount}
                  </Badge>
                )}
              </Link>
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-[#D4AF37] text-black hover:bg-[#C5A028] h-5 w-5 flex items-center justify-center p-0 text-xs rounded-full">
                  {cartItemsCount}
                </Badge>
              )}
            </Button>
            <LogoutButton />
            

            {/* Mobile Menu Sheet */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-[#fffaf0] w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle className="font-serif text-[1.5rem] text-left">
                    <span className="text-foreground">LUX</span>
                    <span className="text-[#D4AF37]">É</span>
                  </SheetTitle>
                </SheetHeader>
                <Separator className="my-4" />
                <nav className="flex flex-col gap-4">
                  <Link href="/products" onClick={() => setIsMenuOpen(false)} className="text-foreground hover:text-[#D4AF37] transition-colors py-2 font-medium">
                    New Arrivals
                  </Link>
                  <Link href="/categories/womens-collection" onClick={() => setIsMenuOpen(false)} className="text-foreground hover:text-[#D4AF37] transition-colors py-2 font-medium">
                    Women
                  </Link>
                  <Link href="/categories/mens-collection" onClick={() => setIsMenuOpen(false)} className="text-foreground hover:text-[#D4AF37] transition-colors py-2 font-medium">
                    Men
                  </Link>
                  <Link href="/categories" onClick={() => setIsMenuOpen(false)} className="text-foreground hover:text-[#D4AF37] transition-colors py-2 font-medium">
                    Collections
                  </Link>
                  <Link href="/about" onClick={() => setIsMenuOpen(false)} className="text-foreground hover:text-[#D4AF37] transition-colors py-2 font-medium">
                    About
                  </Link>
                  <Separator className="my-2" />
                  <Link href="/wishlist" onClick={() => setIsMenuOpen(false)} className="text-foreground hover:text-[#D4AF37] transition-colors py-2 flex items-center gap-2 font-medium">
                    <Heart className="h-4 w-4" />
                    Wishlist {wishlistItemsCount > 0 && `(${wishlistItemsCount})`}
                  </Link>
                  <Link href="/cart" onClick={() => setIsMenuOpen(false)} className="text-foreground hover:text-[#D4AF37] transition-colors py-2 flex items-center gap-2 font-medium">
                    <ShoppingBag className="h-4 w-4" />
                    Cart {cartItemsCount > 0 && `(${cartItemsCount})`}
                  </Link>
                  <LogoutButton />
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      
      {/* Cart Drawer */}
      <Cart open={isCartOpen} onOpenChange={setIsCartOpen} />
    </header>
  );
};