import type { Metadata } from 'next';
import { Outfit, JetBrains_Mono, Oswald } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

const oswald = Oswald({
  subsets: ['latin'],
  variable: '--font-oswald',
  display: 'swap',
});

export const metadata: Metadata = {
  applicationName: 'Gitwicket',
  title: 'Gitwicket • GitHub Player Card & T20 Scorecard',
  description:
    'Turn your GitHub profile into a shareable T20-style cricket player card and full match scorecard. Compare developers in Duel Mode!',
  keywords: ['GitHub', 'Cricket', 'Player Card', 'Scorecard', 'Developer Stats', 'Gitwicket'],
  authors: [{ name: 'Gitwicket' }],
  openGraph: {
    title: 'Gitwicket • GitHub Player Card & T20 Scorecard',
    description:
      'Turn your GitHub profile into a shareable T20-style cricket player card and full match scorecard.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gitwicket • GitHub Player Card & T20 Scorecard',
    description:
      'Turn your GitHub profile into a shareable T20-style cricket player card and full match scorecard.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${jetbrainsMono.variable} ${oswald.variable} dark`}>
      <body className="bg-[#0B0F19] text-slate-100 flex flex-col min-h-screen font-sans selection:bg-amber-500/30 selection:text-amber-300">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
