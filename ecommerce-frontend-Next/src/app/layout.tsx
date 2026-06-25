import { Poppins, Playfair_Display, Noto_Sans } from "next/font/google"
import "./globals.css" // Your global stylesheet

import { Header } from "../features/header";
import { Footer } from "../features/footer";
import { cn } from "@/lib/utils";
import { title } from "process";
import {type Metadata } from "next";


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

export const metadata: Metadata = {
  title : "Luxe Fashions",
  description : "Luxe Fashions is a premier online destination for fashion enthusiasts, offering a curated selection of high-quality clothing, accessories, and lifestyle products. Our mission is to provide our customers with the latest trends and timeless pieces that elevate their personal style.",
  icons :{ icon: "/ico.ico"},
}


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