"use client";

import { ImageWithFallback } from "@/components/ui/imageWithFallback";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Minus, Plus, ShoppingBag, Truck } from "lucide-react";
import Link from "next/link";

interface CartProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// TODO: Replace this temporary hook structure with either your updated Redux hooks, 
// a Zustand store, or TanStack React Query hooks matching your Express API.
const useCart = () => {
  // Mocking the structure for instant compilation
  return {
    items: [
      { id: 1, name: "Luxury Silk Dress", price: 250, quantity: 1, image: "/sample.jpg", size: "M", color: "Gold" }
    ],
    subtotal: 250,
    shipping: 15,
    total: 265,
    updateQuantity: (id: number, qty: number) => {},
    removeItem: (id: number) => {}
  };
};

export const Cart = ({ open, onOpenChange }: CartProps) => {
  const { items, subtotal, shipping, total, updateQuantity, removeItem } = useCart();

  const handleUpdateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(id, newQuantity);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg flex flex-col p-0 bg-[#fffaf0]">
        <SheetHeader className="px-6 pt-6 pb-4">
          <Link href="/cart" onClick={() => onOpenChange(false)}>
            <SheetTitle className="flex items-center gap-2 hover:text-[#D4AF37] transition-colors cursor-pointer">
              <ShoppingBag className="h-5 w-5" />
              Shopping Cart ({items.length})
            </SheetTitle>
          </Link>
        </SheetHeader>
        
        <Separator />

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="mb-2 font-medium">Your cart is empty</h3>
            <p className="text-muted-foreground text-sm mb-6">
              Add some luxury items to get started
            </p>
            <Button 
              onClick={() => onOpenChange(false)}
              className="bg-[#D4AF37] text-black hover:bg-[#C5A028]"
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-6">
              <div className="space-y-4 py-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-24 h-24 flex-shrink-0 bg-muted overflow-hidden">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="truncate font-medium mb-1">{item.name}</h4>
                          {(item.size || item.color) && (
                            <div className="flex gap-2 text-xs text-muted-foreground">
                              {item.size && <span>Size: {item.size}</span>}
                              {item.color && <span>Color: {item.color}</span>}
                            </div>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 flex-shrink-0 hover:text-destructive"
                          onClick={() => removeItem(item.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-border bg-background">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-none"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value) || 1)}
                            className="w-12 h-8 text-center border-0 border-x border-border p-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
                            min={1}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-none"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-[#D4AF37] font-medium">
                          ${(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="border-t border-border bg-background">
              <div className="px-6 py-4 space-y-3">
                {/* Free Shipping Banner */}
                {subtotal > 500 ? (
                  <Badge className="w-full bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20 justify-center py-2 rounded-none">
                    <Truck className="h-3 w-3 mr-2" />
                    Free Shipping Applied
                  </Badge>
                ) : (
                  <p className="text-xs text-muted-foreground text-center">
                    Add ${(500 - subtotal).toLocaleString()} more for free shipping
                  </p>
                )}
                
                <Separator />
                
                {/* Summary */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">${subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">{shipping === 0 ? "Free" : `$${shipping}`}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-base">
                    <span className="font-medium">Total</span>
                    <span className="text-[#D4AF37] font-semibold">${total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <SheetFooter className="px-6 pb-6">
                <div className="w-full space-y-2">
                  <Button 
                    className="w-full bg-[#D4AF37] text-black hover:bg-[#C5A028] font-medium"
                    size="lg"
                  >
                    Proceed to Checkout
                  </Button>

                  <Button
                    className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/80 font-medium gap-2"
                    size="lg"
                    asChild
                    onClick={() => onOpenChange(false)}
                  >
                    <Link href="/cart">
                      <ShoppingBag className="w-4 h-4"/>
                      Go to Cart
                    </Link>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => onOpenChange(false)}
                  >
                    Continue Shopping
                  </Button>
                </div>
              </SheetFooter>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};