/* tf_microservicio-interacciones/src/matches/matches.service.ts */
import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { TipoInteraccion } from '../generated/prisma/enums';
import { PrismaService } from '../prisma/prisma.service';
import { UsuariosRemotosService } from '../usuarios-remotos/usuarios-remotos.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';

@Injectable()
export class MatchesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usuariosRemotosService: UsuariosRemotosService,
  ) {}

  async create(createMatchDto: CreateMatchDto) {
    const { UsuarioUnoFK, UsuarioDosFK } = createMatchDto;

    this.verificarUsuariosDiferentes(UsuarioUnoFK, UsuarioDosFK);

    const [usuarioUno, usuarioDos] = await Promise.all([
      this.usuariosRemotosService.obtenerUsuario(UsuarioUnoFK),
      this.usuariosRemotosService.obtenerUsuario(UsuarioDosFK),
    ]);

    await this.verificarInteraccionesMutuas(UsuarioUnoFK, UsuarioDosFK);
    await this.verificarMatchDuplicado(UsuarioUnoFK, UsuarioDosFK);

    const match = await this.prisma.match.create({
      data: createMatchDto,
    });

    return {
      ...match,
      usuarioUno,
      usuarioDos,
    };
  }

  async findAll() {
    const matches = await this.prisma.match.findMany({
      include: {
        Chat: true,
      },
    });

    if (matches.length === 0) {
      return [];
    }

    const usuariosPorId =
      await this.usuariosRemotosService.obtenerUsuariosPorIds(
        matches.flatMap((match) => [match.UsuarioUnoFK, match.UsuarioDosFK]),
      );

    return matches.map((match) => {
      const { Chat, ...datosMatch } = match;

      return {
        ...datosMatch,
        chat: Chat,
        usuarioUno: usuariosPorId.get(match.UsuarioUnoFK) ?? null,
        usuarioDos: usuariosPorId.get(match.UsuarioDosFK) ?? null,
      };
    });
  }

  async findByUsuario(idUsuario: number) {
    await this.usuariosRemotosService.asegurarUsuarioExiste(idUsuario);

    const matches = await this.prisma.match.findMany({
      where: {
        OR: [
          {
            UsuarioUnoFK: idUsuario,
          },
          {
            UsuarioDosFK: idUsuario,
          },
        ],
      },
      include: {
        Chat: true,
      },
    });

    const usuariosPorId =
      await this.usuariosRemotosService.obtenerUsuariosPorIds(
        matches.flatMap((match) => [match.UsuarioUnoFK, match.UsuarioDosFK]),
      );

    return matches.map((match) => {
      const { Chat, ...datosMatch } = match;

      return {
        ...datosMatch,
        chat: Chat,
        usuarioUno: usuariosPorId.get(match.UsuarioUnoFK) ?? null,
        usuarioDos: usuariosPorId.get(match.UsuarioDosFK) ?? null,
      };
    });
  }

  async findOne(id: number) {
    const match = await this.obtenerMatch(id);

    const [usuarioUno, usuarioDos] = await Promise.all([
      this.usuariosRemotosService.obtenerUsuario(match.UsuarioUnoFK),
      this.usuariosRemotosService.obtenerUsuario(match.UsuarioDosFK),
    ]);

    const { Chat, ...datosMatch } = match;

    return {
      ...datosMatch,
      chat: Chat,
      usuarioUno,
      usuarioDos,
    };
  }

  async update(id: number, updateMatchDto: UpdateMatchDto) {
    const matchActual = await this.obtenerMatch(id);

    const cambiaUsuarioUno =
      updateMatchDto.UsuarioUnoFK !== undefined &&
      updateMatchDto.UsuarioUnoFK !== matchActual.UsuarioUnoFK;

    const cambiaUsuarioDos =
      updateMatchDto.UsuarioDosFK !== undefined &&
      updateMatchDto.UsuarioDosFK !== matchActual.UsuarioDosFK;

    if (matchActual.Chat && (cambiaUsuarioUno || cambiaUsuarioDos)) {
      throw new RpcException({
        statusCode: HttpStatus.CONFLICT,
        message:
          'No se pueden modificar los usuarios del match porque ya tiene un chat asociado.',
        error: 'Conflict',
      });
    }

    const idUsuarioUno =
      updateMatchDto.UsuarioUnoFK ?? matchActual.UsuarioUnoFK;

    const idUsuarioDos =
      updateMatchDto.UsuarioDosFK ?? matchActual.UsuarioDosFK;

    this.verificarUsuariosDiferentes(idUsuarioUno, idUsuarioDos);

    const [usuarioUno, usuarioDos] = await Promise.all([
      this.usuariosRemotosService.obtenerUsuario(idUsuarioUno),
      this.usuariosRemotosService.obtenerUsuario(idUsuarioDos),
    ]);

    await this.verificarInteraccionesMutuas(idUsuarioUno, idUsuarioDos);
    await this.verificarMatchDuplicado(idUsuarioUno, idUsuarioDos, id);

    const matchActualizado = await this.prisma.match.update({
      where: {
        IdMatch: id,
      },
      data: updateMatchDto,
      include: {
        Chat: true,
      },
    });

    const { Chat, ...datosMatch } = matchActualizado;

    return {
      ...datosMatch,
      chat: Chat,
      usuarioUno,
      usuarioDos,
    };
  }

  async remove(id: number) {
    const match = await this.obtenerMatch(id);

    if (match.Chat) {
      throw new RpcException({
        statusCode: HttpStatus.CONFLICT,
        message:
          'No se puede eliminar el match porque ya tiene un chat asociado.',
        error: 'Conflict',
      });
    }

    return this.prisma.match.delete({
      where: {
        IdMatch: id,
      },
    });
  }

  private async obtenerMatch(id: number) {
    const match = await this.prisma.match.findUnique({
      where: {
        IdMatch: id,
      },
      include: {
        Chat: true,
      },
    });

    if (!match) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: `No existe un match con el ID ${id}.`,
        error: 'Not Found',
      });
    }

    return match;
  }

  private verificarUsuariosDiferentes(
    idUsuarioUno: number,
    idUsuarioDos: number,
  ): void {
    if (idUsuarioUno === idUsuarioDos) {
      throw new RpcException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Un usuario no puede hacer match consigo mismo.',
        error: 'Bad Request',
      });
    }
  }

  private async verificarInteraccionesMutuas(
    idUsuarioUno: number,
    idUsuarioDos: number,
  ): Promise<void> {
    const tiposPositivos: TipoInteraccion[] = [
      TipoInteraccion.LIKE,
      TipoInteraccion.SUPERLIKE,
    ];

    const [interaccionUsuarioUno, interaccionUsuarioDos] = await Promise.all([
      this.prisma.interaccion.findFirst({
        where: {
          UsuarioEmisorFK: idUsuarioUno,
          UsuarioReceptorFK: idUsuarioDos,
          tipoInteraccion: {
            in: tiposPositivos,
          },
        },
        select: {
          IdInteraccion: true,
        },
      }),
      this.prisma.interaccion.findFirst({
        where: {
          UsuarioEmisorFK: idUsuarioDos,
          UsuarioReceptorFK: idUsuarioUno,
          tipoInteraccion: {
            in: tiposPositivos,
          },
        },
        select: {
          IdInteraccion: true,
        },
      }),
    ]);

    if (!interaccionUsuarioUno || !interaccionUsuarioDos) {
      throw new RpcException({
        statusCode: HttpStatus.BAD_REQUEST,
        message:
          'Para crear el match, ambos usuarios deben darse LIKE o SUPERLIKE.',
        error: 'Bad Request',
      });
    }
  }

  private async verificarMatchDuplicado(
    idUsuarioUno: number,
    idUsuarioDos: number,
    idMatchExcluir?: number,
  ): Promise<void> {
    const matchExistente = await this.prisma.match.findFirst({
      where: {
        OR: [
          {
            UsuarioUnoFK: idUsuarioUno,
            UsuarioDosFK: idUsuarioDos,
          },
          {
            UsuarioUnoFK: idUsuarioDos,
            UsuarioDosFK: idUsuarioUno,
          },
        ],
        ...(idMatchExcluir !== undefined
          ? {
              NOT: {
                IdMatch: idMatchExcluir,
              },
            }
          : {}),
      },
      select: {
        IdMatch: true,
      },
    });

    if (matchExistente) {
      throw new RpcException({
        statusCode: HttpStatus.CONFLICT,
        message:
          `Ya existe un Match entre los usuarios ${idUsuarioUno} ` +
          `y ${idUsuarioDos}.`,
        error: 'Conflict',
      });
    }
  }
}
