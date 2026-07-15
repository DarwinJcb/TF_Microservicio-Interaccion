/* tf_microservicio-interacciones/src/interacciones/dto/create-interaccion.dto.ts */
import { IsEnum, IsInt, Min } from 'class-validator';
import { TipoInteraccion } from '../../generated/prisma/enums';

export class CreateInteraccionDto {
    @IsEnum(TipoInteraccion)
    tipoInteraccion: TipoInteraccion;

    @IsInt()
    @Min(1)
    UsuarioEmisorFK: number;

    @IsInt()
    @Min(1)
    UsuarioReceptorFK: number;
}