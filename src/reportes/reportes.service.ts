/* tf_microservicio-interacciones/src/reportes/reportes.service.ts */
import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaService } from '../prisma/prisma.service';
import { UsuariosRemotosService } from '../usuarios-remotos/usuarios-remotos.service';
import { CreateReporteDto } from './dto/create-reporte.dto';
import { UpdateReporteDto } from './dto/update-reporte.dto';

@Injectable()
export class ReportesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usuariosRemotosService: UsuariosRemotosService,
  ) {}

  async create(createReporteDto: CreateReporteDto) {
    const { UsuarioReportanteFK, UsuarioReportadoFK } = createReporteDto;

    this.verificarUsuariosDiferentes(UsuarioReportanteFK, UsuarioReportadoFK);

    const [usuarioReportante, usuarioReportado] = await Promise.all([
      this.usuariosRemotosService.obtenerUsuario(UsuarioReportanteFK),
      this.usuariosRemotosService.obtenerUsuario(UsuarioReportadoFK),
    ]);

    const reporte = await this.prisma.reporte.create({
      data: createReporteDto,
    });

    return {
      ...reporte,
      usuarioReportante,
      usuarioReportado,
    };
  }

  async findAll() {
    const reportes = await this.prisma.reporte.findMany({
      orderBy: {
        fechaReporte: 'desc',
      },
    });

    if (reportes.length === 0) {
      return [];
    }

    const usuariosPorId =
      await this.usuariosRemotosService.obtenerUsuariosPorIds(
        reportes.flatMap((reporte) => [
          reporte.UsuarioReportanteFK,
          reporte.UsuarioReportadoFK,
        ]),
      );

    return reportes.map((reporte) => ({
      ...reporte,
      usuarioReportante: usuariosPorId.get(reporte.UsuarioReportanteFK) ?? null,
      usuarioReportado: usuariosPorId.get(reporte.UsuarioReportadoFK) ?? null,
    }));
  }

  async findByReportante(idUsuario: number) {
    const usuarioReportante =
      await this.usuariosRemotosService.obtenerUsuario(idUsuario);

    const reportes = await this.prisma.reporte.findMany({
      where: {
        UsuarioReportanteFK: idUsuario,
      },
      orderBy: {
        fechaReporte: 'desc',
      },
    });

    const usuariosPorId =
      await this.usuariosRemotosService.obtenerUsuariosPorIds(
        reportes.map((reporte) => reporte.UsuarioReportadoFK),
      );

    return reportes.map((reporte) => ({
      ...reporte,
      usuarioReportante,
      usuarioReportado: usuariosPorId.get(reporte.UsuarioReportadoFK) ?? null,
    }));
  }

  async findByReportado(idUsuario: number) {
    const usuarioReportado =
      await this.usuariosRemotosService.obtenerUsuario(idUsuario);

    const reportes = await this.prisma.reporte.findMany({
      where: {
        UsuarioReportadoFK: idUsuario,
      },
      orderBy: {
        fechaReporte: 'desc',
      },
    });

    const usuariosPorId =
      await this.usuariosRemotosService.obtenerUsuariosPorIds(
        reportes.map((reporte) => reporte.UsuarioReportanteFK),
      );

    return reportes.map((reporte) => ({
      ...reporte,
      usuarioReportante: usuariosPorId.get(reporte.UsuarioReportanteFK) ?? null,
      usuarioReportado,
    }));
  }

  async findOne(id: number) {
    const reporte = await this.obtenerReporte(id);

    const [usuarioReportante, usuarioReportado] = await Promise.all([
      this.usuariosRemotosService.obtenerUsuario(reporte.UsuarioReportanteFK),
      this.usuariosRemotosService.obtenerUsuario(reporte.UsuarioReportadoFK),
    ]);

    return {
      ...reporte,
      usuarioReportante,
      usuarioReportado,
    };
  }

  async update(id: number, updateReporteDto: UpdateReporteDto) {
    const reporteActual = await this.obtenerReporte(id);

    const idUsuarioReportante =
      updateReporteDto.UsuarioReportanteFK ?? reporteActual.UsuarioReportanteFK;

    const idUsuarioReportado =
      updateReporteDto.UsuarioReportadoFK ?? reporteActual.UsuarioReportadoFK;

    this.verificarUsuariosDiferentes(idUsuarioReportante, idUsuarioReportado);

    const [usuarioReportante, usuarioReportado] = await Promise.all([
      this.usuariosRemotosService.obtenerUsuario(idUsuarioReportante),
      this.usuariosRemotosService.obtenerUsuario(idUsuarioReportado),
    ]);

    const reporteActualizado = await this.prisma.reporte.update({
      where: {
        IdReporte: id,
      },
      data: updateReporteDto,
    });

    return {
      ...reporteActualizado,
      usuarioReportante,
      usuarioReportado,
    };
  }

  async remove(id: number) {
    await this.obtenerReporte(id);

    return this.prisma.reporte.delete({
      where: {
        IdReporte: id,
      },
    });
  }

  private async obtenerReporte(idReporte: number) {
    const reporte = await this.prisma.reporte.findUnique({
      where: {
        IdReporte: idReporte,
      },
    });

    if (!reporte) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: `No existe un reporte con el ID ${idReporte}.`,
        error: 'Not Found',
      });
    }

    return reporte;
  }

  private verificarUsuariosDiferentes(
    idUsuarioReportante: number,
    idUsuarioReportado: number,
  ): void {
    if (idUsuarioReportante === idUsuarioReportado) {
      throw new RpcException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Un usuario no puede reportarse a sí mismo.',
        error: 'Bad Request',
      });
    }
  }
}
