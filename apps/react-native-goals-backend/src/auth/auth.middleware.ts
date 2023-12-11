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
    console.log({ accessToken });

    if (accessToken) {
      console.log('inside if(accessToken){}');
      try {
        console.log('inside try{} catch() {}');

        const decodedAccessToken = this.jwtService.verify(accessToken, {
          ignoreExpiration: true,
          complete: true,
        });
        console.log({ decodedAccessToken });
        req['user'] = decodedAccessToken;
        console.log("req['user'] following");
        console.log(req['user']);
        console.log({ requestBody: req.body });
        console.log('middleware is ok');
      } catch (error) {
        res.status(401).json({ message: 'Unauthorized' });
      }
    }
    next();
  }
}
