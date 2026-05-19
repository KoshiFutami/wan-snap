import { Injectable, Logger } from '@nestjs/common';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

@Injectable()
export class AuthMailService {
  private readonly logger = new Logger(AuthMailService.name);
  private readonly sender = process.env.AUTH_MAIL_FROM?.trim();
  private hasWarnedMissingSender = false;
  private readonly sesClient = new SESClient({
    region:
      process.env.AUTH_MAIL_REGION ??
      process.env.AWS_REGION ??
      process.env.STORAGE_REGION ??
      'ap-northeast-1',
    endpoint: process.env.AUTH_MAIL_SES_ENDPOINT?.trim() || undefined,
  });

  async sendSignUpNotice(email: string, displayName: string): Promise<void> {
    await this.send(
      email,
      '【Wan Snap】登録ありがとうございます',
      `${displayName} さん、Wan Snap へのご登録ありがとうございます。`,
    );
  }

  async sendSignInNotice(email: string): Promise<void> {
    await this.send(
      email,
      '【Wan Snap】ログイン通知',
      'Wan Snap へのログインがありました。',
    );
  }

  private async send(to: string, subject: string, bodyText: string) {
    if (!this.sender) {
      if (!this.hasWarnedMissingSender) {
        this.logger.warn(
          'AUTH_MAIL_FROM が未設定のためメール送信をスキップします',
        );
        this.hasWarnedMissingSender = true;
      }
      return;
    }

    try {
      await this.sesClient.send(
        new SendEmailCommand({
          Source: this.sender,
          Destination: { ToAddresses: [to] },
          Message: {
            Subject: { Data: subject, Charset: 'UTF-8' },
            Body: { Text: { Data: bodyText, Charset: 'UTF-8' } },
          },
        }),
      );
    } catch (error) {
      this.logger.error(`メール送信に失敗しました: ${to}`, error);
    }
  }
}
