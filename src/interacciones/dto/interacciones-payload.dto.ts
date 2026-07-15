/* tf_microservicio-interacciones/src/interacciones/dto/interacciones-payload.dto.ts */
import { Type } from 'class-transformer';
import { IsDefined, IsInt, Min, ValidateNested } from 'class-validator';
import { UpdateInteraccionDto } from './update-interaccion.dto';

export class IdInteraccionPayloadDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  IdInteraccion: number;
}

export class IdUsuarioInteraccionesPayloadDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  IdUsuario: number;
}

export class ActualizarInteraccionPayloadDto extends IdInteraccionPayloadDto {
  @IsDefined()
  @ValidateNested()
  @Type(() => UpdateInteraccionDto)
  datosInteraccion: UpdateInteraccionDto;
}
