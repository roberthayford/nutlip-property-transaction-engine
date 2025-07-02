"use client"

import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { RealTimeProvider } from "@/contexts/real-time-context"
import { Toaster } from "@/components/ui/toaster"

/**
 * Wraps all pages in:
 * 1. Real-time context (WebSocket / BroadcastChannel)
 * 2. Forced-light ThemeProvider
 * 3. shadcn/ui Toaster for global notifications
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <RealTimeProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        disableTransitionOnChange
        forcedTheme="light"
      >
        {children}
      </ThemeProvider>
      <Toaster />
    </RealTimeProvider>
  )
}
