import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JsonWebTokenError } from '@nestjs/jwt';
import { devModeLog } from 'dev-mode-log';

@Injectable()
export class JwtRefreshAuthGuard extends AuthGuard('jwtRefresh') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    devModeLog('---------------');
    devModeLog('JwtRefreshAuthGuard');
    devModeLog(' async canActivate(context: ExecutionContext)');
    const parentCanActivate = (await super.canActivate(context)) as boolean;
    // const ctx = GqlExecutionContext.create(context);
    // const req = ctx.getContext().req;
    // devModeLog('graphql guard user', req && req.user);
    devModeLog({ parentCanActivate });
    return parentCanActivate;
  }

  getRequest(context: ExecutionContext) {
    devModeLog('---------------');
    devModeLog('JwtRefreshAuthGuard');
    devModeLog('getRequest(context: ExecutionContext)');
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  handleRequest(err: any, user: any, info: any, context: any, status: any) {
    devModeLog('---------------');
    devModeLog('JwtRefreshAuthGuard');
    devModeLog(
      'handleRequest(err: any, user: any, info: any, context: any, status: any)',
    );
    devModeLog({
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
