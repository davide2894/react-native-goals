import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    Logger.log('test log', 'AppService')

    return 'Hello mamma!';
  }
}
