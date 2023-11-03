import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
// import { AuthService } from './auth.service';

@Injectable()
export class AuthMiddleWare implements NestMiddleware {
  // constructor(private readonly authService: AuthService) {}

  use(request: Request, response: Response, next: NextFunction): void {
    // const token = req.headers.authorization?.split(' ')[1];

    // if(token){
    //                 // TODO: to implement
    //     const user = await this.authService.verifyToken(token);
    //     if(user) {
    //         req['user'] = user; // Attach user object to the request context
    //     }
    // }
    console.log('Middleware is processing the request.');
    Logger.log({ request: request.headers, response: response.body });
    next();
  }
}
