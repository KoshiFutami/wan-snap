const T = {
  ink: '#1F1A14',
  ink70: '#4A4239',
  hairline: 'rgba(31,26,20,0.08)',
  paper: '#FFFEFB',
};

export default function TermsPage() {
  return (
    <div style={{ minHeight: '100vh', background: T.paper, padding: '24px 16px 48px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <h1 style={{ fontSize: 24, lineHeight: 1.3, color: T.ink, margin: 0 }}>利用規約</h1>
        <p style={{ fontSize: 13, color: T.ink70, marginTop: 8 }}>最終更新日: 2026年5月19日</p>
        <div style={{ height: 1, background: T.hairline, margin: '16px 0 24px' }} />

        <section style={{ display: 'grid', gap: 16, fontSize: 14, lineHeight: 1.8, color: T.ink70 }}>
          <p>本規約は、wansnap（以下「当サービス」）の利用条件を定めるものです。ユーザーは本規約に同意の上で当サービスを利用するものとします。</p>
          <p>ユーザーは、法令または公序良俗に反する行為、第三者の権利を侵害する行為、当サービスの運営を妨げる行為を行ってはなりません。</p>
          <p>ユーザーが投稿したコンテンツの権利はユーザーに帰属しますが、当サービスの提供・改善に必要な範囲で当サービスが利用できるものとします。</p>
          <p>当サービスは、必要に応じて本規約を変更する場合があります。変更後の内容は本ページへの掲載をもって効力を生じます。</p>
        </section>
      </div>
    </div>
  );
}
