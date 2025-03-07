"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ExternalLink, Trash2, Plus } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Header } from "@/components/header"
import { useFeedStore } from "@/lib/store"
import { feedSuggestions } from "@/lib/suggestions"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FeedsPage() {
  const { feeds, addFeed, removeFeed } = useFeedStore()
  const [newFeedUrl, setNewFeedUrl] = useState("")
  const [newFeedName, setNewFeedName] = useState("")
  const [isLoading, setIsLoading] = useState("")
  const { toast } = useToast()

  const handleAddFeed = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFeedUrl) return

    setIsLoading("manual")
    try {
      // Add feed to store
      addFeed({
        name: newFeedName || new URL(newFeedUrl).hostname,
        url: newFeedUrl,
      })

      setNewFeedUrl("")
      setNewFeedName("")

      toast({
        title: "Feed added",
        description: `Successfully added ${newFeedName || new URL(newFeedUrl).hostname}`,
      })
    } catch (error) {
      toast({
        title: "Error adding feed",
        description: "Please check the URL and try again",
        variant: "destructive",
      })
    } finally {
      setIsLoading("")
    }
  }

  const handleAddSuggestedFeed = async (name: string, url: string) => {
    if (feeds.some(feed => feed.url === url)) {
      toast({
        title: "Feed already exists",
        description: "This feed is already in your collection",
        variant: "default",
      })
      return
    }

    setIsLoading(url)
    try {
      addFeed({ name, url })
      toast({
        title: "Feed added",
        description: `Successfully added ${name}`,
      })
    } catch (error) {
      toast({
        title: "Error adding feed",
        description: "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsLoading("")
    }
  }

  const handleRemoveFeed = async (id: string) => {
    try {
      // Remove feed from store
      removeFeed(id)

      toast({
        title: "Feed removed",
        description: "The feed has been removed from your collection",
      })
    } catch (error) {
      toast({
        title: "Error removing feed",
        description: "Please try again",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-8">Manage RSS Feeds</h1>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Add New Feed</CardTitle>
              <CardDescription>Enter the RSS feed URL you want to subscribe to</CardDescription>
            </CardHeader>
            <form onSubmit={handleAddFeed}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="feed-url">Feed URL</Label>
                  <Input
                    id="feed-url"
                    placeholder="https://example.com/feed.xml"
                    value={newFeedUrl}
                    onChange={(e) => setNewFeedUrl(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="feed-name">Feed Name (Optional)</Label>
                  <Input
                    id="feed-name"
                    placeholder="My Favorite Blog"
                    value={newFeedName}
                    onChange={(e) => setNewFeedName(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading === "manual"}>
                  {isLoading === "manual" ? "Adding..." : "Add Feed"}
                </Button>
              </CardFooter>
            </form>
          </Card>

          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold mb-4">Your Feeds</h2>
              {feeds.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    You haven't added any feeds yet. Add your first feed above or choose from our suggestions.
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {feeds.map((feed) => (
                    <Card key={feed.id}>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>{feed.name}</span>
                          <a
                            href={feed.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary"
                          >
                            <ExternalLink className="h-4 w-4" />
                            <span className="sr-only">Open feed</span>
                          </a>
                        </CardTitle>
                        <CardDescription className="truncate">{feed.url}</CardDescription>
                      </CardHeader>
                      <CardFooter>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveFeed(feed.id)}
                          className="ml-auto"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Suggested Feeds</h2>
              <Accordion type="single" collapsible className="w-full">
                {feedSuggestions.map((category, index) => (
                  <AccordionItem key={category.name} value={`category-${index}`}>
                    <AccordionTrigger className="text-lg font-semibold">
                      {category.name}
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground mb-4">{category.description}</p>
                      <div className="grid gap-2">
                        {category.feeds.map((feed) => (
                          <Card key={feed.url}>
                            <CardHeader className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <CardTitle className="text-base">{feed.name}</CardTitle>
                                  <CardDescription className="truncate text-xs">
                                    {feed.url}
                                  </CardDescription>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleAddSuggestedFeed(feed.name, feed.url)}
                                    disabled={isLoading === feed.url || feeds.some(f => f.url === feed.url)}
                                  >
                                    <Plus className="h-4 w-4" />
                                    <span className="sr-only">Add feed</span>
                                  </Button>
                                  <a
                                    href={feed.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-muted-foreground hover:text-primary"
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                    <span className="sr-only">Open feed</span>
                                  </a>
                                </div>
                              </div>
                            </CardHeader>
                          </Card>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

