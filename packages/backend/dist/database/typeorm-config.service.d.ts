import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { AllConfigType } from 'src/config/config.type';
export declare class TypeOrmConfigService implements TypeOrmOptionsFactory {
    private configService;
    constructor(configService: ConfigService<AllConfigType>);
    createTypeOrmOptions(): TypeOrmModuleOptions;
}
