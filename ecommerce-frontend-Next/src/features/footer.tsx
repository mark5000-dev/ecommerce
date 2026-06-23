import React from "react";
import Link from "next/link";
//import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

const footerLinks = {
  shop: [
    { name: "New Arrivals", href: "/shop/new-arrivals" },
    { name: "Women", href: "/shop/women" },
    { name: "Men", href: "/shop/men" },
    { name: "Accessories", href: "/shop/accessories" },
    { name: "Sale", href: "/shop/sale" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Sustainability", href: "/sustainability" },
    { name: "Press", href: "/press" },
    { name: "Contact", href: "/contact" },
  ],
  support: [
    { name: "Customer Service", href: "/support" },
    { name: "Shipping & Returns", href: "/support/shipping-returns" },
    { name: "Size Guide", href: "/support/size-guide" },
    { name: "Care Instructions", href: "/support/care" },
    { name: "FAQ", href: "/support/faq" },
  ],
};

export const Footer: React.FC = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <h2 className="font-serif text-[2rem] mb-4">
              <span className="text-foreground">LUX</span>
              <span className="text-[#D4AF37]">É</span>
            </h2>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Redefining luxury fashion with timeless elegance and exceptional craftsmanship. 
              Every piece tells a story of sophistication.
            </p>
            
            {/* Social Media Links using Next.js Link component */}
            <div className="flex gap-2">
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex items-center justify-center h-10 w-10 rounded-md border border-border bg-transparent text-foreground transition-colors hover:border-[#D4AF37] hover:text-[#D4AF37] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="h-5 w-5" />
              </Link>
              <Link
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex items-center justify-center h-10 w-10 rounded-md border border-border bg-transparent text-foreground transition-colors hover:border-[#D4AF37] hover:text-[#D4AF37] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="h-5 w-5" />
              </Link>
              <Link
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="flex items-center justify-center h-10 w-10 rounded-md border border-border bg-transparent text-foreground transition-colors hover:border-[#D4AF37] hover:text-[#D4AF37] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="h-5 w-5" />
              </Link>
              <Link
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="flex items-center justify-center h-10 w-10 rounded-md border border-border bg-transparent text-foreground transition-colors hover:border-[#D4AF37] hover:text-[#D4AF37] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h3 className="mb-4 font-medium text-foreground">Shop</h3>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-[#D4AF37] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-medium text-foreground">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-[#D4AF37] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-medium text-foreground">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-[#D4AF37] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar Separator */}
        <hr className="my-8 border-t border-border shrink-0" />
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} LUXÉ. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="/privacy" className="text-muted-foreground hover:text-[#D4AF37] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-muted-foreground hover:text-[#D4AF37] transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookies" className="text-muted-foreground hover:text-[#D4AF37] transition-colors">
              Cookie Settings
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};