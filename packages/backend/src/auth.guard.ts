import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { Request } from 'express';
import { PrivyClient } from '@privy-io/server-auth';
import { ConfigService } from '@nestjs/config';
import { Exception } from 'handlebars';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    const appId = this.configService.getOrThrow<string>('PRIVY_APP_ID');
    const appSecret = this.configService.getOrThrow<string>('PRIVY_APP_SECRET');

    const privy = new PrivyClient(appId, appSecret);
    try {
      const verifiedClaims = await privy.verifyAuthToken(token);
      request.user = verifiedClaims;
    } catch (error) {
      console.log(`Token verification failed with error ${error}.`);
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    if (!request?.headers?.authorization) {
      throw new Exception('No authorization header found');
    }
    const authToken = request?.headers?.authorization.replace('Bearer ', '');
    if (!authToken) {
      throw new Exception('No auth token found');
    }
    return authToken;
  }
}
