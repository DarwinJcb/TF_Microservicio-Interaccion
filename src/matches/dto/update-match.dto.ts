/* tf_microservicio-interacciones/src/matches/dto/update-match.dto.ts */
import { PartialType } from '@nestjs/mapped-types';
import { CreateMatchDto } from './create-match.dto';

export class UpdateMatchDto extends PartialType(CreateMatchDto) {}
