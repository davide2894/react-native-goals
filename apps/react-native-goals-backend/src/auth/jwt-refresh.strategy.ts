import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwtRefresh',
) {
  constructor() {
    console.log('-------------------');
    console.log('JwtRefreshStrategy');
    super({
      jwtFromRequest: ExtractJwt.fromHeader('refreshtoken'),
      ignoreExpiration: false,
      secretOrKey: process.env.REFRESH_TOKEN_SECRET,
    });
  }

  async validate(payload: any) {
    Logger.log('jwt.refresh-strategy.ts');
    Logger.log({ payload });
    return { payload };
  }
}
