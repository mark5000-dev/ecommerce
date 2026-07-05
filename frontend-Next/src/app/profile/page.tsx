"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ImageWithFallback } from "@/components/ui/imageWithFallback";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useProductsQuery } from "@/hooks/useProducts";
import {
  User,
  Package,
  Heart,
  MapPin,
  CreditCard,
  Shield,
  Edit,
  Trash2,
  Plus,
  Eye,
  CheckCircle2,
  Truck,
  Clock,
  Star
} from "lucide-react";

import {
  useUserProfileQuery,
  useUserProfileUpdateMutation,
  useAddressesQuery,
  useAddAddressMutation,
  useDeleteAddressMutation,
  usePaymentMethodsQuery,
  useOrdersQuery
} from '@/hooks/useUser';
import { useWishlistQuery } from '@/hooks/useWishlist';
import { RequireAuth } from '@/components/auth/require-auth';
import { type Order } from "@/model";

/* ==========================================
   PRIMARY CONTROLLER WORKSPACE COMPONENT
   ========================================== */
export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [orderFilter, setOrderFilter] = useState("all");
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);

  // Form States for Dynamic Mutation Inputs
  const [newAddress, setNewAddress] = useState({
    firstName: "", lastName: "", address: "", city: "", zip: "", phone: "", type: "Home"
  });

  // Queries Streams
  const { data: profileRes, isLoading: userLoading } = useUserProfileQuery();
  const { data: addressesRes, isLoading: addressesLoading } = useAddressesQuery();
  const { data: ordersRes, isLoading: ordersLoading } = useOrdersQuery();
  const { data: paymentsRes, isLoading: paymentsLoading } = usePaymentMethodsQuery();
  const { data: wishlistRes, isLoading: wishlistLoading } = useWishlistQuery();
  const { data: productsRes } = useProductsQuery({ limit: 100 });

  // Mutation Hooks
  const addAddressMutation = useAddAddressMutation();
  const deleteAddressMutation = useDeleteAddressMutation();

  const user = profileRes?.user || {};
  const addresses = addressesRes || [];
  const paymentMethodsList = paymentsRes || [];

  const ordersList = useMemo<Order[]>(() => {
    if (!ordersRes) return [];
    return ordersRes; 
  }, [ordersRes]);

  const filteredOrders = useMemo<Order[]>(() => {
    if (orderFilter === "all") return ordersList;
    return ordersList.filter((order: Order) => 
      order.status.toLowerCase() === orderFilter.toLowerCase()
    );
  }, [ordersList, orderFilter]);

  // Resolved Wishlist Details Mapping
  const wishlistItems = useMemo(() => {
    if (!wishlistRes || !productsRes) return [];
    const productsList = Array.isArray(productsRes) ? productsRes : productsRes.products || [];
    return wishlistRes.map((item: any) => {
      const product = productsList.find((p: any) => String(p.id) === String(item.productId));
      return {
        id: item.id,
        productId: item.productId,
        name: product?.name || "Bespoke Luxury Item",
        price: product?.price || 0,
        image: product?.image || "https://images.unsplash.com/photo-1567777301743-3b7ef158aadf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        inStock: product?.inStock !== false,
      };
    });
  }, [wishlistRes, productsRes]);

  // Aggregate Total Historical Spend
  const totalSpent = useMemo(() => {
    return ordersList.reduce((sum: number, order: any) => sum + order.total, 0);
  }, [ordersList]);

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    addAddressMutation.mutate({
      type: newAddress.type,
      address: newAddress.address,
      city: newAddress.city,
      state: "NY", // Or pull from an input state
      zip: newAddress.zip,
      country: "USA",
      phone: newAddress.phone,
      isDefault: false
    }, {
      onSuccess: () => {
        setIsAddAddressOpen(false);
        setNewAddress({ firstName: "", lastName: "", address: "", city: "", zip: "", phone: "", type: "Home" });
      }
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Delivered": return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "In Transit": return <Truck className="h-4 w-4 text-blue-600" />;
      case "Processing": return <Clock className="h-4 w-4 text-yellow-600" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered": return "bg-green-500/10 text-green-600 border-green-500/20";
      case "In Transit": return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "Processing": return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      default: return "";
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="font-serif tracking-widest text-muted-foreground animate-pulse">Synchronizing identity profile...</p>
      </div>
    );
  }

  return (
    <RequireAuth>
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 bg-card">
        {/* Profile Header Block */}
        <section className="bg-foreground text-background py-12">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Avatar className="h-24 w-24 border-4 border-[#D4AF37]">
                <AvatarFallback className="bg-[#D4AF37] text-black text-2xl font-serif">
                  {(user.firstName?.[0] || "") + (user.lastName?.[0] || "")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="font-serif text-[2.5rem] md:text-[3rem] mb-2 text-background">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-background/80 mb-4 font-light text-sm">
                  Member since {user.memberSince ? new Date(user.memberSince).getFullYear() : "2023"} • Loyalty: {user.loyaltyTier || "Bronze"} Tier
                </p>
                <div className="flex gap-3">
                  <Badge className="bg-[#D4AF37] text-black hover:bg-[#C5A028] text-[10px] tracking-wider uppercase font-semibold rounded-none">
                    {user.loyaltyTier || "Bronze"} Member
                  </Badge>
                  <Badge variant="outline" className="border-background/20 text-background text-[10px] tracking-wider uppercase font-medium rounded-none">
                    {(user.loyaltyPoints || 0).toLocaleString()} Points
                  </Badge>
                </div>
              </div>
              <Button variant="outline" className="border-background/20 text-background hover:bg-background hover:text-foreground rounded-none text-xs tracking-wider uppercase font-medium">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>
        </section>

        {/* Tab Controls Workspace Panel */}
        <section className="py-12">
          <div className="container mx-auto px-4 lg:px-8">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full justify-start border-b border-border rounded-none bg-transparent h-auto p-0 mb-8 overflow-x-auto no-scrollbar flex-nowrap">
                {["overview", "orders", "wishlist", "addresses", "payment", "settings"].map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className="data-[state=active]:border-b-2 data-[state=active]:border-[#D4AF37] rounded-none gap-2 text-xs uppercase tracking-widest font-medium py-3 px-4"
                  >
                    {tab === "overview" && <User className="h-3.5 w-3.5" />}
                    {tab === "orders" && <Package className="h-3.5 w-3.5" />}
                    {tab === "wishlist" && <Heart className="h-3.5 w-3.5" />}
                    {tab === "addresses" && <MapPin className="h-3.5 w-3.5" />}
                    {tab === "payment" && <CreditCard className="h-3.5 w-3.5" />}
                    {tab === "settings" && <Shield className="h-3.5 w-3.5" />}
                    {tab}
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Overview Subview Module */}
              <TabsContent value="overview" className="space-y-6 outline-none">
                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="border-border rounded-none shadow-none">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Total Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-serif mb-1 text-foreground">{ordersLoading ? "..." : ordersList.length}</div>
                      <p className="text-xs text-muted-foreground font-light">Processed orders ledger</p>
                    </CardContent>
                  </Card>

                  <Card className="border-border rounded-none shadow-none">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Total Spent</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-serif mb-1 text-foreground">${ordersLoading ? "..." : totalSpent.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground font-light">Total accumulated account investment</p>
                    </CardContent>
                  </Card>

                  <Card className="border-border rounded-none shadow-none">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Wishlist Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-serif mb-1 text-foreground">{wishlistLoading ? "..." : wishlistItems.length}</div>
                      <p className="text-xs text-muted-foreground font-light">Total items retained in archival space</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Micro Order Summary Ledger */}
                <Card className="border-border rounded-none shadow-none">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="font-serif text-lg text-foreground">Recent Activity Ledger</CardTitle>
                      <Button variant="ghost" onClick={() => setActiveTab("orders")} className="text-xs uppercase tracking-wider font-medium text-muted-foreground hover:text-foreground">
                        View All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {ordersLoading ? (
                      <div className="py-6 text-center text-xs text-muted-foreground">Querying recent entries...</div>
                    ) : ordersList.length === 0 ? (
                      <div className="py-6 text-center text-xs text-muted-foreground">No transaction actions established.</div>
                    ) : (
                      <div className="space-y-4">
                        {ordersList.slice(0, 3).map((order: Order) => {
                          const totalItemCount = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
                          const formattedDate = new Date(order.createdAt).toLocaleDateString(undefined, {
                            month: "short", day: "numeric", year: "numeric"
                          });

                          return (
                            <div key={order.id} className="flex items-center gap-4 p-4 border border-border rounded-none">
                              <div className="w-16 h-16 bg-muted overflow-hidden flex-shrink-0 flex items-center justify-center border border-dashed">
                                <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-mono">📦 Item</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="font-medium text-xs text-foreground truncate">{order.orderId}</p>
                                  <Badge variant="outline" className={`text-[10px] uppercase font-medium rounded-none py-0.5 ${getStatusColor(order.status)}`}>
                                    {getStatusIcon(order.status)}
                                    <span className="ml-1">{order.status}</span>
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground font-light">{formattedDate} • {totalItemCount} items</p>
                              </div>
                              <div className="text-right">
                                <p className="text-[#D4AF37] text-sm font-medium mb-1">${order.total.toLocaleString()}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Orders Panel View */}
              {/* Orders Panel View */}
              <TabsContent value="orders" className="space-y-6 outline-none">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="font-serif text-xl text-foreground mb-1">Archived Invoices</h2>
                    <p className="text-xs text-muted-foreground font-light">Inspect tracking indices across global fulfillment networks</p>
                  </div>
                  <Select value={orderFilter} onValueChange={setOrderFilter}>
                    <SelectTrigger className="w-[180px] rounded-none border-border text-xs uppercase tracking-wider font-medium">
                      <SelectValue placeholder="Filter listings" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Records</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="in transit">In Transit</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {ordersLoading ? (
                  <div className="py-12 text-center text-sm font-serif text-muted-foreground">Pulling collection records...</div>
                ) : filteredOrders.length === 0 ? (
                  <div className="py-12 text-center text-sm font-serif text-muted-foreground">No archival records correspond with selection.</div>
                ) : (
                  filteredOrders.map((order:Order) => {
                    // Calculate total item quantities cleanly from your child objects
                    const totalItemCount = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
                    
                    // Format your ISO database string into a readable UI localized layout
                    const formattedDate = new Date(order.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    });

                    return (
                      <Card key={order.id} className="border-border rounded-none shadow-none">
                        <CardHeader>
                          <div className="flex flex-col sm:flex-row justify-between gap-4">
                            <div>
                              {/* Render the public Order string identifier (e.g., ORD-12345) */}
                              <CardTitle className="font-serif text-base mb-1 text-foreground">{order.orderId}</CardTitle>
                              <CardDescription className="text-xs font-light">Transaction timeline: {formattedDate}</CardDescription>
                            </div>
                            <Badge variant="outline" className={`self-start sm:self-auto text-[10px] uppercase font-medium rounded-none py-0.5 ${getStatusColor(order.status)}`}>
                              {getStatusIcon(order.status)}
                              <span className="ml-1">{order.status}</span>
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-20 h-20 bg-muted overflow-hidden flex-shrink-0 flex items-center justify-center border border-dashed">
                              {/* Fallback box UI representation (or hook to first item image if passed) */}
                              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">📦 Manifest</span>
                            </div>
                            <div className="flex-1">
                              <p className="text-xs text-muted-foreground mb-1 font-light">
                                {totalItemCount} {totalItemCount === 1 ? "item" : "items"} packed
                              </p>
                              <p className="text-[#D4AF37] font-serif text-xl">${order.total.toLocaleString()}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </TabsContent>


              {/* Wishlist Presentation layout */}
              <TabsContent value="wishlist" className="space-y-6 outline-none">
                <div>
                  <h2 className="font-serif text-xl text-foreground mb-1">Archived Collections</h2>
                  <p className="text-xs text-muted-foreground font-light">{wishlistItems.length} items verified inside storage indexes</p>
                </div>

                {wishlistLoading ? (
                  <div className="py-12 text-center text-sm font-serif text-muted-foreground">Compiling saved entries...</div>
                ) : wishlistItems.length === 0 ? (
                  <Card className="text-center py-16 border-border rounded-none shadow-none">
                    <CardContent>
                      <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground/40" />
                      <h3 className="font-serif text-base text-foreground mb-1">Saved collection notebook empty</h3>
                      <Button asChild className="mt-4 bg-[#D4AF37] text-black hover:bg-[#C5A028] rounded-none text-xs font-semibold uppercase tracking-wider">
                        <Link href="/products">Explore Showcase</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistItems.map((item: any) => (
                      <Card key={item.id} className="group overflow-hidden border-border rounded-none shadow-none bg-background">
                        <Link href={`/products/${item.productId}`}>
                          <div className="relative aspect-[3/4] bg-muted overflow-hidden">
                            <ImageWithFallback src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                          </div>
                        </Link>
                        <CardContent className="p-4">
                          <h3 className="font-serif text-base mb-1 text-foreground truncate">{item.name}</h3>
                          <p className="text-[#D4AF37] font-medium text-sm mb-4">${item.price.toLocaleString()}</p>
                          <Button className="w-full bg-[#D4AF37] text-black hover:bg-[#C5A028] rounded-none text-xs font-semibold uppercase tracking-wider" disabled={!item.inStock}>
                            {item.inStock ? "Move to Bag" : "Out of Stock"}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Destinations Address Management Component */}
              <TabsContent value="addresses" className="space-y-6 outline-none">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="font-serif text-xl text-foreground mb-1">Destinations Matrix</h2>
                    <p className="text-xs text-muted-foreground font-light">Manage physical endpoints for structural global delivery</p>
                  </div>
                  <Dialog open={isAddAddressOpen} onOpenChange={setIsAddAddressOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-[#D4AF37] text-black hover:bg-[#C5A028] rounded-none text-xs uppercase font-semibold tracking-wider h-10">
                        <Plus className="h-4 w-4 mr-2" /> Add Node
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-none border-border">
                      <form onSubmit={handleCreateAddress}>
                        <DialogHeader>
                          <DialogTitle className="font-serif text-lg">Add Shipping Destination</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-xs uppercase font-medium mb-1 block">First Name</Label>
                              <Input required value={newAddress.firstName} onChange={e => setNewAddress(p => ({ ...p, firstName: e.target.value }))} className="rounded-none" />
                            </div>
                            <div>
                              <Label className="text-xs uppercase font-medium mb-1 block">Last Name</Label>
                              <Input required value={newAddress.lastName} onChange={e => setNewAddress(p => ({ ...p, lastName: e.target.value }))} className="rounded-none" />
                            </div>
                          </div>
                          <div>
                            <Label className="text-xs uppercase font-medium mb-1 block">Street address</Label>
                            <Input required value={newAddress.address} onChange={e => setNewAddress(p => ({ ...p, address: e.target.value }))} className="rounded-none" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-xs uppercase font-medium mb-1 block">City Region</Label>
                              <Input required value={newAddress.city} onChange={e => setNewAddress(p => ({ ...p, city: e.target.value }))} className="rounded-none" />
                            </div>
                            <div>
                              <Label className="text-xs uppercase font-medium mb-1 block">ZIP</Label>
                              <Input required value={newAddress.zip} onChange={e => setNewAddress(p => ({ ...p, zip: e.target.value }))} className="rounded-none" />
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit" disabled={addAddressMutation.isPending} className="bg-[#D4AF37] text-black w-full rounded-none uppercase text-xs tracking-wider">
                            {addAddressMutation.isPending ? "Saving..." : "Save Terminal Entry"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

                {addressesLoading ? (
                  <div className="py-12 text-center text-xs text-muted-foreground">Loading destinations database...</div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {addresses.map((address: any) => (
                      <Card key={address.id} className="border-border rounded-none shadow-none relative bg-background">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 font-serif text-base text-foreground">
                            <MapPin className="h-4 w-4 text-[#D4AF37]" /> {address.type || "Fulfillment Point"}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm font-medium mb-1 text-foreground">{user.firstName} {user.lastName}</p>
                          <p className="text-xs text-muted-foreground font-light mb-0.5">{address.address}</p>
                          <p className="text-xs text-muted-foreground font-light mb-4">{address.city}, {address.state} {address.zip}</p>
                          <Separator className="my-4" />
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => deleteAddressMutation.mutate(address.id)} className="flex-1 rounded-none border-border text-xs uppercase text-red-600 hover:text-red-700">
                              <Trash2 className="h-3.5 w-3.5 mr-2" /> Remove
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Secure Tokenized Payment Configuration View */}
              <TabsContent value="payment" className="space-y-6 outline-none">
                <div>
                  <h2 className="font-serif text-xl text-foreground mb-1">Settlement Instruments</h2>
                  <p className="text-xs text-muted-foreground font-light">Tokenized vaulting methods mapped to explicit profiles</p>
                </div>

                <Alert className="border-blue-500/20 bg-blue-500/5 rounded-none p-4">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-600 text-xs font-light ml-2">
                    All financial instruments undergo cryptographic isolation layers before execution. Local states discard sensitive metadata natively.
                  </AlertDescription>
                </Alert>

                {paymentsLoading ? (
                  <div className="py-12 text-center text-xs text-muted-foreground">Decrypting terminal records...</div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {paymentMethodsList.map((method: any) => (
                      <Card key={method.id} className="border-border rounded-none shadow-none relative bg-background">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 font-serif text-base text-foreground">
                            <CreditCard className="h-4 w-4 text-[#D4AF37]" /> {method.type || "Card"} •••• {method.last4 || "0000"}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-xs text-muted-foreground font-light mb-4">Expiration: {method.expiry || "MM/YY"}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Preferences Settings components remains clean client interaction */}
              <TabsContent value="settings" className="space-y-6 outline-none">
                <Card className="border-border rounded-none shadow-none bg-background">
                  <CardHeader>
                    <CardTitle className="font-serif text-base text-foreground">Notification Protocols</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-xs font-medium text-foreground">Email Channels</Label>
                        <p className="text-xs text-muted-foreground font-light">Route logistics updates and checkout invoices</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </div>
    </div>
    </RequireAuth>
  );
}