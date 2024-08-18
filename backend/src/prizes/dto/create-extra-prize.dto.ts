import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateExtraPrizeDto {
  @IsNumber()
  @IsNotEmpty()
  fundsUsd: number;

  @IsNumber()
  @IsNotEmpty()
  fundsInBtc: number;

  @IsNumber()
  @IsNotEmpty()
  fundsInEth: number;

  @IsNumber()
  @IsNotEmpty()
  fundsInSol: number;

  @IsString()
  @IsNotEmpty()
  externalId: string;
}
