const T = {
  ink: '#1F1A14',
  ink70: '#4A4239',
  ink50: '#7E7567',
  hairline: 'rgba(31,26,20,0.08)',
  paper: '#FFFEFB',
};

const sectionStyle = {
  marginBottom: 32,
};

const h2Style = {
  fontSize: 16,
  fontWeight: 700,
  color: T.ink,
  margin: '0 0 10px',
};

const h3Style = {
  fontSize: 14,
  fontWeight: 700,
  color: T.ink,
  margin: '16px 0 6px',
};

const pStyle = {
  fontSize: 14,
  lineHeight: 1.8,
  color: T.ink70,
  margin: '0 0 8px',
};

const ulStyle = {
  fontSize: 14,
  lineHeight: 1.8,
  color: T.ink70,
  margin: '0 0 8px',
  paddingLeft: 20,
};

export default function PrivacyPolicyPage() {
  return (
    <div style={{ minHeight: '100vh', background: T.paper, padding: '24px 16px 64px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <h1 style={{ fontSize: 24, lineHeight: 1.3, color: T.ink, margin: 0 }}>プライバシーポリシー</h1>
        <p style={{ fontSize: 13, color: T.ink50, marginTop: 8 }}>最終更新日: 2026年5月24日</p>
        <div style={{ height: 1, background: T.hairline, margin: '16px 0 32px' }} />

        <div style={sectionStyle}>
          <p style={pStyle}>
            wansnap（以下「本サービス」）は、ユーザーのプライバシーを尊重し、個人情報の保護に努めます。本ポリシーは、本サービスが収集する情報の種類、その利用方法、および保護について説明します。
          </p>
        </div>

        {/* 1. 収集する情報 */}
        <div style={sectionStyle}>
          <h2 style={h2Style}>1. 収集する情報</h2>
          <h3 style={h3Style}>1-1. アカウント情報</h3>
          <p style={pStyle}>
            本サービスへのログイン時、以下の情報を収集します。
          </p>
          <ul style={ulStyle}>
            <li>メールアドレス</li>
            <li>表示名（Googleアカウントの名前、またはユーザーが設定した名前）</li>
            <li>プロフィール画像URL（Googleアカウントのプロフィール画像）</li>
          </ul>

          <h3 style={h3Style}>1-2. ユーザーが投稿するコンテンツ</h3>
          <ul style={ulStyle}>
            <li>スナップ写真・キャプション・タグ情報</li>
            <li>愛犬の名前・犬種・サイズ情報・写真</li>
            <li>コメント</li>
            <li>プロフィール情報（自己紹介、所在地、Instagramユーザー名）</li>
          </ul>

          <h3 style={h3Style}>1-3. 利用状況情報</h3>
          <ul style={ulStyle}>
            <li>アクセスログ（IPアドレス、ブラウザ情報、アクセス日時）</li>
            <li>いいね・ブックマーク・フォロー等の行動履歴</li>
          </ul>
        </div>

        {/* 2. Google ユーザーデータの取り扱い */}
        <div style={sectionStyle}>
          <h2 style={h2Style}>2. Google ユーザーデータの取り扱い</h2>
          <p style={pStyle}>
            本サービスは、Google でのログイン（Google Identity Services）を通じて、Googleアカウントから以下のデータにアクセスします。
          </p>

          <h3 style={h3Style}>アクセスするデータ（Data Accessed）</h3>
          <ul style={ulStyle}>
            <li><strong>メールアドレス</strong>（email）</li>
            <li><strong>氏名・表示名</strong>（name / given_name / family_name）</li>
            <li><strong>プロフィール画像URL</strong>（picture）</li>
            <li><strong>Googleアカウント識別子</strong>（sub / user ID）</li>
          </ul>
          <p style={pStyle}>
            本サービスは、Google のドライブ、カレンダー、メール、連絡先等の他のGoogleサービスのデータにはアクセスしません。
          </p>

          <h3 style={h3Style}>利用目的（Data Usage）</h3>
          <p style={pStyle}>
            取得したGoogleユーザーデータは、以下の目的にのみ使用します。
          </p>
          <ul style={ulStyle}>
            <li>本サービスへのログイン・本人確認（認証）</li>
            <li>アカウントの初期プロフィール（表示名・アイコン）の設定</li>
            <li>アカウントとGoogleアカウントの紐付け管理</li>
          </ul>
          <p style={pStyle}>
            取得したGoogleユーザーデータは、マーケティング・広告・AI/MLモデルの学習・その他認証目的以外の用途には使用しません。
          </p>

          <h3 style={h3Style}>第三者への共有（Data Sharing）</h3>
          <p style={pStyle}>
            Googleユーザーデータは、以下の場合を除き第三者に提供しません。
          </p>
          <ul style={ulStyle}>
            <li>
              <strong>Supabase, Inc.</strong>（認証基盤）: 本サービスの認証処理に必要な範囲でユーザーIDとメールアドレスを保存します。Supabaseは<a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: T.ink }}>独自のプライバシーポリシー</a>に従ってデータを管理します。
            </li>
            <li>法令に基づく開示が必要な場合</li>
          </ul>
          <p style={pStyle}>
            Googleユーザーデータを販売・貸与・共有することはありません。
          </p>

          <h3 style={h3Style}>データの保存と保護（Data Storage & Protection）</h3>
          <ul style={ulStyle}>
            <li>認証情報はSupabase（SOC 2 Type II認証取得済み）に保存されます</li>
            <li>プロフィール情報（表示名・プロフィール画像URL）は本サービスのデータベースに保存されます</li>
            <li>データベースへのアクセスは認証済みAPIを通じてのみ行い、直接アクセスはできません</li>
            <li>通信はすべてHTTPS（TLS）で暗号化されます</li>
          </ul>

          <h3 style={h3Style}>データの保持と削除（Data Retention & Deletion）</h3>
          <p style={pStyle}>
            Googleユーザーデータは、アカウントが有効な期間中保持されます。
          </p>
          <p style={pStyle}>
            ユーザーはいつでも本サービス内の <strong>設定 → 退会する</strong> からアカウントを削除できます。アカウント削除により、以下のすべてのデータが削除されます。
          </p>
          <ul style={ulStyle}>
            <li>Googleアカウントから取得したメールアドレス・表示名・プロフィール画像URL</li>
            <li>投稿・愛犬情報・コメント・いいね・フォロー関係</li>
            <li>認証情報（Supabase上のアカウント）</li>
          </ul>
          <p style={pStyle}>
            データ削除の依頼は <a href="mailto:koshi.futami@gmail.com" style={{ color: T.ink }}>koshi.futami@gmail.com</a> へもご連絡いただけます。
          </p>
        </div>

        {/* 3. Cookieとローカルストレージ */}
        <div style={sectionStyle}>
          <h2 style={h2Style}>3. Cookie・ローカルストレージ</h2>
          <p style={pStyle}>
            本サービスは、ログイン状態の維持のためにCookieおよびローカルストレージを使用します。ブラウザの設定により無効化できますが、一部機能が利用できなくなる場合があります。
          </p>
        </div>

        {/* 4. 未成年者 */}
        <div style={sectionStyle}>
          <h2 style={h2Style}>4. 未成年者のプライバシー</h2>
          <p style={pStyle}>
            本サービスは13歳未満の方を対象としておらず、意図的に13歳未満から個人情報を収集しません。
          </p>
        </div>

        {/* 5. ポリシーの変更 */}
        <div style={sectionStyle}>
          <h2 style={h2Style}>5. プライバシーポリシーの変更</h2>
          <p style={pStyle}>
            本ポリシーは必要に応じて改定することがあります。重要な変更がある場合はアプリ内でお知らせします。
          </p>
        </div>

        {/* 6. お問い合わせ */}
        <div style={sectionStyle}>
          <h2 style={h2Style}>6. お問い合わせ</h2>
          <p style={pStyle}>
            プライバシーに関するご質問・ご要望は下記までご連絡ください。
          </p>
          <p style={pStyle}>
            <strong>wansnap 運営</strong><br />
            メール: <a href="mailto:koshi.futami@gmail.com" style={{ color: T.ink }}>koshi.futami@gmail.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}
