"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, RefreshCw, ExternalLink } from "lucide-react"
import { format } from "date-fns"
import { Header } from "@/components/header"
import { fetchAndSummarizeFeed, type Summary } from "@/lib/actions"
import ReactMarkdown from 'react-markdown'
import { useFeedStore } from "@/lib/store"
import { toast } from "@/components/ui/use-toast"

// Mock data for summaries
const mockSummaries = {
  today: [
    {
      id: "1",
      feedName: "TechCrunch",
      date: new Date(),
      summary:
        "Apple announced their new M3 chip with significant performance improvements. Tesla reported better than expected Q3 earnings. Google launched a new AI model that can generate realistic images from text descriptions.",
      articles: 12,
    },
    {
      id: "2",
      feedName: "BBC News",
      date: new Date(),
      summary:
        "Peace talks continue in the Middle East with cautious optimism. A new climate agreement was signed by 30 countries. Scientists discovered a potential breakthrough in cancer treatment.",
      articles: 8,
    },
  ],
  yesterday: [
    {
      id: "3",
      feedName: "Hacker News",
      date: new Date(Date.now() - 86400000),
      summary:
        "A new programming language designed for AI development was released. GitHub announced improvements to Copilot. A security vulnerability was discovered in a popular npm package.",
      articles: 15,
    },
  ],
  thisWeek: [
    {
      id: "4",
      feedName: "TechCrunch",
      date: new Date(Date.now() - 172800000),
      summary:
        "Several tech startups announced significant funding rounds. A major acquisition in the fintech space was announced. New regulations for AI were proposed in the EU.",
      articles: 10,
    },
  ],
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2].map((i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader>
            <div className="h-6 w-1/3 bg-muted rounded"></div>
            <div className="h-4 w-1/4 bg-muted rounded mt-2"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="h-4 w-3/4 bg-muted rounded"></div>
              <div className="h-4 w-2/3 bg-muted rounded"></div>
              <div className="h-4 w-1/2 bg-muted rounded"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function SummaryList({ summaries }: { summaries: any[] }) {
  if (summaries.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No summaries available for this period.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-6">
      {summaries.map((summary) => (
        <Card key={summary.id}>
          <CardHeader>
            <CardTitle>{summary.feedName}</CardTitle>
            <CardDescription className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-2" />
              {format(summary.date, "PPP")}
              <span className="ml-4">{summary.articles} articles summarized</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown
              components={{
                a: ({ node, ...props }) => (
                  <a
                    {...props}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  >
                    <ExternalLink className="h-3 w-3" />
                    {props.children}
                  </a>
                ),
              }}
            >
              {summary.summary}
            </ReactMarkdown>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm">
              View Full Articles
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

export default function SummariesPage() {
  const [summaries, setSummaries] = useState<{
    today: Summary[];
    yesterday: Summary[];
    thisWeek: Summary[];
  }>({
    today: [],
    yesterday: [], 
    thisWeek: []
  })
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const refreshRef = useRef(false)

  useEffect(() => {
    // Only fetch if we haven't already
    if (!refreshRef.current && summaries.today.length === 0) {
      refreshRef.current = true
      handleRefresh()
    }
  }, [summaries.today.length]) // Only re-run if summaries.today.length changes

  const handleRefresh = async () => {
    if (isRefreshing) return // Prevent concurrent refreshes
    
    setIsRefreshing(true)
    try {
      const { feeds } = useFeedStore.getState()
      const newSummaries = await fetchAndSummarizeFeed(feeds)
      console.log("New summaries fetched:", newSummaries);
      
      // Update the summaries state with all new summaries
      setSummaries(prev => ({
        ...prev,
        today: [...newSummaries, ...prev.today]
      }))
    } catch (error) {
      console.error("Error refreshing summaries:", error)
      toast({
        title: "Error refreshing summaries",
        description: "Failed to fetch new summaries. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsRefreshing(false)
      setIsInitialLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Feed Summaries</h1>
            <Button onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </Button>
          </div>

          <Tabs defaultValue="today">
            <TabsList className="mb-4">
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="yesterday">Yesterday</TabsTrigger>
              <TabsTrigger value="thisWeek">This Week</TabsTrigger>
            </TabsList>

            {isInitialLoading ? (
              <div className="mt-4">
                <LoadingSkeleton />
              </div>
            ) : (
              <>
                <TabsContent value="today">
                  <SummaryList summaries={summaries.today} />
                </TabsContent>

                <TabsContent value="yesterday">
                  <SummaryList summaries={summaries.yesterday} />
                </TabsContent>

                <TabsContent value="thisWeek">
                  <SummaryList summaries={summaries.thisWeek} />
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>
      </main>
    </div>
  )
}

