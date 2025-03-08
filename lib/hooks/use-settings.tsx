"use client"

import { createContext, useContext, type ReactNode } from "react"
import type { Settings } from "@/lib/types"
import { useLocalStorage } from "@/lib/hooks/use-local-storage"

// Default settings
const DEFAULT_SETTINGS: Settings = {
  restTimerDuration: 60,
}

interface SettingsContextType {
  settings: Settings
  updateSettings: (settings: Settings) => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useLocalStorage<Settings>("settings", DEFAULT_SETTINGS)

  const updateSettings = (newSettings: Settings) => {
    setSettings(newSettings)
  }

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}

