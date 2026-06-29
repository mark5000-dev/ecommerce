"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
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

const orderHistory = [
  {
    id: "ORD-2024-1234",
    date: "Nov 2, 2024",
    status: "Delivered",
    total: 11898,
    items: 2,
    image: "https://images.unsplash.com/photo-1567777301743-3b7ef158aadf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBmYXNoaW9uJTIwbW9kZWx8ZW58MXx8fHwxNzYyMzIxNDI1fDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "ORD-2024-1189",
    date: "Oct 28, 2024",
    status: "In Transit",
    total: 599,
    items: 1,
    image: "https://images.unsplash.com/photo-1722842529941-825976fc14f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ25lciUyMHN1bmdsYXNzZXN8ZW58MXx8fHwxNzYyMzIxMDQ2fDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "ORD-2024-1156",
    date: "Oct 15, 2024",
    status: "Delivered",
    total: 449,
    items: 1,
    image: "https://images.unsplash.com/flagged/photo-1553802922-5f7e9934e328?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBiZWx0fGVufDF8fHx8MTc2MjM2MzcxMHww&ixlib=rb-4.1.0&q=80&w=1080",
  },
];

const savedAddresses = [
  {
    id: 1,
    type: "Home",
    name: "Alexandra Pierce",
    address: "123 Madison Avenue",
    city: "New York, NY 10016",
    phone: "+1 (555) 123-4567",
    isDefault: true,
  },
  {
    id: 2,
    type: "Office",
    name: "Alexandra Pierce",
    address: "456 Park Avenue, Suite 2000",
    city: "New York, NY 10022",
    phone: "+1 (555) 987-6543",
    isDefault: false,
  },
];

const paymentMethods = [
  {
    id: 1,
    type: "Visa",
    last4: "4242",
    expiry: "12/25",
    isDefault: true,
  },
  {
    id: 2,
    type: "Mastercard",
    last4: "8888",
    expiry: "09/26",
    isDefault: false,
  },
];

