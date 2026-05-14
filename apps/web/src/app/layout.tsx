import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Wan Snap | わんこのおしゃれスナップ',
  description: '愛犬のコーデを共有して、同じ犬種のオーナーと繋がろう',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="bg-white text-gray-900 antialiased">{children}</body>
    </html>
  );
}
