import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateExtraDonationPrizeDataDto {
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
