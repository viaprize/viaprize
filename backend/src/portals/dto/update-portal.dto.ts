import { PartialType } from '@nestjs/swagger';
import { CreatePortalDto } from './create-portal.dto';

export class UpdatePortalDto extends PartialType(CreatePortalDto) {}
