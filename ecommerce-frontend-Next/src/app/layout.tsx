import { Poppins, Playfair_Display, Noto_Sans } from "next/font/google"
import "./globals.css" // Your global stylesheet

import { Header } from "../features/header";
import { Footer } from "../features/footer";
import { cn } from "@/lib/utils";

const playfairDisplayHeading = Playfair_Display({subsets:['latin'],variable:'--font-heading'});

const notoSans = Noto_Sans({subsets:['latin'],variable:'--font-sans'});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins", // Maps to a CSS variable
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (

    <html lang="en" className={cn(poppins.variable, playfair.variable, "font-sans", notoSans.variable, playfairDisplayHeading.variable)}>
      <body>
      <Header />
      {children}
      <Footer />
      </body>
    </html>
  )
}