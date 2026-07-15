/* tf_microservicio-interacciones/src/matches/matches.controller.ts */
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateMatchDto } from './dto/create-match.dto';
import {
  ActualizarMatchPayloadDto,
  IdMatchPayloadDto,
  IdUsuarioMatchesPayloadDto,
} from './dto/matches-payload.dto';
import { MATCHES_PATTERNS } from './matches.patterns';
import { MatchesService } from './matches.service';

@Controller()
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @MessagePattern(MATCHES_PATTERNS.CREAR)
  create(@Payload() createMatchDto: CreateMatchDto) {
    return this.matchesService.create(createMatchDto);
  }

  @MessagePattern(MATCHES_PATTERNS.LISTAR)
  findAll() {
    return this.matchesService.findAll();
  }

  @MessagePattern(MATCHES_PATTERNS.LISTAR_POR_USUARIO)
  findByUsuario(
    @Payload()
    idUsuarioPayloadDto: IdUsuarioMatchesPayloadDto,
  ) {
    return this.matchesService.findByUsuario(idUsuarioPayloadDto.IdUsuario);
  }

  @MessagePattern(MATCHES_PATTERNS.BUSCAR_POR_ID)
  findOne(@Payload() idMatchPayloadDto: IdMatchPayloadDto) {
    return this.matchesService.findOne(idMatchPayloadDto.IdMatch);
  }

  @MessagePattern(MATCHES_PATTERNS.ACTUALIZAR)
  update(
    @Payload()
    actualizarMatchPayloadDto: ActualizarMatchPayloadDto,
  ) {
    return this.matchesService.update(
      actualizarMatchPayloadDto.IdMatch,
      actualizarMatchPayloadDto.datosMatch,
    );
  }

  @MessagePattern(MATCHES_PATTERNS.ELIMINAR)
  remove(@Payload() idMatchPayloadDto: IdMatchPayloadDto) {
    return this.matchesService.remove(idMatchPayloadDto.IdMatch);
  }
}
