import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ENVIRONMENTS } from 'src/app.environments';
import * as jwt from 'jsonwebtoken';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const token = context.switchToHttp().getRequest().headers.authorization.split(' ')[1];
      jwt.verify(token, ENVIRONMENTS.secretKey);
      return true;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
