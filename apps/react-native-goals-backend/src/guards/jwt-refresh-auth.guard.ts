import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JsonWebTokenError } from '@nestjs/jwt';

@Injectable()
export class JwtRefreshAuthGuard extends AuthGuard('jwtRefresh') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('---------------');
    console.log('JwtRefreshAuthGuard');
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
    console.log('JwtRefreshAuthGuard');
    console.log('getRequest(context: ExecutionContext)');
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  handleRequest(err: any, user: any, info: any, context: any, status: any) {
    console.log('---------------');
    console.log('JwtRefreshAuthGuard');
    console.log(
      'handleRequest(err: any, user: any, info: any, context: any, status: any)',
    );
    console.log({
      err,
      user,
      info,
      context,
      contextReq: context.getRequest(),
      status,
    });
    if (info instanceof JsonWebTokenError) {
      throw new UnauthorizedException('Invalid JWT');
    }

    return super.handleRequest(err, user, info, context, status);
  }
}
