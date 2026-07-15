/* tf_microservicio-interacciones/src/mensajes/dto/mensajes-payload.dto.ts */
import { Type } from 'class-transformer';
import { IsDefined, IsInt, Min, ValidateNested } from 'class-validator';
import { UpdateMensajeDto } from './update-mensaje.dto';

export class IdMensajePayloadDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  IdMensaje: number;
}

export class IdChatMensajesPayloadDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  IdChat: number;
}

export class IdUsuarioMensajesPayloadDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  IdUsuario: number;
}

export class ActualizarMensajePayloadDto extends IdMensajePayloadDto {
  @IsDefined()
  @ValidateNested()
  @Type(() => UpdateMensajeDto)
  datosMensaje: UpdateMensajeDto;
}
