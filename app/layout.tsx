import type React from "react"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"
import Analytics from "@/components/google-analytics"
import Script from "next/script"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: "Nutlip - Property Transaction Engine",
  description: "Streamline your property transactions with real-time collaboration",
  generator: 'v0.dev',
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico"
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="light" style={{ colorScheme: 'light' }}>
      <head>
        <Script 
          id="cookieyes" 
          src="https://cdn-cookieyes.com/client_data/5ff7591dc6b2ba95444ac9b0/script.js"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${poppins.variable} font-sans bg-white text-grey-900`}>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  )
}
