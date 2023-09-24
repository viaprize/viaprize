import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { PrivyClient } from '@privy-io/server-auth';
import { Request } from 'express';
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
    const appId = this.configService.getOrThrow<string>('PRIVY_APP_ID', {
      infer: true,
    });
    const appSecret = this.configService.getOrThrow<string>(
      'PRIVY_APP_SECRET',
      {
        infer: true,
      },
    );

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
    console.log(request.headers, 'header');
    if (!request?.headers?.authorization) {
      throw new HttpException(
        'No authorization header found',
        HttpStatus.FORBIDDEN,
      );
    }

    const authToken = request?.headers?.authorization.replace('Bearer ', '');
    if (!authToken) {
      throw new Exception('No auth token found');
    }
    return authToken;
  }
}
