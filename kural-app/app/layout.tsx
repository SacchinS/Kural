import type { Metadata, Viewport } from 'next';
import { Inter, DM_Sans } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Kural — AI-Powered Voice for ALS Patients',
  description:
    'Kural uses eye tracking and AI to let ALS patients speak in their own cloned voice — at 40–60 words per minute.',
  keywords: ['ALS', 'AAC', 'eye tracking', 'voice cloning', 'augmentative communication'],
  appleWebApp: {
    capable: true,
    title: 'Kural',
    statusBarStyle: 'black-translucent',
  },
};

export const viewport: Viewport = {
  themeColor: '#00C9A7',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${dmSans.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
