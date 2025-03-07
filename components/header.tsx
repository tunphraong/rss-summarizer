import Link from "next/link"
import { RssIcon } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export function Header() {
  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <RssIcon className="h-5 w-5 text-primary" />
          <span>Daily Feed Digest</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
            Home
          </Link>
          <Link href="/feeds" className="text-sm font-medium transition-colors hover:text-primary">
            Feeds
          </Link>
          <Link href="/summaries" className="text-sm font-medium transition-colors hover:text-primary">
            Summaries
          </Link>
          <Link href="/settings" className="text-sm font-medium transition-colors hover:text-primary">
            Settings
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

