import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateExtraPrizeDto {
  @IsOptional()
  fundsUsd?: string;

  @IsOptional()
  fundsInBtc?: string;

  @IsOptional()
  fundsInEth?: string;

  @IsOptional()
  fundsInSol?: string;

  @IsString()
  @IsNotEmpty()
  externalId: string;
}
