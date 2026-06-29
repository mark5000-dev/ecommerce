"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, MessageSquare } from "lucide-react";

export const Newsletter = () => {
  // Newsletter States
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  // Contact Form States
  const [contactData, setContactData] = useState({ name: "", email: "", text: "" });
  const [contactStatus, setContactStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [contactFeedback, setContactFeedback] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error("Subscription failed");

      setStatus("success");
      setMessage("Welcome aboard! Check your inbox for your exclusive invite.");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactData.name || !contactData.text) return;
    setContactStatus("loading");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactData),
      });

      if (!response.ok) throw new Error("Message failed to send");

      setContactStatus("success");
      setContactFeedback("Your message has been sent to our team. Thank you!");
      setContactData({ name: "", email: "", text: "" });
    } catch (error) {
      setContactStatus("error");
      setContactFeedback("Failed to send message. Please try again later.");
    }
  };

  return (
    <section className="py-20 bg-foreground text-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          
          {/* ======================================================= */}
          {/* PRIMARY: NEWSLETTER (High Contrast / High Visual Weight) */}
          {/* ======================================================= */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#D4AF37] rounded-full mb-6">
            <Mail className="h-8 w-8 text-black" />
          </div>
          
          <h2 className="font-serif text-[2.5rem] md:text-[3.5rem] mb-4">
            Join Our Exclusive Club
          </h2>
          
          <p className="text-background/80 text-lg mb-8 max-w-2xl mx-auto">
            Be the first to know about new collections, exclusive offers, and styling tips 
            from our fashion experts. Subscribe to our newsletter today.
          </p>

          {status === "success" ? (
            <div className="p-4 bg-background/10 border border-background/20 max-w-xl mx-auto rounded-md mb-4">
              <p className="text-[#D4AF37] font-medium">{message}</p>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <div className="flex-1 flex flex-col items-start gap-1">
                <Input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === "loading"}
                  className="bg-background text-foreground border-background/20 px-6 py-6 w-full text-base focus-visible:ring-[#D4AF37]"
                />
                {status === "error" && (
                  <p className="text-destructive-foreground text-xs mt-1 font-medium">{message}</p>
                )}
              </div>
              <Button
                type="submit"
                size="lg"
                disabled={status === "loading"}
                className="bg-[#D4AF37] text-black hover:bg-[#C5A028] px-8 py-6 h-auto font-medium transition-colors whitespace-nowrap"
              >
                {status === "loading" ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
          )}

          <p className="text-background/60 text-sm mt-4 mb-4">
            By subscribing, you agree to our Privacy Policy and consent to receive updates.

          </p>

          {/* ======================================================= */}
          {/* SECONDARY: CONTACT FORM (Low Contrast / Subdued Design) */}
          {/* ======================================================= */}
          <div className="mt-20 pt-12 border-t border-background/10 max-w-xl mx-auto text-left">
            <div className="flex items-center gap-2 mb-4 justify-center sm:justify-start">
              <MessageSquare className="h-4 w-4 text-[#D4AF37]" />
              <h3 className="font-serif text-xl text-background/90">Have a Question? Get in Touch</h3>
            </div>

            {contactStatus === "success" ? (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-md text-center">
                <p className="text-green-400 text-sm font-medium">{contactFeedback}</p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={contactData.name}
                    onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
                    disabled={contactStatus === "loading"}
                    className="bg-background/10 text-background border-background/20 placeholder:text-background/40 focus-visible:ring-[#D4AF37]"
                  />
                  <Input
                    type="email"
                    required
                    placeholder="Your Email (for replies)"
                    value={contactData.email}
                    onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                    disabled={contactStatus === "loading"}
                    className="bg-background/10 text-background border-background/20 placeholder:text-background/40 focus-visible:ring-[#D4AF37]"
                  />
                </div>

                <textarea
                  required
                  rows={3}
                  placeholder="How can our concierge assist you?"
                  value={contactData.text}
                  onChange={(e) => setContactData({ ...contactData, text: e.target.value })}
                  disabled={contactStatus === "loading"}
                  className="w-full rounded-md bg-background/10 text-background border border-background/20 placeholder:text-background/40 px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                />

                <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                  {contactStatus === "error" && (
                    <p className="text-red-400 text-xs font-medium">{contactFeedback}</p>
                  )}
                  <Button
                    type="submit"
                    variant="outline"
                    disabled={contactStatus === "loading"}
                    className="w-full sm:w-auto ml-auto border-background/20 text-background hover:bg-background hover:text-foreground transition-colors text-xs py-2 px-4 h-9"
                  >
                    {contactStatus === "loading" ? "Sending..." : "Send Message"}
                  </Button>
                </div>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};