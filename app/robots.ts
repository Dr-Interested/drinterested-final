import type { MetadataRoute } from "next"

// Server endpoints aren't pages: keep every crawler out of them. (Each named group below needs
// its own disallow, because a crawler that matches a named group ignores the "*" group.)
const API_PATHS = ["/api/"]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Wildcard fallback, placed first so it is unambiguous. /dashboard and /volunteer-agreement
      // are deliberately left crawlable here — they're kept out of search results via a noindex
      // meta tag instead (see their layout.tsx / page.tsx), since a robots.txt disallow would
      // stop crawlers from ever seeing that tag and can leave a bare, description-less URL
      // indexed if anything links to it.
      {
        userAgent: "*",
        allow: "/",
        disallow: API_PATHS,
      },
      // ChatGPT and OpenAI crawlers
      {
        userAgent: ["ChatGPT-User", "GPTBot", "GPT-Actions", "OAI-SearchBot"],
        allow: "/",
        disallow: API_PATHS,
      },
      // Major search engines
      {
        userAgent: [
          "Googlebot",
          "Bingbot",
          "DuckDuckBot",
          "Yandex",
          "Slurp", // Yahoo
          "Baiduspider",
          "SeznamBot", // Seznam.cz
          "naverbot", // Naver
          "PetalBot", // Huawei Petal Search
        ],
        allow: "/",
        disallow: API_PATHS,
      },
      // AI and assistant crawlers
      {
        userAgent: [
          "ClaudeBot",
          "Claude-SearchBot",
          "Claude-User",
          "PerplexityBot",
          "Perplexity-User",
          "DuckAssistBot",
          "ImagesiftBot",
          "meta-externalagent",
          "meta-externalfetcher",
        ],
        allow: "/",
        disallow: API_PATHS,
      },
      // Social media crawlers
      {
        userAgent: [
          "FacebookExternalHit",
          "LinkedInBot",
          "Pinterest Bot",
          "Discord Bot",
          "MicrosoftPreview",
          "OpenGraphXYZBot",
        ],
        allow: "/",
        disallow: API_PATHS,
      },
      // SEO and analytics tools
      {
        userAgent: [
          "AhrefsBot",
          "SemrushBot",
          "MJ12bot", // Majestic
          "DotBot", // Moz
          "DataForSeoBot",
          "ClarityBot", // seoClarity
          "ScreamingFrogBot",
          "Sitebulb",
          "ContentKingBot",
          "Lumar",
          "SeekportBot",
        ],
        allow: "/",
        disallow: API_PATHS,
      },
      // Monitoring and uptime services
      {
        userAgent: [
          "Pingdom Bot",
          "Site24x7",
          "OhDearBot",
          "HetrixTools Uptime Monitoring Bot",
          "DigitalOceanUptimeBot",
          "Sentry Uptime Monitoring Bot",
          "SISTRIX Optimizer Uptime",
          "Hydrozen",
          "QA.tech",
          "Checkly",
          "NewRelic Minions",
          "Datadog Synthetic Monitoring Robot",
          "Amazon Route 53 Health Check Service",
        ],
        allow: "/",
        disallow: API_PATHS,
      },
      // Feed readers and content services
      {
        userAgent: [
          "Feedfetcher", // Google News
          "Chrome Lighthouse",
          "Chrome Privacy Preserving Prefetch Proxy",
          "SemanticScholarBot",
          "Cotoyogi",
        ],
        allow: "/",
        disallow: API_PATHS,
      },
      // Ad and marketing crawlers
      {
        userAgent: [
          "IASBot", // Integral Ad Science
          "CriteoBot",
          "ProximicBot",
          "PulsePoint Crawler",
          "GeedoProductSearchBot",
          "adsnaver", // Naver ads
          "naver-blueno", // Naver preview
        ],
        allow: "/",
        disallow: API_PATHS,
      },
      // Security and compliance
      {
        userAgent: ["Detectify", "CookieScript", "Cookiebot", "SBIntuitionsBot"],
        allow: "/",
        disallow: API_PATHS,
      },
      // Webhook and API services
      {
        userAgent: [
          "PayPal",
          "Stripe",
          "GitHub Hookshot",
          "GitHub Camo",
          "Facebook Webhooks",
          "Customer.io webhooks",
          "Sanity Webhook",
          "Razorpay-Webhook",
          "Inngest",
          "QStash",
          "Hookdeck",
        ],
        allow: "/",
        disallow: API_PATHS,
      },
    ],
    sitemap: [
      "https://www.drinterested.org/sitemap.xml",
      "https://www.drinterested.org/rss.xml",
      "https://chess.drinterested.org/sitemap.xml",
    ],
  }
}
