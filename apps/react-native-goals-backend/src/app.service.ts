import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    console.log('test log', 'AppService');

    return 'Hello World!';
  }
}
