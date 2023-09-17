import { CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
export declare class AdminAuthGuard implements CanActivate {
    private configService;
    private userService;
    constructor(configService: ConfigService, userService: UsersService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private extractTokenFromHeader;
}
