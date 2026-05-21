const FROM = 'wansnap <noreply@wan-snap.com>';

export async function sendEmail(
  to: string,
  subject: string,
  html: string,
): Promise<void> {
  if (!process.env.RESEND_API_KEY) return;
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: FROM, to, subject, html }),
  });
}

const BASE_URL = 'https://www.wan-snap.com';

const wrapLayout = (content: string) => `<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#F4EDE0;font-family:-apple-system,BlinkMacSystemFont,'Helvetica Neue',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4EDE0;padding:40px 0;">
    <tr><td align="center">
      <table width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;background:#FFFEFB;border-radius:20px;overflow:hidden;">
        <tr>
          <td align="center" style="background:#1F1A14;padding:28px 32px;">
            <span style="color:#FFFEFB;font-size:18px;font-weight:600;letter-spacing:-0.01em;">🐾 wansnap</span>
          </td>
        </tr>
        ${content}
        <tr>
          <td style="padding:24px 32px 36px;border-top:1px solid rgba(31,26,20,0.08);">
            <p style="margin:0;font-size:11.5px;color:#7E7567;line-height:1.7;">
              wansnap — 犬種ごとにサイズ感とコーデが見つかる、愛犬家のコミュニティ
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

export function buildWelcomeEmail(displayName: string): { subject: string; html: string } {
  return {
    subject: 'wansnap へようこそ！',
    html: wrapLayout(`
      <tr>
        <td style="padding:40px 32px 32px;">
          <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#1F1A14;letter-spacing:-0.01em;">
            ようこそ、${displayName}さん！
          </p>
          <p style="margin:0 0 28px;font-size:14px;color:#4A4239;line-height:1.7;">
            wansnap への登録が完了しました。<br>
            愛犬のコーデスナップを投稿して、サイズ感や着こなしをみんなとシェアしましょう。
          </p>
          <table cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td align="center" style="padding-bottom:12px;">
                <a href="${BASE_URL}/posts/new"
                   style="display:inline-block;background:#1F1A14;color:#FFFEFB;text-decoration:none;font-size:15px;font-weight:600;padding:14px 40px;border-radius:999px;">
                  最初の一枚を投稿する
                </a>
              </td>
            </tr>
            <tr>
              <td align="center">
                <a href="${BASE_URL}/help"
                   style="display:inline-block;color:#7E7567;text-decoration:none;font-size:13px;padding:8px;">
                  使い方ガイドを見る →
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    `),
  };
}

export function buildFarewellEmail(displayName: string): { subject: string; html: string } {
  return {
    subject: 'wansnap を退会しました',
    html: wrapLayout(`
      <tr>
        <td style="padding:40px 32px 32px;">
          <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#1F1A14;letter-spacing:-0.01em;">
            ご利用ありがとうございました
          </p>
          <p style="margin:0 0 28px;font-size:14px;color:#4A4239;line-height:1.7;">
            ${displayName}さんのアカウントを削除しました。<br>
            投稿・愛犬データ・コメントなど、すべてのデータは削除済みです。<br><br>
            またいつでも戻ってきてください。愛犬家のみなさんが待っています。
          </p>
          <table cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td align="center">
                <a href="${BASE_URL}/auth/sign-in"
                   style="display:inline-block;background:#F4EDE0;color:#1F1A14;text-decoration:none;font-size:14px;font-weight:600;padding:12px 32px;border-radius:999px;border:1px solid rgba(31,26,20,0.14);">
                  また登録する
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    `),
  };
}
