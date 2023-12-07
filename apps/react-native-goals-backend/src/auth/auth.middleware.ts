import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';

@Injectable()
export class AuthMiddleWare implements NestMiddleware {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  use(req: Request, res: Response, next: NextFunction): void {
    console.log('In auth.middleware.ts middleware');
    console.log('incoming request headers');
    console.log({ requestHeaders: req.headers });

    const accessToken = req.headers?.authorization?.split(' ')[1];
    const refreshToken = req.headers.refreshToken;
    console.log({ accessToken, refreshToken });

    if (req.body?.query?.includes('@registerMutation')) {
      // Perform actions specific to the isolated mutation
      console.log('Intercepted registrationMutation. No need for a token here');
      next();
    }

    if (!accessToken || !refreshToken) {
      res.sendStatus(401);
      return;
    }

    try {
      console.log(
        'There is an access token, either the current one used by user or the refresh one used by the user.\n so we can go on and verify them',
      );
      console.log({ accessToken, refreshToken });

      const decodedAccessToken = this.jwtService.verify(accessToken, {
        complete: true,
        ignoreExpiration: false,
      });
      req['user'] = decodedAccessToken;
      console.log("req['user'] following");
      console.log(req['user']);
      console.log({ requestBody: req.body });
      console.log('middleware is ok');
      next();
    } catch (error) {
      console.log({ error });
      res.sendStatus(401);
    }
  }
}
