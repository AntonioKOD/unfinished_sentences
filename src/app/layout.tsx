import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Unfinished Sentences | Complete the Unsaid",
  description: "A community writing platform where strangers help finish your unfinished thoughts. Share vulnerability, create poetry together.",
  keywords: ["writing", "community", "poetry", "thoughts", "sentences", "creativity"],
  authors: [{ name: "Unfinished Sentences" }],
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' },
    ],
    apple: [
      { url: '/icon-192.png', sizes: '192x192' },
    ],
  },
  openGraph: {
    title: "Unfinished Sentences",
    description: "Complete the Unsaid - A community writing platform",
    type: "website",
    images: [
      {
        url: '/favicon.svg',
        width: 100,
        height: 100,
        alt: 'Unfinished Sentences',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: "Unfinished Sentences",
    description: "Complete the Unsaid - A community writing platform",
    images: ['/favicon.svg'],
  },
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
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#D9A5B3" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Unfinished Sentences" />
      </head>
      <body
        className={`${inter.variable} ${playfairDisplay.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
