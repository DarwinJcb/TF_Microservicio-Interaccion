/* tf_microservicio-interacciones/src/condiciones-comunicacion/dto/condiciones-comunicacion-payload.dto.ts */
import { Type } from 'class-transformer';
import { IsDefined, IsInt, Min, ValidateNested } from 'class-validator';
import { UpdateCondicionComunicacionDto } from './update-condicion-comunicacion.dto';

export class IdCondicionComunicacionPayloadDto {
    @Type(() => Number)
    @IsInt()
    @Min(1)
    IdCondicionComunicacion: number;
}

export class ActualizarCondicionComunicacionPayloadDto extends IdCondicionComunicacionPayloadDto {
    @IsDefined()
    @ValidateNested()
    @Type(() => UpdateCondicionComunicacionDto)
    datosCondicionComunicacion: UpdateCondicionComunicacionDto;
}