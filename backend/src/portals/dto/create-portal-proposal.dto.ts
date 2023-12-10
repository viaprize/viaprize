import { Expose } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePortalProposalDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  description: string;

  @Expose()
  @IsNumber()
  @IsOptional()
  fundingGoal?: number;

  @Expose()
  @IsBoolean()
  isMultiSignatureReciever: boolean;

  @Expose()
  @IsBoolean()
  sendImmediately: boolean;

  @Expose()
  @IsDateString()
  @IsOptional()
  deadline?: Date;

  @Expose()
  @IsBoolean()
  allowDonationAboveThreshold: boolean;

  @Expose()
  @IsString()
  @IsNotEmpty()
  termsAndCondition: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  proposerAddress: string;

  @Expose()
  @IsArray()
  @IsNotEmpty()
  treasurers: string[];

  @Expose()
  @IsArray()
  @IsNotEmpty()
  tags: string[];

  @Expose()
  @IsArray()
  @IsNotEmpty()
  images: string[];

  @Expose()
  @IsString()
  @IsNotEmpty()
  title: string;
}
