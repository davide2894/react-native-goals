import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class JwtRefreshAuthGuard extends AuthGuard('jwtRefresh') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    Logger.log('JwtRefreshAuthGuard');
    Logger.log({ ctxReq: ctx.getContext().req });
    return ctx.getContext().req;
  }
}
