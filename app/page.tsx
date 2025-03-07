import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RssIcon, ListIcon, Settings2Icon } from "lucide-react"
import { Header } from "@/components/header"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <RssIcon className="h-12 w-12 text-primary" />
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Daily Feed Digest</h1>
            {/* <p className="max-w-[700px] text-lg text-muted-foreground">
              Get AI-powered summaries of your favorite websites, all in one place.
            </p> */}
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-8">
              {/* Step 1 */}
              <Card className="relative overflow-hidden">
                <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-lg font-semibold text-primary">1</span>
                </div>
                <CardHeader className="pl-16">
                  <CardTitle>Add Your RSS Feeds</CardTitle>
                  <CardDescription>Start by adding RSS feeds from your favorite websites</CardDescription>
                </CardHeader>
                <CardContent className="pl-16">
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Choose from our curated list of popular feeds or add your own custom RSS URLs.
                      We support tech blogs, news sites, and more!
                    </p>
                    <Link href="/feeds" className="inline-block">
                      <Button size="lg">
                        <RssIcon className="h-4 w-4 mr-2" />
                        Add RSS Feeds
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Step 2 */}
              <Card className="relative overflow-hidden border-dashed">
                <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-lg font-semibold text-primary">2</span>
                </div>
                <CardHeader className="pl-16">
                  <CardTitle>Get AI Summaries</CardTitle>
                  <CardDescription>We'll summarize your feeds using AI</CardDescription>
                </CardHeader>
                <CardContent className="pl-16">
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Our AI reads and summarizes articles from your feeds, highlighting key points
                      and important stories. Save time while staying informed!
                    </p>
                    <Link href="/summaries" className="inline-block">
                      <Button size="lg" variant="outline">
                        <ListIcon className="h-4 w-4 mr-2" />
                        View Summaries
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Optional Step */}
              <Card className="relative overflow-hidden opacity-75 hover:opacity-100 transition-opacity">
                <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-lg font-semibold text-muted-foreground">+</span>
                </div>
                <CardHeader className="pl-16">
                  <CardTitle>Customize Your Experience</CardTitle>
                  <CardDescription>Optional: Configure your preferences</CardDescription>
                </CardHeader>
                <CardContent className="pl-16">
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Adjust summary settings, manage notifications, and customize your reading experience.
                    </p>
                    <Link href="/settings" className="inline-block">
                      <Button size="lg" variant="ghost">
                        <Settings2Icon className="h-4 w-4 mr-2" />
                        Settings
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Start Note */}
            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                New to RSS? Start with our suggested feeds in step 1 - we've curated the best sources for you!
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

