/* tf_microservicio-interacciones/src/mensajes/mensajes.controller.ts */
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateMensajeDto } from './dto/create-mensaje.dto';
import {
  ActualizarMensajePayloadDto,
  IdChatMensajesPayloadDto,
  IdMensajePayloadDto,
  IdUsuarioMensajesPayloadDto,
} from './dto/mensajes-payload.dto';
import { MENSAJES_PATTERNS } from './mensajes.patterns';
import { MensajesService } from './mensajes.service';

@Controller()
export class MensajesController {
  constructor(private readonly mensajesService: MensajesService) {}

  @MessagePattern(MENSAJES_PATTERNS.CREAR)
  create(@Payload() createMensajeDto: CreateMensajeDto) {
    return this.mensajesService.create(createMensajeDto);
  }

  @MessagePattern(MENSAJES_PATTERNS.LISTAR)
  findAll() {
    return this.mensajesService.findAll();
  }

  @MessagePattern(MENSAJES_PATTERNS.LISTAR_POR_CHAT)
  findByChat(
    @Payload()
    idChatPayloadDto: IdChatMensajesPayloadDto,
  ) {
    return this.mensajesService.findByChat(idChatPayloadDto.IdChat);
  }

  @MessagePattern(MENSAJES_PATTERNS.LISTAR_POR_USUARIO)
  findByUsuario(
    @Payload()
    idUsuarioPayloadDto: IdUsuarioMensajesPayloadDto,
  ) {
    return this.mensajesService.findByUsuario(idUsuarioPayloadDto.IdUsuario);
  }

  @MessagePattern(MENSAJES_PATTERNS.BUSCAR_POR_ID)
  findOne(
    @Payload()
    idMensajePayloadDto: IdMensajePayloadDto,
  ) {
    return this.mensajesService.findOne(idMensajePayloadDto.IdMensaje);
  }

  @MessagePattern(MENSAJES_PATTERNS.ACTUALIZAR)
  update(
    @Payload()
    actualizarMensajePayloadDto: ActualizarMensajePayloadDto,
  ) {
    return this.mensajesService.update(
      actualizarMensajePayloadDto.IdMensaje,
      actualizarMensajePayloadDto.datosMensaje,
    );
  }

  @MessagePattern(MENSAJES_PATTERNS.ELIMINAR)
  remove(
    @Payload()
    idMensajePayloadDto: IdMensajePayloadDto,
  ) {
    return this.mensajesService.remove(idMensajePayloadDto.IdMensaje);
  }
}
