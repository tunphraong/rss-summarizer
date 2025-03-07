export type FeedSuggestion = {
  name: string
  url: string
}

export type FeedCategory = {
  name: string
  description: string
  feeds: FeedSuggestion[]
}

export const feedSuggestions: FeedCategory[] = [
  {
    name: "Tech & Programming",
    description: "Stay updated with the latest in technology and programming",
    feeds: [
      { name: "Hacker News", url: "https://hnrss.org/frontpage" },
      { name: "Ars Technica", url: "https://feeds.arstechnica.com/arstechnica/index" },
      { name: "CSS-Tricks", url: "https://css-tricks.com/feed/" },
      { name: "Smashing Magazine", url: "https://www.smashingmagazine.com/feed/" },
      { name: "Dev.to", url: "https://dev.to/feed" },
    ],
  },
  {
    name: "Finance & Trading",
    description: "Follow market trends and financial news",
    feeds: [
      { name: "Bloomberg Markets", url: "https://www.bloomberg.com/feeds/podcasts/marketwrap.xml" },
      { name: "Financial Times", url: "https://www.ft.com/rss/home/us" },
      { name: "TradingView Blog", url: "https://www.tradingview.com/blog/en/feed/" },
      { name: "Zero Hedge", url: "https://feeds.feedburner.com/zerohedge/feed" },
      { name: "DailyFX", url: "https://www.dailyfx.com/feeds" },
    ],
  },
  {
    name: "AI & Machine Learning",
    description: "Keep up with AI advancements and research",
    feeds: [
      { name: "OpenAI Blog", url: "https://openai.com/research/rss/" },
      { name: "Google AI Blog", url: "https://ai.googleblog.com/feeds/posts/default" },
      { name: "Towards Data Science", url: "https://towardsdatascience.com/feed" },
      { name: "Machine Learning Mastery", url: "https://machinelearningmastery.com/feed/" },
    ],
  },
  {
    name: "Science & Exploration",
    description: "Discover the latest in science and space exploration",
    feeds: [
      { name: "NASA Breaking News", url: "https://www.nasa.gov/rss/dyn/breaking_news.rss" },
      { name: "Nature Journal", url: "https://www.nature.com/feeds/news.rss" },
      { name: "Scientific American", url: "https://www.scientificamerican.com/feed/" },
      { name: "Live Science", url: "https://www.livescience.com/feeds/all" },
      { name: "Quanta Magazine", url: "https://www.quantamagazine.org/feed/" },
    ],
  },
  {
    name: "Philosophy & Culture",
    description: "Explore thought-provoking ideas and cultural insights",
    feeds: [
      { name: "Aeon", url: "https://aeon.co/feed.rss" },
      { name: "The Marginalian", url: "https://www.themarginalian.org/feed/" },
      { name: "The Atlantic - Ideas", url: "https://www.theatlantic.com/feed/all/" },
      { name: "Longreads", url: "https://longreads.com/feed/" },
      { name: "Wait But Why", url: "https://waitbutwhy.com/feed" },
    ],
  },
  {
    name: "Miscellaneous & Cool Feeds",
    description: "Interesting and diverse content from around the web",
    feeds: [
      { name: "Lifehacker", url: "https://lifehacker.com/rss" },
      { name: "Boing Boing", url: "https://boingboing.net/feed" },
      { name: "Reddit - Today I Learned", url: "https://www.reddit.com/r/todayilearned/.rss" },
      { name: "Kottke.org", url: "https://feeds.kottke.org/main" },
      { name: "Futurism", url: "https://futurism.com/feed" },
    ],
  },
]; 