import type { Metadata } from 'next';
import { Header } from '../components/header';
import './globals.css';

export const metadata: Metadata = {
  title: 'Wan Snap | わんこのおしゃれスナップ',
  description: '愛犬のコーデを共有して、同じ犬種のオーナーと繋がろう',
  appleWebApp: {
    capable: true,
    title: 'Wan Snap',
    statusBarStyle: 'default',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-bg text-text-main antialiased" style={{ fontFamily: "'Hiragino Sans', 'Noto Sans JP', sans-serif" }}>
        <Header />
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
