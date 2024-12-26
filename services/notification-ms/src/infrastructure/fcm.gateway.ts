import { Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';

var serviceAccount = require("../../serviceAccountKey.json");

@Injectable()
export class FcmGateway {
  private readonly logger = new Logger(FcmGateway.name);

  constructor() {
    // Firebase Admin SDK 초기화
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }
  }

  /**
   * FCM 알림 전송 메서드
   * @param tokens 수신 대상 유저들의 FCM Token 목록
   * @param payload 알림에 담길 메시지 정보(title, body, data 등)
   */
  async sendNotification(tokens: string[], payload: any): Promise<void> {
    if (!tokens || tokens.length === 0) {
      this.logger.warn('No FCM tokens provided for the recipients');
      return;
    }

    // FCM 발송 메시지 구성
    const message = {
      notification: {
        title: payload.title ?? '알림',
        body: payload.body ?? '',
      },
      data: payload.data ? this.serializeData(payload.data) : {},
      tokens,
    };

    try {
      // Firebase Admin SDK로 멀티캐스트(Multicast) 발송
      const response = await admin.messaging().sendEachForMulticast(message);
      this.logger.log(`FCM Response: ${JSON.stringify(response)}`);
    } catch (error) {
      this.logger.error(`FCM send error: ${error}`);
    }
  }

  /**
   * FCM Data Payload는 문자열만 허용됨. 따라서 object -> string 변환이 필요
   */
  private serializeData(data: any): { [key: string]: string } {
    const serialized: { [key: string]: string } = {};
    for (const key of Object.keys(data)) {
      serialized[key] = typeof data[key] === 'object'
        ? JSON.stringify(data[key])
        : String(data[key]);
    }
    return serialized;
  }
}
