import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as admin from 'firebase-admin';
import { AxiosError } from 'axios';

var serviceAccount = require("../../serviceAccountKey.json");

@Injectable()
export class FcmGateway {
  private readonly logger = new Logger(FcmGateway.name);

  constructor(
    private readonly httpService: HttpService,
  ) {
    // Firebase Admin SDK 초기화
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }
  }

  /**
   * FCM 알림 전송 메서드
   * @param recipientUuids 수신 대상 유저들의 UUID 목록
   * @param payload 알림에 담길 메시지 정보(title, body, data 등)
   */
  async sendNotification(recipientUuids: string[], payload: any): Promise<void> {
    // 1. User MS에서 FCM Token 목록 가져오기
    const tokens = await this.getFcmTokensByUserUuids(recipientUuids);
    if (!tokens || tokens.length === 0) {
      this.logger.warn('No FCM tokens found for the given recipients');
      return;
    }

    // 2. FCM 발송 메시지 구성
    const message = {
      notification: {
        title: payload.title ?? '알림',
        body: payload.body ?? '',
      },
      data: payload.data ? this.serializeData(payload.data) : {},
      tokens,
    };

    try {
      // 3. Firebase Admin SDK로 멀티캐스트(Multicast) 발송
      const response = await admin.messaging().sendEachForMulticast(message);
      this.logger.log(`FCM Response: ${JSON.stringify(response)}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        this.logger.error(`Axios error while sending FCM: ${error.message}`);
      } else {
        this.logger.error(`FCM send error: ${error}`);
      }
    }
  }

  /**
   * User MS를 호출하여 해당 유저들의 FCM 토큰 목록을 가져오는 메서드
   * @param userUuids 유저 UUID 배열
   * @returns FCM Token 문자열 배열
   */
  private async getFcmTokensByUserUuids(userUuids: string[]): Promise<string[]> {
    try {
      // 실제 User MS 주소 (예: http://user-ms:3000/api/users/fcm-tokens)
      // 개발 환경 혹은 Docker compose 환경에서 User MS 주소/포트를 맞춰야 함
      const url = 'http://user-ms:3000/api/users/fcm-tokens';

      // 쿼리 파라미터로 userUuids 전달 (배열 -> 'uuid1,uuid2,...' 형태)
      // User MS가 "GET /fcm-tokens?userUuids=uuid1,uuid2" 형태로 수신한다고 가정
      const response = await this.httpService.axiosRef.get(url, {
        params: {
          userUuids: userUuids.join(','),
        },
      });

      // 예: User MS에서 { tokens: ['token1', 'token2', ...] } 형태로 응답한다고 가정
      return response.data.tokens || [];
    } catch (error) {
      if (error instanceof AxiosError) {
        this.logger.error(`AxiosError when calling User MS: ${error.message}`);
      } else {
        this.logger.error(`Error when calling User MS: ${error}`);
      }
      return [];
    }
  }

  /**
   * FCM Data Payload는 문자열만 허용됨. 따라서 object -> string 변환이 필요할 수 있음
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
