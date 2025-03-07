"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ExternalLink, Trash2, Plus, ListIcon, ChevronDown, RefreshCw } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Header } from "@/components/header"
import { useFeedStore } from "@/lib/store"
import { feedSuggestions } from "@/lib/suggestions"
import Link from "next/link"
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
                <Button 
                  type="submit" 
                  disabled={isLoading === "manual"}
                  className="w-full sm:w-auto h-12 text-base"
                  size="lg"
                >
                  {isLoading === "manual" ? (
                    <div className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Adding...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Plus className="h-5 w-5" />
                      Add Feed
                    </div>
                  )}
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
              <Accordion type="multiple" className="space-y-4">
                {feedSuggestions.map((category, index) => (
                  <AccordionItem key={category.name} value={category.name} className="border rounded-lg px-6">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex flex-col items-start gap-1">
                        <h3 className="text-lg font-semibold">{category.name}</h3>
                        <p className="text-sm text-muted-foreground font-normal">
                          {category.description}
                        </p>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="overflow-x-auto pb-4 pt-2">
                        <div className="flex gap-4" style={{ minWidth: 'min-content' }}>
                          {category.feeds.map((feed) => (
                            <Card key={feed.url} className="group hover:border-primary/50 transition-colors w-[300px] shrink-0">
                              <CardHeader className="p-4">
                                <div className="space-y-4">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleAddSuggestedFeed(feed.name, feed.url)}
                                    disabled={isLoading === feed.url || feeds.some(f => f.url === feed.url)}
                                    className="w-full mb-4"
                                  >
                                    {feeds.some(f => f.url === feed.url) ? (
                                      <span className="text-xs text-muted-foreground">Added</span>
                                    ) : (
                                      <>
                                        <Plus className="h-4 w-4 mr-1" />
                                        <span className="text-xs">Add Feed</span>
                                      </>
                                    )}
                                  </Button>
                                  <div className="min-w-0">
                                    <CardTitle className="text-base mb-1 flex items-center gap-2">
                                      {feed.name}
                                      <a
                                        href={feed.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-muted-foreground hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                                      >
                                        <ExternalLink className="h-4 w-4" />
                                      </a>
                                    </CardTitle>
                                    <CardDescription className="truncate text-xs">
                                      {feed.url}
                                    </CardDescription>
                                  </div>
                                </div>
                              </CardHeader>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>

          {/* Add padding at the bottom to account for the sticky button */}
          <div className="h-32"></div>

          {/* Sticky Continue Button */}
          {feeds.length > 0 && (
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-sm border-t z-10">
              <div className="container mx-auto flex justify-center">
                <Link href="/summaries">
                  <Button size="lg" className="gap-2 px-8 py-6 text-lg shadow-lg">
                    <ListIcon className="h-5 w-5" />
                    Continue to Summaries
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

