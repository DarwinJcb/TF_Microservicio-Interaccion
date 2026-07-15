/* tf_microservicio-interacciones/src/mensajes/dto/create-mensaje.dto.ts */
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateMensajeDto {
  @IsString()
  @IsNotEmpty()
  contenido: string;

  @IsInt()
  @Min(1)
  ChatFK: number;

  @IsInt()
  @Min(1)
  UsuarioEmisorFK: number;
}
