import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateExtraPrizeDto {
  @IsNumber()
  @IsOptional()
  fundsUsd?: number;

  @IsNumber()
  @IsOptional()
  fundsInBtc?: number;

  @IsNumber()
  @IsOptional()
  fundsInEth?: number;

  @IsNumber()
  @IsOptional()
  fundsInSol?: number;

  @IsString()
  @IsNotEmpty()
  externalId: string;
}
