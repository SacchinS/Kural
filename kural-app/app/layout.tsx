import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Kural — AI-Powered Voice for ALS Patients',
  description:
    'Kural uses eye tracking and AI to let ALS patients speak in their own cloned voice — at 40–60 words per minute.',
  keywords: ['ALS', 'AAC', 'eye tracking', 'voice cloning', 'augmentative communication'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
