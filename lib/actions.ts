"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"
import Parser from "rss-parser"
import { useFeedStore } from "@/lib/store"

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Type for our RSS feed
export type Feed = {
  id: string
  name: string
  url: string
}

// Type for our summary
export type Summary = {
  id: string
  feedName: string
  date: Date
  summary: string
  articles: number
}

// In a real app, these would interact with a database
export async function addFeed({ url, name }: { url: string; name?: string }) {
  try {
    // Validate the RSS feed
    const parser = new Parser()
    const feed = await parser.parseURL(url)

    // In a real app, save to database
    return {
      id: Date.now().toString(),
      name: name || feed.title || new URL(url).hostname,
      url,
    }
  } catch (error) {
    console.error("Error adding feed:", error)
    throw new Error("Failed to add feed. Please check the URL and try again.")
  }
}

export async function removeFeed(id: string) {
  try {
    // In a real app, remove from database
    return { success: true }
  } catch (error) {
    console.error("Error removing feed:", error)
    throw new Error("Failed to remove feed.")
  }
}

export async function fetchAndSummarizeFeed(feeds: Feed[]) {
  try {
    if (!feeds || feeds.length === 0) {
      return []
    }

    // Fetch all RSS feeds
    console.log("Fetching RSS feeds...")
    const parser = new Parser()
    
    // First, fetch all feeds and collect their articles
    const feedsData = await Promise.all(
      feeds.map(async (feed) => {
        try {
          const feedData = await parser.parseURL(feed.url)
          console.log(`RSS feed fetched successfully from ${feed.url}`)

          // Extract the content
          const articles = feedData.items.map((item) => ({
            title: item.title,
            content: item.contentSnippet || item.content,
            link: item.link,
            pubDate: item.pubDate,
            feedTitle: feedData.title || feed.name
          }))

          return {
            feed,
            feedData,
            articles
          }
        } catch (error) {
          console.error(`Error fetching feed ${feed.url}:`, error)
          return null
        }
      })
    )

    // Filter out failed fetches
    const validFeeds = feedsData.filter((data): data is NonNullable<typeof data> => data !== null)

    if (validFeeds.length === 0) {
      return []
    }

    // Create a single prompt for all feeds
    const prompt = `
      Summarize the following news feeds. For each feed, provide a summary in markdown format.
      When mentioning specific articles or stories, include their links in markdown format for reference.

      ${validFeeds.map(({ feed, feedData, articles }) => `
        === Feed: ${feedData.title || feed.name} ===
        
        Articles:
        ${articles
          .map(
            (article) => `
          Title: ${article.title}
          Content: ${article.content}
          Link: ${article.link}
          Published: ${article.pubDate}
        `,
          )
          .join("\n\n")}
      `).join("\n\n---\n\n")}

      For each feed, format your response in markdown with the following structure:
      # [Feed Name]
      ## Key Highlights
      - List 3-4 main points
      - When mentioning specific articles, include their links like this: [Article Title](article_url)
      
      ## Notable Stories
      - List 2-3 most important stories with brief descriptions
      - Include article links in the descriptions when relevant
      
      ## Trends & Analysis
      - Provide 1-2 insights about emerging trends or patterns
      - Reference specific articles with links when supporting your analysis

      Make sure to:
      1. Use proper markdown link syntax: [Title](URL)
      2. Include links when referencing specific articles or stories
      3. Keep the links relevant and contextual
      4. Separate each feed's summary with "---".
    `

    try {
      console.log("Generating summaries for all feeds...");
      const result = await model.generateContent(prompt);
      const fullSummary = result.response.text();
      console.log("fullSummary", fullSummary);
      console.log("Summaries generated successfully");

      // Split the response into individual feed summaries
      const summaries = fullSummary.split("---").filter(Boolean).map((summary, index) => {
        const feedData = validFeeds[index];
        if (!feedData) return null;

        return {
          id: Date.now().toString() + index,
          feedName: feedData.feedData.title || feedData.feed.name,
          date: new Date(),
          summary: summary.trim(),
          articles: feedData.articles.length,
        };
      });

      return summaries.filter((summary): summary is Summary => summary !== null);
    } catch (error) {
      console.error("Error generating summaries:", error);
      return [];
    }
  } catch (error) {
    console.error("Error summarizing feeds:", error)
    throw new Error(`Failed to summarize feeds: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
