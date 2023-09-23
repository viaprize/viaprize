import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { Request } from 'express';
import { AuthTokenClaims, PrivyClient } from '@privy-io/server-auth';
import { ConfigService } from '@nestjs/config';
import { Exception } from 'handlebars';

import { UsersService } from 'src/users/users.service';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    private userService: UsersService,
  ) {}
  /**
   * This functions runs when you use the decorator UseGuard
   * @param {ExecutionContext} context This contains the https request objects which contains the headers
   * @returns {Promise<boolean>}
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }
    const appId = this.configService.getOrThrow<string>('PRIVY_APP_ID');
    const appSecret = this.configService.getOrThrow<string>('PRIVY_APP_SECRET');

    const privy = new PrivyClient(appId, appSecret);
    let verifiedClaims: AuthTokenClaims | null = null;
    try {
      verifiedClaims = await privy.verifyAuthToken(token);
    } catch (error) {
      console.log(`Token verification failed with error ${error}.`);
    }
    if (!verifiedClaims) {
      throw new HttpException('Token verification failed', HttpStatus.CONFLICT);
    }
    const admin = await this.userService.findOneByAuthId(verifiedClaims.userId);
    if (!admin.isAdmin) {
      throw new HttpException(
        'Only Admins can call this route ',
        HttpStatus.CONFLICT,
      );
    }

    request.user = verifiedClaims;
    return true;
  }

  /**
   * Simply extracts token from header request
   */
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
