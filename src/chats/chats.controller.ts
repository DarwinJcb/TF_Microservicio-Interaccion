/* tf_microservicio-interacciones/src/chats/chats.controller.ts */
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CHATS_PATTERNS } from './chats.patterns';
import { ChatsService } from './chats.service';
import {
  ActualizarChatPayloadDto,
  IdChatPayloadDto,
  IdMatchChatsPayloadDto,
} from './dto/chats-payload.dto';
import { CreateChatDto } from './dto/create-chat.dto';

@Controller()
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) { }

  @MessagePattern(CHATS_PATTERNS.CREAR)
  create(@Payload() createChatDto: CreateChatDto) {
    return this.chatsService.create(createChatDto);
  }

  @MessagePattern(CHATS_PATTERNS.LISTAR)
  findAll() {
    return this.chatsService.findAll();
  }

  @MessagePattern(CHATS_PATTERNS.LISTAR_POR_MATCH)
  findByMatch(
    @Payload()
    idMatchPayloadDto: IdMatchChatsPayloadDto,
  ) {
    return this.chatsService.findByMatch(idMatchPayloadDto.IdMatch);
  }

  @MessagePattern(CHATS_PATTERNS.BUSCAR_POR_ID)
  findOne(@Payload() idChatPayloadDto: IdChatPayloadDto) {
    return this.chatsService.findOne(idChatPayloadDto.IdChat);
  }

  @MessagePattern(CHATS_PATTERNS.ACTUALIZAR)
  update(
    @Payload()
    actualizarChatPayloadDto: ActualizarChatPayloadDto,
  ) {
    return this.chatsService.update(
      actualizarChatPayloadDto.IdChat,
      actualizarChatPayloadDto.datosChat,
    );
  }

  @MessagePattern(CHATS_PATTERNS.ELIMINAR)
  remove(@Payload() idChatPayloadDto: IdChatPayloadDto) {
    return this.chatsService.remove(idChatPayloadDto.IdChat);
  }
}