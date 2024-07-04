import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthEntity } from '../authEntity/authEntity';

export const GetUser = createParamDecorator(
  (data, ctx: ExecutionContext): AuthEntity => {
    console.log('333');
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
