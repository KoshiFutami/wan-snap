import type { Metadata } from 'next';
import { Quicksand, Zen_Maru_Gothic, BIZ_UDPGothic, Noto_Sans_JP, JetBrains_Mono } from 'next/font/google';
import { AppShell } from '../components/app-shell';
import './globals.css';

const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-quicksand',
  display: 'swap',
});

// 名前・キャプション等のコンテンツ本文（デフォルト）
const zenMaruGothic = Zen_Maru_Gothic({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-jp-body',
  display: 'swap',
});

// タブ・ボタン等のUIテキスト
const bizUdpGothic = BIZ_UDPGothic({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-jp-ui',
  display: 'swap',
});

// 設定・長文・利用規約
const notoSansJp = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jp-reading',
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
    <html lang="ja" className={`${quicksand.variable} ${zenMaruGothic.variable} ${bizUdpGothic.variable} ${notoSansJp.variable} ${jetBrainsMono.variable}`}>
      <body
        className="antialiased"
        style={{
          fontFamily: 'var(--font-quicksand), var(--font-jp-body), system-ui, sans-serif',
          background: '#F4EDE0',
          color: '#1F1A14',
          letterSpacing: '0.005em',
        }}
      >
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
