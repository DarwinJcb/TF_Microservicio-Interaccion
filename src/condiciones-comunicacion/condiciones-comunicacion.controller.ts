/* tf_microservicio-interacciones/src/condiciones-comunicacion/condiciones-comunicacion.controller.ts */
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CONDICIONES_COMUNICACION_PATTERNS } from './condiciones-comunicacion.patterns';
import { CondicionesComunicacionService } from './condiciones-comunicacion.service';
import { CreateCondicionComunicacionDto } from './dto/create-condicion-comunicacion.dto';
import {
  ActualizarCondicionComunicacionPayloadDto,
  IdCondicionComunicacionPayloadDto,
} from './dto/condiciones-comunicacion-payload.dto';

@Controller()
export class CondicionesComunicacionController {
  constructor(
    private readonly condicionesComunicacionService: CondicionesComunicacionService,
  ) {}

  @MessagePattern(CONDICIONES_COMUNICACION_PATTERNS.CREAR)
  create(
    @Payload()
    createCondicionComunicacionDto: CreateCondicionComunicacionDto,
  ) {
    return this.condicionesComunicacionService.create(
      createCondicionComunicacionDto,
    );
  }

  @MessagePattern(CONDICIONES_COMUNICACION_PATTERNS.LISTAR)
  findAll() {
    return this.condicionesComunicacionService.findAll();
  }

  @MessagePattern(CONDICIONES_COMUNICACION_PATTERNS.BUSCAR_POR_ID)
  findOne(
    @Payload()
    idCondicionComunicacionPayloadDto: IdCondicionComunicacionPayloadDto,
  ) {
    return this.condicionesComunicacionService.findOne(
      idCondicionComunicacionPayloadDto.IdCondicionComunicacion,
    );
  }

  @MessagePattern(CONDICIONES_COMUNICACION_PATTERNS.ACTUALIZAR)
  update(
    @Payload()
    actualizarCondicionComunicacionPayloadDto: ActualizarCondicionComunicacionPayloadDto,
  ) {
    return this.condicionesComunicacionService.update(
      actualizarCondicionComunicacionPayloadDto.IdCondicionComunicacion,
      actualizarCondicionComunicacionPayloadDto.datosCondicionComunicacion,
    );
  }

  @MessagePattern(CONDICIONES_COMUNICACION_PATTERNS.ELIMINAR)
  remove(
    @Payload()
    idCondicionComunicacionPayloadDto: IdCondicionComunicacionPayloadDto,
  ) {
    return this.condicionesComunicacionService.remove(
      idCondicionComunicacionPayloadDto.IdCondicionComunicacion,
    );
  }
}
