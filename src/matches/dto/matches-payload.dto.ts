/* tf_microservicio-interacciones/src/matches/dto/matches-payload.dto.ts */
import { Type } from 'class-transformer';
import { IsDefined, IsInt, Min, ValidateNested } from 'class-validator';
import { UpdateMatchDto } from './update-match.dto';

export class IdMatchPayloadDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  IdMatch: number;
}

export class IdUsuarioMatchesPayloadDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  IdUsuario: number;
}

export class ActualizarMatchPayloadDto extends IdMatchPayloadDto {
  @IsDefined()
  @ValidateNested()
  @Type(() => UpdateMatchDto)
  datosMatch: UpdateMatchDto;
}
