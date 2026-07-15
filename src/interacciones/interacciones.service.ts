/* tf_microservicio-interacciones/src/interacciones/interacciones.service.ts */
import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaService } from '../prisma/prisma.service';
import { UsuariosRemotosService } from '../usuarios-remotos/usuarios-remotos.service';
import { CreateInteraccionDto } from './dto/create-interaccion.dto';
import { UpdateInteraccionDto } from './dto/update-interaccion.dto';

@Injectable()
export class InteraccionesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usuariosRemotosService: UsuariosRemotosService,
  ) {}

  async create(createInteraccionDto: CreateInteraccionDto) {
    const { UsuarioEmisorFK, UsuarioReceptorFK } = createInteraccionDto;

    this.verificarUsuariosDiferentes(UsuarioEmisorFK, UsuarioReceptorFK);

    const [usuarioEmisor, usuarioReceptor] = await Promise.all([
      this.usuariosRemotosService.obtenerUsuario(UsuarioEmisorFK),
      this.usuariosRemotosService.obtenerUsuario(UsuarioReceptorFK),
    ]);

    const interaccionExistente = await this.prisma.interaccion.findFirst({
      where: {
        UsuarioEmisorFK,
        UsuarioReceptorFK,
      },
      select: {
        IdInteraccion: true,
      },
    });

    if (interaccionExistente) {
      throw new RpcException({
        statusCode: HttpStatus.CONFLICT,
        message:
          `El usuario ${UsuarioEmisorFK} ya registró una interacción ` +
          `con el usuario ${UsuarioReceptorFK}.`,
        error: 'Conflict',
      });
    }

    const interaccion = await this.prisma.interaccion.create({
      data: createInteraccionDto,
    });

    return {
      ...interaccion,
      usuarioEmisor,
      usuarioReceptor,
    };
  }

  async findAll() {
    const interacciones = await this.prisma.interaccion.findMany({
      orderBy: {
        fechaInteraccion: 'desc',
      },
    });

    if (interacciones.length === 0) {
      return [];
    }

    const usuariosPorId =
      await this.usuariosRemotosService.obtenerUsuariosPorIds(
        interacciones.flatMap((interaccion) => [
          interaccion.UsuarioEmisorFK,
          interaccion.UsuarioReceptorFK,
        ]),
      );

    return interacciones.map((interaccion) => ({
      ...interaccion,
      usuarioEmisor: usuariosPorId.get(interaccion.UsuarioEmisorFK) ?? null,
      usuarioReceptor: usuariosPorId.get(interaccion.UsuarioReceptorFK) ?? null,
    }));
  }

  async findByEmisor(idUsuario: number) {
    const usuarioEmisor =
      await this.usuariosRemotosService.obtenerUsuario(idUsuario);

    const interacciones = await this.prisma.interaccion.findMany({
      where: {
        UsuarioEmisorFK: idUsuario,
      },
      orderBy: {
        fechaInteraccion: 'desc',
      },
    });

    const usuariosPorId =
      await this.usuariosRemotosService.obtenerUsuariosPorIds(
        interacciones.map((interaccion) => interaccion.UsuarioReceptorFK),
      );

    return interacciones.map((interaccion) => ({
      ...interaccion,
      usuarioEmisor,
      usuarioReceptor: usuariosPorId.get(interaccion.UsuarioReceptorFK) ?? null,
    }));
  }

  async findByReceptor(idUsuario: number) {
    const usuarioReceptor =
      await this.usuariosRemotosService.obtenerUsuario(idUsuario);

    const interacciones = await this.prisma.interaccion.findMany({
      where: {
        UsuarioReceptorFK: idUsuario,
      },
      orderBy: {
        fechaInteraccion: 'desc',
      },
    });

    const usuariosPorId =
      await this.usuariosRemotosService.obtenerUsuariosPorIds(
        interacciones.map((interaccion) => interaccion.UsuarioEmisorFK),
      );

    return interacciones.map((interaccion) => ({
      ...interaccion,
      usuarioEmisor: usuariosPorId.get(interaccion.UsuarioEmisorFK) ?? null,
      usuarioReceptor,
    }));
  }

  async findOne(id: number) {
    const interaccion = await this.obtenerInteraccion(id);

    const [usuarioEmisor, usuarioReceptor] = await Promise.all([
      this.usuariosRemotosService.obtenerUsuario(interaccion.UsuarioEmisorFK),
      this.usuariosRemotosService.obtenerUsuario(interaccion.UsuarioReceptorFK),
    ]);

    return {
      ...interaccion,
      usuarioEmisor,
      usuarioReceptor,
    };
  }

  async update(id: number, updateInteraccionDto: UpdateInteraccionDto) {
    const interaccionActual = await this.obtenerInteraccion(id);

    const idUsuarioEmisor =
      updateInteraccionDto.UsuarioEmisorFK ?? interaccionActual.UsuarioEmisorFK;

    const idUsuarioReceptor =
      updateInteraccionDto.UsuarioReceptorFK ??
      interaccionActual.UsuarioReceptorFK;

    this.verificarUsuariosDiferentes(idUsuarioEmisor, idUsuarioReceptor);

    const [usuarioEmisor, usuarioReceptor] = await Promise.all([
      this.usuariosRemotosService.obtenerUsuario(idUsuarioEmisor),
      this.usuariosRemotosService.obtenerUsuario(idUsuarioReceptor),
    ]);

    const interaccionDuplicada = await this.prisma.interaccion.findFirst({
      where: {
        UsuarioEmisorFK: idUsuarioEmisor,
        UsuarioReceptorFK: idUsuarioReceptor,
        NOT: {
          IdInteraccion: id,
        },
      },
      select: {
        IdInteraccion: true,
      },
    });

    if (interaccionDuplicada) {
      throw new RpcException({
        statusCode: HttpStatus.CONFLICT,
        message:
          `El usuario ${idUsuarioEmisor} ya registró una interacción ` +
          `con el usuario ${idUsuarioReceptor}.`,
        error: 'Conflict',
      });
    }

    const interaccionActualizada = await this.prisma.interaccion.update({
      where: {
        IdInteraccion: id,
      },
      data: updateInteraccionDto,
    });

    return {
      ...interaccionActualizada,
      usuarioEmisor,
      usuarioReceptor,
    };
  }

  async remove(id: number) {
    await this.obtenerInteraccion(id);

    return this.prisma.interaccion.delete({
      where: {
        IdInteraccion: id,
      },
    });
  }

  private async obtenerInteraccion(id: number) {
    const interaccion = await this.prisma.interaccion.findUnique({
      where: {
        IdInteraccion: id,
      },
    });

    if (!interaccion) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: `No existe una interacción con el ID ${id}.`,
        error: 'Not Found',
      });
    }

    return interaccion;
  }

  private verificarUsuariosDiferentes(
    idUsuarioEmisor: number,
    idUsuarioReceptor: number,
  ): void {
    if (idUsuarioEmisor === idUsuarioReceptor) {
      throw new RpcException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Un usuario no puede interactuar consigo mismo.',
        error: 'Bad Request',
      });
    }
  }
}
