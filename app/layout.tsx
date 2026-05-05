import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { ToastProvider } from "@/components/ui/toast"
import { SiteHeader } from "@/components/layout/site-header"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" })

export const metadata: Metadata = {
  title: "Scott Law",
  description: "Intranet RP du cabinet d’avocat Scott Law"
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        <ToastProvider>
          <SiteHeader />
          {children}
        </ToastProvider>
      </body>
    </html>
  )
}
