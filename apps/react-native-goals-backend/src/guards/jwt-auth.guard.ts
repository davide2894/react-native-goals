import {
  Injectable,
  ExecutionContext,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JsonWebTokenError } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any, context: any, status: any) {
    console.log('---------------');
    console.log('JwtAuthGuard');
    console.log(
      'handleRequest(err: any, user: any, info: any, context: any, status: any)',
    );
    console.log({
      err,
      user,
      info,
      context,
      status,
    });
    if (info instanceof JsonWebTokenError) {
      throw new UnauthorizedException('Invalid JWT');
    }

    return super.handleRequest(err, user, info, context, status);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('---------------');
    console.log('JwtAuthGuard');
    console.log(' async canActivate(context: ExecutionContext)');
    const parentCanActivate = (await super.canActivate(context)) as boolean;
    // const ctx = GqlExecutionContext.create(context);
    // const req = ctx.getContext().req;
    // console.log('graphql guard user', req && req.user);
    console.log({ parentCanActivate });
    return parentCanActivate;
  }

  getRequest(context: ExecutionContext) {
    console.log('---------------');
    console.log('JwtAuthGuard');
    console.log('getRequest(context: ExecutionContext)');
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  async validate(payload: any) {
    console.log('---------------');
    console.log('JwtAuthGuard');
    console.log('async validate(payload: any)');
    console.log({ payload });
    return { user: payload.user };
  }
}
