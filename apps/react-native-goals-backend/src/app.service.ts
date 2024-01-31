import { Injectable } from '@nestjs/common';
import { devModeLog } from 'dev-mode-log';

@Injectable()
export class AppService {
  getHello(): string {
    devModeLog('test log', 'AppService');

    return 'Hello World!';
  }
}
