"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/hooks/use-toast"
import { useSettings } from "@/lib/hooks/use-settings"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const { settings, updateSettings } = useSettings()
  const [mounted, setMounted] = useState(false)
  const [restTimerDuration, setRestTimerDuration] = useState(60)

  useEffect(() => {
    setMounted(true)
    if (settings) {
      setRestTimerDuration(settings.restTimerDuration)
    }
  }, [settings])

  // Avoid hydration mismatch
  if (!mounted) return null

  const handleSaveSettings = () => {
    updateSettings({
      ...settings,
      restTimerDuration,
    })

    toast({
      title: "Settings saved",
      description: "Your preferences have been updated",
    })
  }

  return (
    <div className="container max-w-md mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize how the app looks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="theme-toggle">Dark Mode</Label>
              <Switch
                id="theme-toggle"
                checked={theme === "dark"}
                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Workout Settings</CardTitle>
            <CardDescription>Customize your workout experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Rest Timer Duration</Label>
                <span className="text-sm">{restTimerDuration} seconds</span>
              </div>
              <Slider
                value={[restTimerDuration]}
                min={10}
                max={300}
                step={5}
                onValueChange={(value) => setRestTimerDuration(value[0])}
              />
            </div>

            <Button onClick={handleSaveSettings} className="w-full">
              Save Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

