import { Controller, Get } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller()
export class NotificationController {
  constructor(private readonly notificationMsService: NotificationService) {}

  @Get()
  getHello(): string {
    return this.notificationMsService.getHello();
  }
}
