import { PartialType } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { CreatePortalDto } from './create-portal.dto';

export class UpdatePortalDto extends PartialType(CreatePortalDto) {
  @IsNumber()
  @IsOptional()
  platformFeePercentage: number;
}
