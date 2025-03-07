import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Feed = {
  id: string
  name: string
  url: string
}

interface FeedStore {
  feeds: Feed[]
  addFeed: (feed: Omit<Feed, 'id'>) => void
  removeFeed: (id: string) => void
}

export const useFeedStore = create<FeedStore>()(
  persist(
    (set) => ({
      feeds: [
        { id: "1", name: "TechCrunch", url: "https://techcrunch.com/feed/" },
        { id: "2", name: "BBC News", url: "http://feeds.bbci.co.uk/news/rss.xml" },
        { id: "3", name: "Hacker News", url: "https://news.ycombinator.com/rss" },
      ],
      addFeed: (feed) =>
        set((state) => ({
          feeds: [...state.feeds, { ...feed, id: Date.now().toString() }],
        })),
      removeFeed: (id) =>
        set((state) => ({
          feeds: state.feeds.filter((feed) => feed.id !== id),
        })),
    }),
    {
      name: 'feed-storage', // unique name for localStorage
    }
  )
) 