const initialWishlistMock = [
  {
    id: "w1",
    productId: "1",
    name: "Bespoke Cashmere Overcoat",
    price: 3450,
    image: "https://images.unsplash.com/photo-1567777301743-3b7ef158aadf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBmYXNoaW9uJTIwbW9kZWx8ZW58MXx8fHwxNzYyMzIxNDI1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    inStock: true,
  },
  {
    id: "w2",
    productId: "2",
    name: "Handcrafted Leather Loafers",
    price: 890,
    image: "https://images.unsplash.com/flagged/photo-1553802922-5f7e9934e328?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBiZWx0fGVufDF8fHx8MTc2MjM2MzcxMHww&ixlib=rb-4.1.0&q=80&w=1080",
    inStock: true,
  }
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [promotions, setPromotions] = useState(true);
  
  const [user, setUser] = useState<any>({
    firstName: "Alexandra",
    lastName: "Pierce",
    email: "alex@example.com",
    phone: "+1 (555) 123-4567",
    dateOfBirth: "1990-06-14",
    language: "English",
    memberSince: "2023-10-02",
    loyaltyTier: "Gold",
    loyaltyPoints: 50000,
  });
  const [addresses, setAddresses] = useState<any[]>(savedAddresses);
  const [paymentMethodsList, setPaymentMethodsList] = useState<any[]>(paymentMethods);
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [ordersList, setOrdersList] = useState<any[]>(orderHistory);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProfileData() {
      try {
        setIsLoading(true);
        // Load Profile
        const profileData = await api.getProfile();
        if (profileData && profileData.user) {
          setUser(profileData.user);
        }

        // Load Addresses
        const addressData = await api.getAddresses().catch(() => []);
        if (Array.isArray(addressData) && addressData.length > 0) {
          setAddresses(addressData);
        }

        // Load Payment Methods
        const paymentData = await api.getPaymentMethods().catch(() => []);
        if (Array.isArray(paymentData) && paymentData.length > 0) {
          setPaymentMethodsList(paymentData);
        }

        // Load Orders
        const ordersData = await api.getOrders().catch(() => ({ orders: [] }));
        const fetchedOrders = ordersData.orders || [];
        if (fetchedOrders.length > 0) {
          const formattedOrders = fetchedOrders.map((ord: any) => ({
            id: ord.orderId,
            date: new Date(ord.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
            status: ord.status,
            total: ord.total,
            items: 1,
            image: "https://images.unsplash.com/photo-1567777301743-3b7ef158aadf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
          }));
          setOrdersList(formattedOrders);
        }

        // Load Wishlist and resolve product details
        const productsData = await api.getProducts({ limit: 100 });
        const productsList = Array.isArray(productsData) ? productsData : productsData.products || [];

        const wishlistRes = await api.getWishlist();
        const wishlistRows = wishlistRes.items || [];

        const resolvedWishlist = wishlistRows.map((item: any) => {
          const product = productsList.find((p: any) => p.id === Number(item.productId));
          return {
            id: item.id,
            productId: item.productId,
            name: product?.name || "Bespoke Luxury Item",
            price: product?.price || 1000,
            image: product?.image || "https://images.unsplash.com/photo-1567777301743-3b7ef158aadf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
            inStock: product?.inStock !== false,
          };
        });
        setWishlistItems(resolvedWishlist);
      } catch (error) {
        console.error("Failed to load profile details from backend:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadProfileData();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Delivered":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "In Transit":
        return <Truck className="h-4 w-4 text-blue-600" />;
      case "Processing":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "In Transit":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "Processing":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      default:
        return "";
    }
  };

  return (
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
                  Member since {user.memberSince || "October 2023"} • Loyalty: {user.loyaltyTier || "Bronze"} Tier
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
                <TabsTrigger 
                  value="overview" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-[#D4AF37] rounded-none gap-2 text-xs uppercase tracking-widest font-medium py-3 px-4"
                >
                  <User className="h-3.5 w-3.5" />
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="orders" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-[#D4AF37] rounded-none gap-2 text-xs uppercase tracking-widest font-medium py-3 px-4"
                >
                  <Package className="h-3.5 w-3.5" />
                  Orders
                </TabsTrigger>
                <TabsTrigger 
                  value="wishlist" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-[#D4AF37] rounded-none gap-2 text-xs uppercase tracking-widest font-medium py-3 px-4"
                >
                  <Heart className="h-3.5 w-3.5" />
                  Wishlist
                </TabsTrigger>
                <TabsTrigger 
                  value="addresses" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-[#D4AF37] rounded-none gap-2 text-xs uppercase tracking-widest font-medium py-3 px-4"
                >
                  <MapPin className="h-3.5 w-3.5" />
                  Addresses
                </TabsTrigger>
                <TabsTrigger 
                  value="payment" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-[#D4AF37] rounded-none gap-2 text-xs uppercase tracking-widest font-medium py-3 px-4"
                >
                  <CreditCard className="h-3.5 w-3.5" />
                  Payment
                </TabsTrigger>
                <TabsTrigger 
                  value="settings" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-[#D4AF37] rounded-none gap-2 text-xs uppercase tracking-widest font-medium py-3 px-4"
                >
                  <Shield className="h-3.5 w-3.5" />
                  Settings
                </TabsTrigger>
              </TabsList>

              {/* Overview Subview Module */}
              <TabsContent value="overview" className="space-y-6 outline-none">
                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="border-border rounded-none shadow-none">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Total Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-serif mb-1 text-foreground">{ordersList.length}</div>
                      <p className="text-xs text-muted-foreground font-light">Processed orders ledger</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-border rounded-none shadow-none">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Total Spent</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-serif mb-1 text-foreground">$45,890</div>
                      <p className="text-xs text-muted-foreground font-light">Average: $1,912 per single request</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-border rounded-none shadow-none">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Wishlist Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-serif mb-1 text-foreground">{wishlistItems.length}</div>
                      <p className="text-xs text-muted-foreground font-light">2 items currently back in stock</p>
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
                    <div className="space-y-4">
                      {ordersList.slice(0, 3).map((order) => (
                        <div key={order.id} className="flex items-center gap-4 p-4 border border-border rounded-none">
                          <div className="w-16 h-16 bg-muted overflow-hidden flex-shrink-0">
                            <ImageWithFallback
                              src={order.image}
                              alt="Ledger profile reference item"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium text-xs text-foreground truncate">{order.id}</p>
                              <Badge variant="outline" className={`text-[10px] uppercase font-medium rounded-none py-0.5 ${getStatusColor(order.status)}`}>
                                {getStatusIcon(order.status)}
                                <span className="ml-1">{order.status}</span>
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground font-light">{order.date} • {order.items} items</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[#D4AF37] text-sm font-medium mb-1">${order.total.toLocaleString()}</p>
                            <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground hover:text-foreground font-medium">
                              <Eye className="h-3.5 w-3.5 mr-1" />
                              View
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Identity Profiles Overview Card */}
                <Card className="border-border rounded-none shadow-none">
                  <CardHeader>
                    <CardTitle className="font-serif text-lg text-foreground">Account Diagnostics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1 block font-medium">Email Address</Label>
                        <p className="text-sm text-foreground">{user.email}</p>
                      </div>
                      <div>
                        <Label className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1 block font-medium">Phone Network</Label>
                        <p className="text-sm text-foreground">{user.phone || "Not set"}</p>
                      </div>
                      <div>
                        <Label className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1 block font-medium">Date of Birth</Label>
                        <p className="text-sm text-foreground">{user.dateOfBirth || "Not set"}</p>
                      </div>
                      <div>
                        <Label className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1 block font-medium">Preferred Locales</Label>
                        <p className="text-sm text-foreground">{user.language || "English"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Complete Historical Orders Matrix Component */}
              <TabsContent value="orders" className="space-y-6 outline-none">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="font-serif text-xl text-foreground mb-1">Archived Invoices</h2>
                    <p className="text-xs text-muted-foreground font-light">Inspect and track tracking indices across global networks</p>
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px] rounded-none border-border text-xs uppercase tracking-wider font-medium">
                      <SelectValue placeholder="Filter listings" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Records</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="transit">In Transit</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {ordersList.map((order) => (
                  <Card key={order.id} className="border-border rounded-none shadow-none">
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div>
                          <CardTitle className="font-serif text-base mb-1 text-foreground">{order.id}</CardTitle>
                          <CardDescription className="text-xs font-light">Registered transaction timeline: {order.date}</CardDescription>
                        </div>
                        <Badge variant="outline" className={`self-start sm:self-auto text-[10px] uppercase font-medium rounded-none py-0.5 ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1">{order.status}</span>
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-20 h-20 bg-muted rounded type-node overflow-hidden flex-shrink-0">
                          <ImageWithFallback
                            src={order.image}
                            alt="Fulfillment line reference thumb item"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground mb-1 font-light">{order.items} {order.items === 1 ? "item" : "items"}</p>
                          <p className="text-[#D4AF37] font-serif text-xl">${order.total.toLocaleString()}</p>
                        </div>
                      </div>
                      <Separator className="my-4" />
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button variant="outline" className="flex-1 rounded-none text-xs uppercase font-medium tracking-wider border-border">
                          <Eye className="h-3.5 w-3.5 mr-2" />
                          View Details
                        </Button>
                        {order.status === "Delivered" && (
                          <Button variant="outline" className="flex-1 rounded-none text-xs uppercase font-medium tracking-wider border-border">
                            <Star className="h-3.5 w-3.5 mr-2" />
                            Write Critique
                          </Button>
                        )}
                        {order.status === "In Transit" && (
                          <Button variant="outline" className="flex-1 rounded-none text-xs uppercase font-medium tracking-wider border-border">
                            <Truck className="h-3.5 w-3.5 mr-2" />
                            Track Courier Route
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              {/* Wishlist Presentation Sub-Panel Layout */}
              <TabsContent value="wishlist" className="space-y-6 outline-none">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="font-serif text-xl text-foreground mb-1">Archived Collections</h2>
                    <p className="text-xs text-muted-foreground font-light">
                      {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"} saved inside temporary tracking indexes
                    </p>
                  </div>
                  <Button asChild className="bg-[#D4AF37] text-black hover:bg-[#C5A028] rounded-none text-xs uppercase font-semibold tracking-wider h-10 px-4">
                    <Link href="/wishlist">
                      <Heart className="h-3.5 w-3.5 mr-2" />
                      Open Full Notebook
                    </Link>
                  </Button>
                </div>

                {wishlistItems.length === 0 ? (
                  <Card className="text-center py-16 border-border rounded-none shadow-none">
                    <CardContent>
                      <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground/40" />
                      <h3 className="font-serif text-base text-foreground mb-1">Saved collections empty</h3>
                      <p className="text-xs text-muted-foreground max-w-xs mx-auto mb-6 font-light">Explore index lists and map items to index summaries.</p>
                      <Button asChild className="bg-[#D4AF37] text-black hover:bg-[#C5A028] rounded-none text-xs font-semibold uppercase tracking-wider">
                        <Link href="/products">Explore Showcase</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistItems.map((item) => (
                      <Card key={item.id} className="group overflow-hidden border-border rounded-none shadow-none bg-background">
                        <Link href={`/products/${item.productId}`}>
                          <div className="relative aspect-[3/4] bg-muted overflow-hidden">
                            <ImageWithFallback
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            {!item.inStock && (
                              <Badge className="absolute top-4 left-4 bg-red-600 hover:bg-red-700 rounded-none text-[10px] uppercase font-semibold tracking-wide">
                                Depleted
                              </Badge>
                            )}
                          </div>
                        </Link>
                        <CardContent className="p-4">
                          <Link href={`/products/${item.productId}`}>
                            <h3 className="font-serif text-base mb-1 text-foreground hover:text-[#D4AF37] transition-colors truncate">{item.name}</h3>
                          </Link>
                          <p className="text-[#D4AF37] font-medium text-sm mb-4">${item.price.toLocaleString()}</p>
                          <Button 
                            className="w-full bg-[#D4AF37] text-black hover:bg-[#C5A028] rounded-none text-xs font-semibold uppercase tracking-wider"
                            disabled={!item.inStock}
                          >
                            {item.inStock ? "Move to Bag" : "Out of Stock"}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Saved Shipping Addresses Management Component */}
              <TabsContent value="addresses" className="space-y-6 outline-none">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="font-serif text-xl text-foreground mb-1">Destinations Matrix</h2>
                    <p className="text-xs text-muted-foreground font-light">Manage physical drop points for global custom fulfillment</p>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-[#D4AF37] text-black hover:bg-[#C5A028] rounded-none text-xs uppercase font-semibold tracking-wider h-10">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Node
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-none border-border">
                      <DialogHeader>
                        <DialogTitle className="font-serif text-lg">Add Shipping Destination</DialogTitle>
                        <DialogDescription className="text-xs font-light">Define a secure structural terminal address endpoint profile.</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="firstName" className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1 block">First Name</Label>
                            <Input id="firstName" placeholder="John" className="rounded-none border-border" />
                          </div>
                          <div>
                            <Label htmlFor="lastName" className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1 block">Last Name</Label>
                            <Input id="lastName" placeholder="Doe" className="rounded-none border-border" />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="address" className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1 block">Street Target</Label>
                          <Input id="address" placeholder="123 Main Street" className="rounded-none border-border" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="city" className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1 block">City Region</Label>
                            <Input id="city" placeholder="New York" className="rounded-none border-border" />
                          </div>
                          <div>
                            <Label htmlFor="zip" className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1 block">ZIP Code</Label>
                            <Input id="zip" placeholder="10001" className="rounded-none border-border" />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="phone" className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1 block">Phone Vector</Label>
                          <Input id="phone" placeholder="+1 (555) 123-4567" className="rounded-none border-border" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" className="rounded-none text-xs uppercase tracking-wider">Cancel</Button>
                        <Button className="bg-[#D4AF37] text-black hover:bg-[#C5A028] rounded-none text-xs uppercase font-semibold tracking-wider">
                          Save Entry
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {addresses.map((address) => (
                    <Card key={address.id} className="border-border rounded-none shadow-none relative bg-background">
                      {address.isDefault && (
                        <Badge className="absolute top-4 right-4 bg-[#D4AF37] text-black hover:bg-[#C5A028] text-[9px] uppercase font-semibold tracking-wider rounded-none">
                          Primary
                        </Badge>
                      )}
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-serif text-base text-foreground">
                          <MapPin className="h-4 w-4 text-[#D4AF37]" />
                          {address.type}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm font-medium mb-1 text-foreground">{address.name}</p>
                        <p className="text-xs text-muted-foreground font-light mb-0.5">{address.address}</p>
                        <p className="text-xs text-muted-foreground font-light mb-0.5">{address.city}</p>
                        <p className="text-xs text-muted-foreground font-light mb-4">{address.phone}</p>
                        <Separator className="my-4" />
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1 rounded-none border-border text-xs uppercase tracking-wider">
                            <Edit className="h-3.5 w-3.5 mr-2" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1 rounded-none border-border text-xs uppercase tracking-wider text-red-600 hover:text-red-700">
                            <Trash2 className="h-3.5 w-3.5 mr-2" />
                            Remove
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Secure Tokenized Payment Configuration View */}
              <TabsContent value="payment" className="space-y-6 outline-none">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="font-serif text-xl text-foreground mb-1">Settlement Instruments</h2>
                    <p className="text-xs text-muted-foreground font-light">Tokenized vaulting methods mapped to explicit authorization metrics</p>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-[#D4AF37] text-black hover:bg-[#C5A028] rounded-none text-xs uppercase font-semibold tracking-wider h-10">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Vault Method
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-none border-border">
                      <DialogHeader>
                        <DialogTitle className="font-serif text-lg">Add Payment Option</DialogTitle>
                        <DialogDescription className="text-xs font-light">Bind an explicit tokenized framework container asset configuration.</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div>
                          <Label htmlFor="cardNumber" className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1 block">Card Number</Label>
                          <Input id="cardNumber" placeholder="1234 5678 9012 3456" className="rounded-none border-border" />
                        </div>
                        <div>
                          <Label htmlFor="cardName" className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1 block">Cardholder Label</Label>
                          <Input id="cardName" placeholder="Name on card" className="rounded-none border-border" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiry" className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1 block">Expiry</Label>
                            <Input id="expiry" placeholder="MM/YY" className="rounded-none border-border" />
                          </div>
                          <div>
                            <Label htmlFor="cvv" className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1 block">CVV</Label>
                            <Input id="cvv" placeholder="123" type="password" className="rounded-none border-border" />
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" className="rounded-none text-xs uppercase tracking-wider">Cancel</Button>
                        <Button className="bg-[#D4AF37] text-black hover:bg-[#C5A028] rounded-none text-xs uppercase font-semibold tracking-wider">
                          Inject Card
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                <Alert className="border-blue-500/20 bg-blue-500/5 rounded-none p-4">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-600 text-xs font-light ml-2">
                    All financial tokens undergo cryptographic isolation layers before processing. Local database states discard tracking matrices.
                  </AlertDescription>
                </Alert>

                <div className="grid md:grid-cols-2 gap-6">
                  {paymentMethodsList.map((method) => (
                    <Card key={method.id} className="border-border rounded-none shadow-none relative bg-background">
                      {method.isDefault && (
                        <Badge className="absolute top-4 right-4 bg-[#D4AF37] text-black hover:bg-[#C5A028] text-[9px] uppercase font-semibold tracking-wider rounded-none">
                          Primary
                        </Badge>
                      )}
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-serif text-base text-foreground">
                          <CreditCard className="h-4 w-4 text-[#D4AF37]" />
                          {method.type} •••• {method.last4}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-muted-foreground font-light mb-4">
                          Expiration reference parameter: {method.expiry}
                        </p>
                        <Separator className="my-4" />
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1 rounded-none border-border text-xs uppercase tracking-wider">
                            <Edit className="h-3.5 w-3.5 mr-2" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1 rounded-none border-border text-xs uppercase tracking-wider text-red-600 hover:text-red-700">
                            <Trash2 className="h-3.5 w-3.5 mr-2" />
                            Remove
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Notification & Localization Preferences Component Panel */}
              <TabsContent value="settings" className="space-y-6 outline-none">
                <Card className="border-border rounded-none shadow-none bg-background">
                  <CardHeader>
                    <CardTitle className="font-serif text-base text-foreground">Notification Protocols</CardTitle>
                    <CardDescription className="text-xs font-light">Set event listeners for push, transaction logging, and updates</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-xs font-medium text-foreground">Email Notifications</Label>
                        <p className="text-xs text-muted-foreground font-light">
                          Route fulfillment confirmations and order status trees
                        </p>
                      </div>
                      <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-xs font-medium text-foreground">SMS Notifications</Label>
                        <p className="text-xs text-muted-foreground font-light">
                          Get real-time mobile tracking indices from last-mile carriers
                        </p>
                      </div>
                      <Switch checked={smsNotifications} onCheckedChange={setSmsNotifications} />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-xs font-medium text-foreground">Marketing & Lookbooks</Label>
                        <p className="text-xs text-muted-foreground font-light">
                          Receive exclusive editorial updates and pre-order drops
                        </p>
                      </div>
                      <Switch checked={promotions} onCheckedChange={setPromotions} />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border rounded-none shadow-none bg-background">
                  <CardHeader>
                    <CardTitle className="font-serif text-base text-foreground">Privacy & Credential Isolation</CardTitle>
                    <CardDescription className="text-xs font-light">Configure cryptographic access signatures and validation layers</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center p-4 border border-border rounded-none">
                      <div>
                        <p className="text-xs font-medium text-foreground mb-0.5">Secure Password</p>
                        <p className="text-xs text-muted-foreground font-mono">••••••••</p>
                      </div>
                      <Button variant="outline" className="rounded-none text-xs uppercase tracking-wider h-8 px-3 border-border">Change</Button>
                    </div>
                    <div className="flex justify-between items-center p-4 border border-border rounded-none">
                      <div>
                        <p className="text-xs font-medium text-foreground mb-0.5">Two-Factor Authentication (2FA)</p>
                        <p className="text-xs text-muted-foreground font-light">Hardware token verification unconfigured</p>
                      </div>
                      <Button variant="outline" className="rounded-none text-xs uppercase tracking-wider h-8 px-3 border-border">Configure</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border rounded-none shadow-none bg-background">
                  <CardHeader>
                    <CardTitle className="font-serif text-base text-foreground">Display & Localization Defaults</CardTitle>
                    <CardDescription className="text-xs font-light">Adjust translation dictionaries and standard exchange parameters</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium mb-1 block">Active Dictionary</Label>
                      <Select defaultValue="en-us">
                        <SelectTrigger className="rounded-none border-border text-xs font-medium">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en-us">English (US)</SelectItem>
                          <SelectItem value="en-uk">English (UK)</SelectItem>
                          <SelectItem value="fr">Français</SelectItem>
                          <SelectItem value="de">Deutsch</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium mb-1 block">Base Value Counter</Label>
                      <Select defaultValue="usd">
                        <SelectTrigger className="rounded-none border-border text-xs font-medium">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="usd">USD ($)</SelectItem>
                          <SelectItem value="eur">EUR (€)</SelectItem>
                          <SelectItem value="gbp">GBP (£)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-red-500/20 border bg-red-500/[0.02] rounded-none shadow-none">
                  <CardHeader>
                    <CardTitle className="font-serif text-base text-red-600">Danger Zone</CardTitle>
                    <CardDescription className="text-xs text-red-500/80 font-light">Irreversible lifecycle hooks targeting account deletion</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="destructive" className="rounded-none text-xs uppercase tracking-wider font-semibold bg-red-600 hover:bg-red-700 h-10 px-4">
                      Purge Account Node
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </div>
    </div>
  );
}