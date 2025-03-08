"use client"

import { type ReactNode, useEffect } from "react"
import { WorkoutsProvider } from "@/lib/hooks/use-workouts"
import { ExercisesProvider } from "@/lib/hooks/use-exercises"
import { SettingsProvider } from "@/lib/hooks/use-settings"

export function AppProvider({ children }: { children: ReactNode }) {
  // Initialize PWA event listeners
  useEffect(() => {
    // Register service worker for PWA
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/service-worker.js").catch((error) => {
          console.log("Service worker registration failed:", error)
        })
      })
    }
  }, [])

  return (
    <SettingsProvider>
      <ExercisesProvider>
        <WorkoutsProvider>{children}</WorkoutsProvider>
      </ExercisesProvider>
    </SettingsProvider>
  )
}

