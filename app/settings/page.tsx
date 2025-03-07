"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Header } from "@/components/header"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    emailDigest: true,
    emailAddress: "user@example.com",
    digestTime: "morning",
    summaryLength: "medium",
    includeImages: false,
    categorizeArticles: true,
  })
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    // In a real app, this would save settings to the server
    setTimeout(() => {
      setIsSaving(false)
      toast({
        title: "Settings saved",
        description: "Your preferences have been updated",
      })
    }, 1000)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-8">Settings</h1>

          <form onSubmit={handleSaveSettings}>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Daily Digest Settings</CardTitle>
                <CardDescription>Configure how you want to receive your daily feed summaries</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-digest">Email Digest</Label>
                    <p className="text-sm text-muted-foreground">Receive a daily email with your feed summaries</p>
                  </div>
                  <Switch
                    id="email-digest"
                    checked={settings.emailDigest}
                    onCheckedChange={(checked) => setSettings({ ...settings, emailDigest: checked })}
                  />
                </div>

                {settings.emailDigest && (
                  <div className="space-y-2">
                    <Label htmlFor="email-address">Email Address</Label>
                    <Input
                      id="email-address"
                      type="email"
                      value={settings.emailAddress}
                      onChange={(e) => setSettings({ ...settings, emailAddress: e.target.value })}
                      required
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="digest-time">Digest Time</Label>
                  <Select
                    value={settings.digestTime}
                    onValueChange={(value) => setSettings({ ...settings, digestTime: value })}
                  >
                    <SelectTrigger id="digest-time">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Morning (8:00 AM)</SelectItem>
                      <SelectItem value="afternoon">Afternoon (1:00 PM)</SelectItem>
                      <SelectItem value="evening">Evening (6:00 PM)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="summary-length">Summary Length</Label>
                  <Select
                    value={settings.summaryLength}
                    onValueChange={(value) => setSettings({ ...settings, summaryLength: value })}
                  >
                    <SelectTrigger id="summary-length">
                      <SelectValue placeholder="Select length" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Short (1-2 sentences per feed)</SelectItem>
                      <SelectItem value="medium">Medium (3-4 sentences per feed)</SelectItem>
                      <SelectItem value="long">Long (5+ sentences per feed)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="include-images">Include Images</Label>
                    <p className="text-sm text-muted-foreground">Include featured images in your summaries</p>
                  </div>
                  <Switch
                    id="include-images"
                    checked={settings.includeImages}
                    onCheckedChange={(checked) => setSettings({ ...settings, includeImages: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="categorize-articles">Categorize Articles</Label>
                    <p className="text-sm text-muted-foreground">Group articles by category in your summaries</p>
                  </div>
                  <Switch
                    id="categorize-articles"
                    checked={settings.categorizeArticles}
                    onCheckedChange={(checked) => setSettings({ ...settings, categorizeArticles: checked })}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Settings"}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>
      </main>
    </div>
  )
}

