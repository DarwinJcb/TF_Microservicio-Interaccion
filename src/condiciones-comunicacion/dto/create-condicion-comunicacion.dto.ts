/* tf_microservicio-interacciones/src/condiciones-comunicacion/dto/create-condicion-comunicacion.dto.ts */
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCondicionComunicacionDto {
    @IsString()
    @IsNotEmpty()
    descripcion: string;
}