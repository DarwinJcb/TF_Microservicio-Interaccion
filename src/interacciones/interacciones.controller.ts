/* tf_microservicio-interacciones/src/interacciones/interacciones.controller.ts */
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateInteraccionDto } from './dto/create-interaccion.dto';
import {
  ActualizarInteraccionPayloadDto,
  IdInteraccionPayloadDto,
  IdUsuarioInteraccionesPayloadDto,
} from './dto/interacciones-payload.dto';
import { INTERACCIONES_PATTERNS } from './interacciones.patterns';
import { InteraccionesService } from './interacciones.service';

@Controller()
export class InteraccionesController {
  constructor(private readonly interaccionesService: InteraccionesService) {}

  @MessagePattern(INTERACCIONES_PATTERNS.CREAR)
  create(@Payload() createInteraccionDto: CreateInteraccionDto) {
    return this.interaccionesService.create(createInteraccionDto);
  }

  @MessagePattern(INTERACCIONES_PATTERNS.LISTAR)
  findAll() {
    return this.interaccionesService.findAll();
  }

  @MessagePattern(INTERACCIONES_PATTERNS.LISTAR_POR_EMISOR)
  findByEmisor(
    @Payload()
    idUsuarioPayloadDto: IdUsuarioInteraccionesPayloadDto,
  ) {
    return this.interaccionesService.findByEmisor(
      idUsuarioPayloadDto.IdUsuario,
    );
  }

  @MessagePattern(INTERACCIONES_PATTERNS.LISTAR_POR_RECEPTOR)
  findByReceptor(
    @Payload()
    idUsuarioPayloadDto: IdUsuarioInteraccionesPayloadDto,
  ) {
    return this.interaccionesService.findByReceptor(
      idUsuarioPayloadDto.IdUsuario,
    );
  }

  @MessagePattern(INTERACCIONES_PATTERNS.BUSCAR_POR_ID)
  findOne(
    @Payload()
    idInteraccionPayloadDto: IdInteraccionPayloadDto,
  ) {
    return this.interaccionesService.findOne(
      idInteraccionPayloadDto.IdInteraccion,
    );
  }

  @MessagePattern(INTERACCIONES_PATTERNS.ACTUALIZAR)
  update(
    @Payload()
    actualizarInteraccionPayloadDto: ActualizarInteraccionPayloadDto,
  ) {
    return this.interaccionesService.update(
      actualizarInteraccionPayloadDto.IdInteraccion,
      actualizarInteraccionPayloadDto.datosInteraccion,
    );
  }

  @MessagePattern(INTERACCIONES_PATTERNS.ELIMINAR)
  remove(
    @Payload()
    idInteraccionPayloadDto: IdInteraccionPayloadDto,
  ) {
    return this.interaccionesService.remove(
      idInteraccionPayloadDto.IdInteraccion,
    );
  }
}
