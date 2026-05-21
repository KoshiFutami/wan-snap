import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import type { JwtPayload } from '../../common/decorators/current-user.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

class SendFeedbackDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  message!: string;
}

@Controller('feedback')
export class FeedbackController {
  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async send(
    @CurrentUser() user: JwtPayload,
    @Body() dto: SendFeedbackDto,
  ) {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY ?? ''}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'wansnap <noreply@wan-snap.com>',
        to: 'koshi.futami@gmail.com',
        subject: '【wansnap】機能要望が届きました',
        text: `送信者: ${user.email}\n\n${dto.message}`,
      }),
    });

    if (!res.ok) {
      throw new InternalServerErrorException('メールの送信に失敗しました');
    }
  }
}
