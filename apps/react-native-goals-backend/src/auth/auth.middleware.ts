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
    const refreshtoken = req.headers.refreshtoken as string;
    console.log({ accessToken, refreshtoken });
    console.log({ query: req.body.query });

    // const refreshRotateToken = () => {
    //   console.log('initiating refresh and rotate token procedure...');
    //   try {
    //     const decodedRefreshToken = this.jwtService.verify(refreshtoken, {
    //       complete: true,
    //       ignoreExpiration: false,
    //     });
    //     if (decodedRefreshToken) {
    //       console.log({
    //         decodedRefreshToken,
    //       });
    //       console.log('refresh  token available and valid.');
    //       console.log('using refresh token    to create a new one');
    //       req['user'] = decodedRefreshToken;
    //       next();
    //     }
    //   } catch (error) {
    //     console.log('both tokens  are expired......');
    //     console.log({ error });
    //     console.log('sending back 401 response...');
    //     res.sendStatus(401);
    //   }
    // };

    if (req.body?.query?.includes('register')) {
      // Perform actions specific to the isolated mutation
      console.log('Intercepted register mutation. No need for a token here');
      next();
    } else if (!accessToken || !refreshtoken) {
      console.log('Error: there is at least one INVALID TOKEN. Checking...');
      if (!accessToken) {
        console.log('EMPTY ACCESS TOKEN');
      }
      if (!refreshtoken) {
        console.log('EMPTY REFRESH TOKEN');
      }
      console.log(
        'Sending 400 back to frontent as first token usage attempt FAILED',
      );
      res.sendStatus(400);
    } else {
      try {
        console.log(
          'There is at least one access token, either the current one used by user or the refresh one used by the user.\n so we can go on and verify them',
        );
        console.log({ accessToken, refreshtoken });
        const decodedAccessToken = this.jwtService.verify(accessToken, {
          complete: true,
          ignoreExpiration: false,
        });
        req['user'] = decodedAccessToken;
        console.log("req['user'] following");
        console.log(req['user']);
        console.log({ requestBody: req.body });
        next();
      } catch (error) {
        console.log('inside  catch statement');
        console.log(
          "access token verification failed because it's expired. Calling refreshRotateToken();",
        );
        res.sendStatus(401);
      }
    }
  }
}
