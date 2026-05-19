const T = {
  ink: '#1F1A14',
  ink70: '#4A4239',
  hairline: 'rgba(31,26,20,0.08)',
  paper: '#FFFEFB',
};

export default function PrivacyPolicyPage() {
  return (
    <div style={{ minHeight: '100vh', background: T.paper, padding: '24px 16px 48px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <h1 style={{ fontSize: 24, lineHeight: 1.3, color: T.ink, margin: 0 }}>プライバシーポリシー</h1>
        <p style={{ fontSize: 13, color: T.ink70, marginTop: 8 }}>最終更新日: 2026年5月19日</p>
        <div style={{ height: 1, background: T.hairline, margin: '16px 0 24px' }} />

        <section style={{ display: 'grid', gap: 16, fontSize: 14, lineHeight: 1.8, color: T.ink70 }}>
          <p>当サービスは、ユーザー登録情報、投稿情報、アクセス履歴などの情報を、サービス提供・改善・不正利用防止のために取得する場合があります。</p>
          <p>取得した情報は、法令に基づく場合を除き、ユーザーの同意なく第三者へ提供しません。</p>
          <p>当サービスは、取得した情報への不正アクセス、漏えい、改ざん等を防止するために合理的な安全管理措置を講じます。</p>
          <p>ユーザーは、当サービスが定める手続きにより、自己情報の確認・訂正・削除を申請できます。</p>
        </section>
      </div>
    </div>
  );
}
