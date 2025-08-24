"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { getAppSettings, saveAppSettings } from "@/lib/storage"
import type { AppSettings } from "@/types/flashcard"

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings>(getAppSettings())
  const [saved, setSaved] = useState(false)

  const handleSettingChange = (key: keyof AppSettings, value: any) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    saveAppSettings(newSettings)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation title="Settings" showBackButton />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Study Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Study Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-show">Auto-show Explanations</Label>
                  <p className="text-sm text-muted-foreground">Automatically reveal explanations after answering</p>
                </div>
                <Switch
                  id="auto-show"
                  checked={settings.autoShowExplanations}
                  onCheckedChange={(checked) => handleSettingChange("autoShowExplanations", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Appearance Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">Switch between light and dark themes</p>
                </div>
                <Switch
                  id="dark-mode"
                  checked={settings.darkMode}
                  onCheckedChange={(checked) => handleSettingChange("darkMode", checked)}
                />
              </div>

              <div className="space-y-2">
                <Label>Language</Label>
                <div className="flex gap-2">
                  <Button
                    variant={settings.language === "EN" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleSettingChange("language", "EN")}
                  >
                    English
                  </Button>
                  <Button
                    variant={settings.language === "TR" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleSettingChange("language", "TR")}
                  >
                    Türkçe
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {saved && (
            <div className="text-center">
              <p className="text-sm text-green-600 dark:text-green-400">✓ Settings saved successfully</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
