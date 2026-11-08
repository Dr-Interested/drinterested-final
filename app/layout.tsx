import AccessibilityWidget from "@/components/AccessibilityWidget";
import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Script from "next/script"
import { Toaster } from "@/components/ui/toaster"
import { generateOrganizationSchema } from "@/lib/seo-utils"
import SeoSchema from "@/components/seo-schema"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Suspense } from "react"
import AnalyticsConsent from "@/components/analytics-consent"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Dr. Interested - Inspiring Future Healthcare Leaders",
    template: "%s | Dr. Interested",
  },
  description:
    'Dr. Interested supports youth in finding their unique "spark" in medicine through programs & opportunities. Earn volunteer hours while building your future!',
  keywords: [
    "Adil Mukhi",
    "Mississauga",
    "Dr. Interested",
    "healthcare education",
    "medical careers",
    "high school students",
    "healthcare mentorship",
    "medical research",
    "Dr. Interested",
    "healthcare internships",
    "medical technology",
    "high school club",
    "volunteer hours",
    "healthcare volunteer",
    "student-led organization",
    "healthcare leadership",
    "medical podcast",
    "healthcare blog",
    "healthcare community",
    "healthcare workshops",
    "healthcare research",
    "highschool research",
    "doctor interested",
    "doctor interest",
    "dr interested",
    "dr interest",
    "medical students",
    "healthcare advisors",
    "impact report",
    "healthcare impact",
    "policy spark",
    "healthcare policy",
    "healthcare events",
    "medical webinars",
    "premed webinars",
    "healthcare webinars",
  ],
  authors: [{ name: "Dr. Interested Team" }],
  creator: "Dr. Interested",
  publisher: "Dr. Interested",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.drinterested.org",
    title: "Dr. Interested - Inspiring Future Healthcare Leaders",
    description:
      'Dr. Interested supports youth in finding their unique "spark" in medicine through programs & opportunities. Earn volunteer hours while building your future!',
    siteName: "Dr. Interested",
    images: [
      {
        url: "/websitebanner.jpg",
        width: 1920,
        height: 1080,
        alt: "Dr. Interested - Pre-Med Youth Org - Supporting youth in finding their unique 'spark' in medicine!",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dr. Interested - Inspiring Future Healthcare Leaders",
    description:
      'Dr. Interested supports youth in finding their unique "spark" in medicine through programs & opportunities. Earn volunteer hours while building your future!',
    images: {
      url: "/websitebanner.jpg",
      alt: "Dr. Interested - Pre-Med Youth Org - Supporting youth in finding their unique 'spark' in medicine!",
      type: "image/jpeg",
    },
    creator: "@DrInterested",
  },
  // NOTE: no `alternates` here on purpose. `alternates.canonical` set on the root layout
  // cascades to every page that doesn't override it, which would point the whole site's
  // canonical at the homepage. Each page declares its own canonical instead; the homepage's
  // lives in app/page.tsx. RSS discovery is handled by the <link rel="alternate"> in <head>.
  icons: [
    { rel: "icon", url: "/favicon.ico" },
    { rel: "icon", type: "image/png", sizes: "16x16", url: "/favicon-16x16.png" },
    { rel: "icon", type: "image/png", sizes: "32x32", url: "/favicon-32x32.png" },
    { rel: "apple-touch-icon", sizes: "180x180", url: "/apple-touch-icon.png" },
    { rel: "manifest", url: "/site.webmanifest" },
  ],
  metadataBase: new URL("https://www.drinterested.org"),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export const viewport: Viewport = {
  themeColor: "#405862",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {`
            (function () {
              try {
                var root = document.documentElement;
                var theme = localStorage.getItem('theme');
                var useDark = theme === 'dark';
                root.classList.remove('dark', 'light');
                root.classList.add(useDark ? 'dark' : 'light');
                root.style.colorScheme = useDark ? 'dark' : 'light';
              } catch (e) {}
            })();
          `}
        </Script>
        {/* Google Analytics and the Meta Pixel are loaded by <AnalyticsConsent /> only after a
            visitor allows them, and never on portal pages. ConvertKit's script is loaded by the
            newsletter form itself, only where one is shown. */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Dr. Interested RSS Feed"
          href="https://www.drinterested.org/rss.xml"
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        {/* enableSystem={false}: the site is light-by-default and only goes dark via the
            AccessibilityWidget toggle. Letting next-themes also react to the OS
            prefers-color-scheme made its resolved theme disagree with the inline
            #theme-init script for OS-dark visitors, producing a hydration mismatch. */}
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <AccessibilityWidget />
          <SeoSchema id="organization-schema" schema={generateOrganizationSchema()} />
          <Suspense fallback={null}>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <div className="h-16 md:hidden" aria-hidden="true" />
              <main className="flex-1">{children}</main>
              <Footer />
              <Toaster />
            </div>
          </Suspense>
          <Analytics />
          <SpeedInsights />
          <AnalyticsConsent />
        </ThemeProvider>
        <Script id="pdf-schema" type="application/ld+json" strategy="afterInteractive">
          {`
            {
              "@context": "https://schema.org",
              "@type": "MediaObject",
              "name": "Dr Interested 2025 Impact Report",
              "contentUrl": "https://www.drinterested.org/dr-interested-impact-report-2025 (1).pdf",
              "encodingFormat": "application/pdf",
              "description": "Download and view the Dr Interested Annual 2025 Impact Report to learn about our initiatives, programs, and impact in healthcare education."
            }
          `}
        </Script>
      </body>
    </html>
  )
}
