import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from '@next/third-parties/google';
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://unfinished-sentences.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Unfinished Sentences | Complete the Unsaid",
    template: "%s | Unfinished Sentences"
  },
  description: "A beautiful community writing platform where strangers help complete your unfinished thoughts. Share vulnerability, create authentic poetry together, and find connection through words.",
  keywords: [
    "writing", "community", "poetry", "thoughts", "sentences", "creativity", 
    "vulnerability", "connection", "storytelling", "collaborative writing", 
    "emotional expression", "authentic sharing", "mental health", "healing through words"
  ],
  authors: [{ name: "Unfinished Sentences", url: baseUrl }],
  creator: "Unfinished Sentences",
  publisher: "Unfinished Sentences",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '16x16 32x32' },
    ],
    apple: [
      { url: '/apple-touch-icon.svg', sizes: '180x180', type: 'image/svg+xml' },
      { url: '/icon-192.svg', sizes: '192x192', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    other: [
      {
        rel: 'icon',
        url: '/icon-192.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
      },
      {
        rel: 'icon',
        url: '/icon-512.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
      },
    ],
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: baseUrl,
    siteName: 'Unfinished Sentences',
    title: 'Unfinished Sentences | Complete the Unsaid',
    description: 'A beautiful community writing platform where strangers help complete your unfinished thoughts. Share vulnerability, create authentic poetry together.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Unfinished Sentences - Complete the Unsaid',
        type: 'image/png',
      },
      {
        url: '/og-image-square.png',
        width: 1080,
        height: 1080,
        alt: 'Unfinished Sentences - Complete the Unsaid',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@unfinishedapp',
    creator: '@unfinishedapp',
    title: 'Unfinished Sentences | Complete the Unsaid',
    description: 'A beautiful community writing platform where strangers help complete your unfinished thoughts. Share vulnerability, create authentic poetry together.',
    images: [
      {
        url: '/og-image.png',
        alt: 'Unfinished Sentences - Complete the Unsaid',
      },
    ],
  },
  alternates: {
    canonical: baseUrl,
  },
  category: 'writing',
  classification: 'Creative Writing Platform',
  other: {
    'msapplication-TileColor': '#D9A5B3',
    'msapplication-config': '/browserconfig.xml',
  },
};

// Structured Data for SEO
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Unfinished Sentences",
  "description": "A community writing platform where strangers help complete your unfinished thoughts. Share vulnerability, create authentic poetry together.",
  "url": baseUrl,
  "applicationCategory": "WritingApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "creator": {
    "@type": "Organization",
    "name": "Unfinished Sentences",
    "url": baseUrl
  },
  "audience": {
    "@type": "Audience",
    "audienceType": "Writers, Poets, Creative Individuals"
  },
  "interactionStatistic": {
    "@type": "InteractionCounter",
    "interactionType": "https://schema.org/WriteAction",
    "userInteractionCount": "Community-driven"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.svg" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <meta name="theme-color" content="#D9A5B3" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Unfinished Sentences" />
        
        {/* Additional meta tags for better SEO */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="Unfinished Sentences" />
        <meta name="msapplication-TileColor" content="#D9A5B3" />
        <meta name="msapplication-TileImage" content="/icon-192.png" />
        
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body
        className={`${inter.variable} ${playfairDisplay.variable} antialiased`}
      >
        {children}
        <GoogleAnalytics gaId={'G-XCY2FMHELR'} />
      </body>
    </html>
  );
}
