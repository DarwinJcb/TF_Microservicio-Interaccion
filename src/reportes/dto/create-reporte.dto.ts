/* tf_microservicio-interacciones/src/reportes/dto/create-reporte.dto.ts */
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateReporteDto {
  @IsString()
  @IsNotEmpty()
  motivo: string;

  @IsInt()
  @Min(1)
  UsuarioReportanteFK: number;

  @IsInt()
  @Min(1)
  UsuarioReportadoFK: number;
}
