// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'ThinkBeforePost - KI-gestützte Social Media Sicherheit',
  description: 'Schütze deine Karriere und Reputation mit KI-gestützter Content-Analyse. Analysiere Posts bevor du sie teilst.',
  keywords: 'social media, sicherheit, ki, analyse, reputation, karriere',
  authors: [{ name: 'ThinkBeforePost Team' }],
  openGraph: {
    title: 'ThinkBeforePost - Stop. Think. Post Safely.',
    description: 'Ein unbedachter Post kann deine Karriere ruinieren. Unsere KI analysiert deine Inhalte bevor du postest.',
    url: 'https://thinkbeforepost.ai',
    siteName: 'ThinkBeforePost',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'de_DE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ThinkBeforePost - KI-gestützte Social Media Sicherheit',
    description: 'Schütze deine Karriere mit KI-Content-Analyse',
    images: ['/twitter-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}