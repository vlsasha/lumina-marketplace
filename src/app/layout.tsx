import type { Metadata, Viewport } from 'next';
import './globals.css';
import { FloatingCart } from '@/components/FloatingCart';
import '@rainbow-me/rainbowkit/styles.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Lumina — API Marketplace for Vana Data',
  description: 'Connect, access, and monetize user-owned data through Vana\'s decentralized protocol. API marketplace for ChatGPT, GitHub, Instagram, LinkedIn, Spotify, YouTube, Amazon, Claude, iCloud Notes, and Oura Ring data.',
  keywords: ['Vana', 'Lumina', 'API', 'marketplace', 'user-owned data', 'blockchain', 'data portability'],
  authors: [{ name: 'Lumina Team' }],
  openGraph: {
    title: 'Lumina — API Marketplace for Vana Data',
    description: 'Access user-owned data through the Vana protocol. 10+ data sources, one API.',
    type: 'website',
    siteName: 'Lumina',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lumina — API Marketplace for Vana Data',
    description: 'Access user-owned data through the Vana protocol. 10+ data sources, one API.',
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/logo.jpg',
    apple: '/logo.jpg',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#000000',
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased safe-top safe-bottom">
        <Providers>
          <div className="min-h-screen">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
