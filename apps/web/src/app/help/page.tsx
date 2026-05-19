import Link from 'next/link';

const T = {
  ink: '#1F1A14',
  ink70: '#4A4239',
  ink50: '#7E7567',
  paper: '#FFFEFB',
  cream: '#F4EDE0',
  terracotta: '#B95A3D',
  hairline: 'rgba(31,26,20,0.08)',
  hairlineStrong: 'rgba(31,26,20,0.14)',
};

const SECTIONS = [
  {
    title: 'スナップを投稿する',
    steps: [
      'ナビゲーションバー中央の「＋」ボタンをタップ',
      '写真を選んでトリミングする',
      '写真内の犬をタップして犬プロフィールをタグ付け（任意）',
      'キャプションやハッシュタグを入力して「投稿する」',
    ],
  },
  {
    title: '犬プロフィールを作る',
    steps: [
      'マイページから「＋ 追加」をタップ',
      '犬の名前・犬種・生年月日・性別を入力',
      '体重・胸囲・背中の長さを入れるとサイズが自動計算される',
      'プロフィール写真を設定して「保存」',
    ],
  },
  {
    title: 'コーデアイテムを記録する',
    steps: [
      '投稿作成画面でアイテムを登録できる',
      'ブランド名・商品名・サイズを入力',
      '投稿した写真の詳細ページでアイテム一覧を確認できる',
    ],
  },
  {
    title: 'コーデを探す',
    steps: [
      '検索（🔍）から犬種やハッシュタグで投稿を検索できる',
      'ホームのフィードで気になった投稿をブックマーク（🔖）',
      'マイページの「保存済み」タブでブックマーク一覧を確認',
    ],
  },
  {
    title: 'フォローする・つながる',
    steps: [
      '気になる投稿をタップして投稿詳細ページへ',
      '投稿者のアイコンやユーザー名をタップしてプロフィールへ',
      '「フォローする」ボタンをタップ',
      'ホームで「フォロー中」タブを選ぶとフォロー相手の投稿だけ表示される',
    ],
  },
];

export default function HelpPage() {
  return (
    <div style={{ minHeight: '100vh', background: T.paper, padding: '24px 16px 80px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <h1 style={{ fontSize: 24, lineHeight: 1.3, color: T.ink, margin: 0 }}>使い方ガイド</h1>
        <p style={{ fontSize: 13, color: T.ink50, marginTop: 8, lineHeight: 1.65 }}>
          wansnapの基本的な使い方を説明します。
        </p>
        <div style={{ height: 1, background: T.hairline, margin: '16px 0 28px' }} />

        <div style={{ display: 'grid', gap: 28 }}>
          {SECTIONS.map(({ title, steps }, i) => (
            <section key={title}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span
                  style={{
                    flexShrink: 0,
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: T.terracotta,
                    color: '#fff',
                    fontSize: 12,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {i + 1}
                </span>
                <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: T.ink }}>
                  {title}
                </h2>
              </div>
              <ol
                style={{
                  margin: 0,
                  paddingLeft: 34,
                  display: 'grid',
                  gap: 8,
                  fontSize: 13.5,
                  lineHeight: 1.7,
                  color: T.ink70,
                }}
              >
                {steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </section>
          ))}
        </div>

        <div style={{ height: 1, background: T.hairline, margin: '36px 0 20px' }} />

        <p style={{ fontSize: 12.5, color: T.ink50, lineHeight: 1.7, margin: 0 }}>
          ご不明な点は{' '}
          <a
            href="mailto:support@wansnap.app"
            style={{ color: T.ink, textDecoration: 'underline' }}
          >
            support@wansnap.app
          </a>{' '}
          までお問い合わせください。
        </p>

        <div style={{ marginTop: 24, display: 'flex', gap: 16 }}>
          <Link href="/terms" style={{ fontSize: 12, color: T.ink50, textDecoration: 'underline' }}>
            利用規約
          </Link>
          <Link href="/privacy-policy" style={{ fontSize: 12, color: T.ink50, textDecoration: 'underline' }}>
            プライバシーポリシー
          </Link>
        </div>
      </div>
    </div>
  );
}
