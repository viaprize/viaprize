import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateExtraDonationPrizeDataDto {
  @IsDate()
  @IsNotEmpty()
  donatedAt: Date;

  @IsString()
  @IsNotEmpty()
  donor: string;

  @IsNumber()
  @IsNotEmpty()
  value: number;

  @IsString()
  @IsNotEmpty()
  valueIn: string;

  @IsString()
  @IsNotEmpty()
  externalId: string;
}
