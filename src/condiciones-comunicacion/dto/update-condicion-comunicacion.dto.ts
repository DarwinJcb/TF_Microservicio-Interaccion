/* tf_microservicio-interacciones/src/condiciones-comunicacion/dto/update-condicion-comunicacion.dto.ts */
import { PartialType } from '@nestjs/mapped-types';
import { CreateCondicionComunicacionDto } from './create-condicion-comunicacion.dto';

export class UpdateCondicionComunicacionDto extends PartialType(CreateCondicionComunicacionDto) { }
