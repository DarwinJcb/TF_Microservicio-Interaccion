/* tf_microservicio-interacciones/src/reportes/reportes.controller.ts */
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateReporteDto } from './dto/create-reporte.dto';
import {
  ActualizarReportePayloadDto,
  IdReportePayloadDto,
  IdUsuarioReportesPayloadDto,
} from './dto/reportes-payload.dto';
import { REPORTES_PATTERNS } from './reportes.patterns';
import { ReportesService } from './reportes.service';

@Controller()
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) {}

  @MessagePattern(REPORTES_PATTERNS.CREAR)
  create(@Payload() createReporteDto: CreateReporteDto) {
    return this.reportesService.create(createReporteDto);
  }

  @MessagePattern(REPORTES_PATTERNS.LISTAR)
  findAll() {
    return this.reportesService.findAll();
  }

  @MessagePattern(REPORTES_PATTERNS.LISTAR_POR_REPORTANTE)
  findByReportante(
    @Payload()
    idUsuarioPayloadDto: IdUsuarioReportesPayloadDto,
  ) {
    return this.reportesService.findByReportante(idUsuarioPayloadDto.IdUsuario);
  }

  @MessagePattern(REPORTES_PATTERNS.LISTAR_POR_REPORTADO)
  findByReportado(
    @Payload()
    idUsuarioPayloadDto: IdUsuarioReportesPayloadDto,
  ) {
    return this.reportesService.findByReportado(idUsuarioPayloadDto.IdUsuario);
  }

  @MessagePattern(REPORTES_PATTERNS.BUSCAR_POR_ID)
  findOne(@Payload() idReportePayloadDto: IdReportePayloadDto) {
    return this.reportesService.findOne(idReportePayloadDto.IdReporte);
  }

  @MessagePattern(REPORTES_PATTERNS.ACTUALIZAR)
  update(
    @Payload()
    actualizarReportePayloadDto: ActualizarReportePayloadDto,
  ) {
    return this.reportesService.update(
      actualizarReportePayloadDto.IdReporte,
      actualizarReportePayloadDto.datosReporte,
    );
  }

  @MessagePattern(REPORTES_PATTERNS.ELIMINAR)
  remove(@Payload() idReportePayloadDto: IdReportePayloadDto) {
    return this.reportesService.remove(idReportePayloadDto.IdReporte);
  }
}
