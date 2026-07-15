/* tf_microservicio-interacciones/src/reportes/dto/reportes-payload.dto.ts */
import { Type } from 'class-transformer';
import { IsDefined, IsInt, Min, ValidateNested } from 'class-validator';
import { UpdateReporteDto } from './update-reporte.dto';

export class IdReportePayloadDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  IdReporte: number;
}

export class IdUsuarioReportesPayloadDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  IdUsuario: number;
}

export class ActualizarReportePayloadDto extends IdReportePayloadDto {
  @IsDefined()
  @ValidateNested()
  @Type(() => UpdateReporteDto)
  datosReporte: UpdateReporteDto;
}
