import type { Metadata } from 'next';
import { Noto_Serif_JP, Zen_Kaku_Gothic_New, JetBrains_Mono } from 'next/font/google';
import { Header } from '../components/header';
import { BottomNav } from '../components/bottom-nav';
import './globals.css';

const notoSerifJP = Noto_Serif_JP({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-serif',
  display: 'swap',
});

const zenKakuGothicNew = Zen_Kaku_Gothic_New({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Wan·Snap | わんこのおしゃれスナップ',
  description: '犬種ごとに、サイズ感と着こなしが見つかる。愛犬家のためのファッションスナップ・コミュニティ。',
  appleWebApp: {
    capable: true,
    title: 'Wan·Snap',
    statusBarStyle: 'default',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={`${notoSerifJP.variable} ${zenKakuGothicNew.variable} ${jetBrainsMono.variable}`}>
      <body
        className="antialiased"
        style={{
          fontFamily: 'var(--font-sans), -apple-system, system-ui, sans-serif',
          background: '#F4EDE0',
          color: '#1F1A14',
          letterSpacing: '0.005em',
        }}
      >
        <Header />
        <main className="mx-auto max-w-sm pb-28">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
