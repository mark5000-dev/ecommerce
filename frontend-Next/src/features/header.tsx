"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Search, User, Menu, Heart, LogOut, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Cart } from "./cartslider";
import { useAuthState } from "@/app/provider";
import { useCartQuery } from "@/hooks/useCart";
import { useWishlistQuery } from "@/hooks/useWishlist";
import { api } from "@/lib/api";

const useHeaderCounters = () => {
  const { data: cartRes } = useCartQuery();
  const { data: wishlistRes } = useWishlistQuery();

  const cartItems = cartRes ? (Array.isArray(cartRes) ? cartRes : cartRes.items || []) : [];
  const wishlistItems = wishlistRes || [];

  return {
    cartItemsCount: cartItems.length,
    wishlistItemsCount: wishlistItems.length,
  };
};

export const Header = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cartItemsCount, wishlistItemsCount } = useHeaderCounters();
  
  // Destructure reactive authentication layout flags directly from your state provider
  const { isAuthenticated, setIsAuthenticated } = useAuthState();

  const handleLogoutAction = async () => {
    try {
      await api.logout(); 
      setIsAuthenticated(false); 
      router.push("/"); 
      router.refresh();
    } catch (err) {
      console.error("Logout execution failed", err);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link href="/">
            <div className="flex-shrink-0 cursor-pointer">
              <h1 className="font-serif text-[2rem] tracking-tight">
                <span className="text-foreground">LUX</span>
                <span className="text-[#D4AF37]">E</span>
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
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
            <Link href="/categories" className="text-foreground hover:text-[#D4AF37] transition-colors font-medium text-sm tracking-wide uppercase">
              Collections
            </Link>
            <Link href="/about" className="text-foreground hover:text-[#D4AF37] transition-colors font-medium text-sm tracking-wide uppercase">
              About
            </Link>
          </nav>

          {/* Interface Action Control Panel */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
              <Search className="h-5 w-5" />
            </Button>
            
            {/* Dynamic User Dropdown Trigger Block */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="cursor-pointer">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-none border-border bg-background">
                {isAuthenticated ? (
                  <>
                    <DropdownMenuLabel className="font-serif text-xs uppercase tracking-wider text-muted-foreground">My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-border" />
                    <DropdownMenuItem asChild className="cursor-pointer focus:bg-muted focus:text-foreground text-xs uppercase tracking-widest">
                      <Link href="/profile" className="flex items-center w-full py-1.5">
                        <UserCircle className="mr-2 h-4 w-4 text-[#D4AF37]" /> Profile Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-border" />
                    <DropdownMenuItem 
                      onClick={handleLogoutAction} 
                      className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive text-xs uppercase tracking-widest font-medium"
                    >
                      <LogOut className="mr-2 h-4 w-4" /> Secure Logout
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild className="cursor-pointer focus:bg-[#D4AF37]/10 focus:text-[#D4AF37] text-xs uppercase tracking-widest text-center justify-center font-medium">
                      <Link href="/auth/login" className="w-full py-2">Sign In</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer focus:bg-muted focus:text-foreground text-xs uppercase tracking-widest text-center justify-center font-light">
                      <Link href="/auth/sign-up" className="w-full py-2">Create Account</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Wishlist Icon */}
            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link href="/wishlist">
                <Heart className="h-5 w-5" />
                {wishlistItemsCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-[#D4AF37] text-black hover:bg-[#C5A028] h-5 w-5 flex items-center justify-center p-0 text-xs rounded-full">
                    {wishlistItemsCount}
                  </Badge>
                )}
              </Link>
            </Button>
            
            {/* Cart Trigger */}
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
            
            {/* Mobile Responsive Navigation Drawer */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-background border-l border-border w-[300px]">
                <SheetHeader>
                  <SheetTitle className="font-serif text-[1.5rem] text-left">
                    <span className="text-foreground">LUX</span>
                    <span className="text-[#D4AF37]">E</span>
                  </SheetTitle>
                </SheetHeader>
                <Separator className="my-4" />
                <nav className="flex flex-col gap-4">
                  <Link href="/products" onClick={() => setIsMenuOpen(false)} className="text-foreground text-sm uppercase font-medium py-1">New Arrivals</Link>
                  <Link href="/categories/womens-collection" onClick={() => setIsMenuOpen(false)} className="text-foreground text-sm uppercase font-medium py-1">Women</Link>
                  <Link href="/categories/mens-collection" onClick={() => setIsMenuOpen(false)} className="text-foreground text-sm uppercase font-medium py-1">Men</Link>
                  <Link href="/categories" onClick={() => setIsMenuOpen(false)} className="text-foreground text-sm uppercase font-medium py-1">Collections</Link>
                  <Separator className="my-2" />
                  
                  {isAuthenticated ? (
                    <>
                      <Link href="/profile" onClick={() => setIsMenuOpen(false)} className="text-foreground text-sm uppercase font-medium py-1 flex items-center gap-2">
                        <UserCircle className="h-4 w-4 text-[#D4AF37]" /> Profile Dashboard
                      </Link>
                      <button 
                        onClick={() => { setIsMenuOpen(false); handleLogoutAction(); }} 
                        className="text-destructive text-left text-sm uppercase font-semibold py-1 flex items-center gap-2 mt-4"
                      >
                        <LogOut className="h-4 w-4" /> Logout Session
                      </button>
                    </>
                  ) : (
                    <Link href="/login" onClick={() => setIsMenuOpen(false)} className="text-[#D4AF37] text-sm uppercase font-semibold py-1">Sign In / Register</Link>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      
      {/* Slide-out Shopping Bag Cart Layout */}
      <Cart open={isCartOpen} onOpenChange={setIsCartOpen} />
    </header>
  );
};