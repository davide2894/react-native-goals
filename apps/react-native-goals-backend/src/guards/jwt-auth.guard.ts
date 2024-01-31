import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JsonWebTokenError } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { devModeLog } from 'dev-mode-log';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    devModeLog('---------------');
    devModeLog('JwtAuthGuard');
    devModeLog(' async canActivate(context: ExecutionContext)');
    const parentCanActivate = (await super.canActivate(context)) as boolean;
    devModeLog({ parentCanActivate });
    return parentCanActivate;
  }

  getRequest(context: ExecutionContext) {
    devModeLog('---------------');
    devModeLog('JwtAuthGuard');
    devModeLog('getRequest(context: ExecutionContext)');
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  handleRequest(err: any, user: any, info: any, context: any, status: any) {
    devModeLog('---------------');
    devModeLog('JwtAuthGuard');
    devModeLog(
      'handleRequest(err: any, user: any, info: any, context: any, status: any)',
    );
    devModeLog({
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

  async validate(payload: any) {
    devModeLog('---------------');
    devModeLog('JwtAuthGuard');
    devModeLog('async validate(payload: any)');
    devModeLog({ payload });
    return { user: payload.user };
  }
}
