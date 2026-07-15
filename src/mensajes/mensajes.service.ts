/* tf_microservicio-interacciones/src/mensajes/mensajes.service.ts */
import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaService } from '../prisma/prisma.service';
import { UsuariosRemotosService } from '../usuarios-remotos/usuarios-remotos.service';
import { CreateMensajeDto } from './dto/create-mensaje.dto';
import { UpdateMensajeDto } from './dto/update-mensaje.dto';

interface ChatConMatch {
  IdChat: number;
  fechaCreacion: Date;
  MatchFK: number;
  Match: unknown;
}

interface MensajeConChatYMatch {
  IdMensaje: number;
  contenido: string;
  fechaEnvio: Date;
  ChatFK: number;
  UsuarioEmisorFK: number;
  Chat: ChatConMatch;
}

@Injectable()
export class MensajesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usuariosRemotosService: UsuariosRemotosService,
  ) {}

  async create(createMensajeDto: CreateMensajeDto) {
    const chat = await this.obtenerChatConMatch(createMensajeDto.ChatFK);

    const usuarioEmisor = await this.usuariosRemotosService.obtenerUsuario(
      createMensajeDto.UsuarioEmisorFK,
    );

    this.verificarUsuarioPerteneceAlMatch(
      createMensajeDto.UsuarioEmisorFK,
      chat.Match.UsuarioUnoFK,
      chat.Match.UsuarioDosFK,
    );

    const mensaje = await this.prisma.mensaje.create({
      data: createMensajeDto,
      include: {
        Chat: {
          include: {
            Match: true,
          },
        },
      },
    });

    return this.formatearMensaje(mensaje, usuarioEmisor);
  }

  async findAll() {
    const mensajes = await this.prisma.mensaje.findMany({
      include: {
        Chat: {
          include: {
            Match: true,
          },
        },
      },
      orderBy: {
        fechaEnvio: 'asc',
      },
    });

    if (mensajes.length === 0) {
      return [];
    }

    const usuariosPorId =
      await this.usuariosRemotosService.obtenerUsuariosPorIds(
        mensajes.map((mensaje) => mensaje.UsuarioEmisorFK),
      );

    return mensajes.map((mensaje) =>
      this.formatearMensaje(
        mensaje,
        usuariosPorId.get(mensaje.UsuarioEmisorFK) ?? null,
      ),
    );
  }

  async findByChat(idChat: number) {
    await this.obtenerChatConMatch(idChat);

    const mensajes = await this.prisma.mensaje.findMany({
      where: {
        ChatFK: idChat,
      },
      include: {
        Chat: {
          include: {
            Match: true,
          },
        },
      },
      orderBy: {
        fechaEnvio: 'asc',
      },
    });

    if (mensajes.length === 0) {
      return [];
    }

    const usuariosPorId =
      await this.usuariosRemotosService.obtenerUsuariosPorIds(
        mensajes.map((mensaje) => mensaje.UsuarioEmisorFK),
      );

    return mensajes.map((mensaje) =>
      this.formatearMensaje(
        mensaje,
        usuariosPorId.get(mensaje.UsuarioEmisorFK) ?? null,
      ),
    );
  }

  async findByUsuario(idUsuario: number) {
    const usuarioEmisor =
      await this.usuariosRemotosService.obtenerUsuario(idUsuario);

    const mensajes = await this.prisma.mensaje.findMany({
      where: {
        UsuarioEmisorFK: idUsuario,
      },
      include: {
        Chat: {
          include: {
            Match: true,
          },
        },
      },
      orderBy: {
        fechaEnvio: 'asc',
      },
    });

    return mensajes.map((mensaje) =>
      this.formatearMensaje(mensaje, usuarioEmisor),
    );
  }

  async findOne(id: number) {
    const mensaje = await this.obtenerMensaje(id);

    const usuarioEmisor = await this.usuariosRemotosService.obtenerUsuario(
      mensaje.UsuarioEmisorFK,
    );

    return this.formatearMensaje(mensaje, usuarioEmisor);
  }

  async update(id: number, updateMensajeDto: UpdateMensajeDto) {
    const mensajeActual = await this.obtenerMensaje(id);

    const idChat = updateMensajeDto.ChatFK ?? mensajeActual.ChatFK;

    const idUsuarioEmisor =
      updateMensajeDto.UsuarioEmisorFK ?? mensajeActual.UsuarioEmisorFK;

    const chat = await this.obtenerChatConMatch(idChat);

    const usuarioEmisor =
      await this.usuariosRemotosService.obtenerUsuario(idUsuarioEmisor);

    this.verificarUsuarioPerteneceAlMatch(
      idUsuarioEmisor,
      chat.Match.UsuarioUnoFK,
      chat.Match.UsuarioDosFK,
    );

    const mensajeActualizado = await this.prisma.mensaje.update({
      where: {
        IdMensaje: id,
      },
      data: updateMensajeDto,
      include: {
        Chat: {
          include: {
            Match: true,
          },
        },
      },
    });

    return this.formatearMensaje(mensajeActualizado, usuarioEmisor);
  }

  async remove(id: number) {
    await this.obtenerMensaje(id);

    return this.prisma.mensaje.delete({
      where: {
        IdMensaje: id,
      },
    });
  }

  private async obtenerMensaje(idMensaje: number) {
    const mensaje = await this.prisma.mensaje.findUnique({
      where: {
        IdMensaje: idMensaje,
      },
      include: {
        Chat: {
          include: {
            Match: true,
          },
        },
      },
    });

    if (!mensaje) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: `No existe un mensaje con el ID ${idMensaje}.`,
        error: 'Not Found',
      });
    }

    return mensaje;
  }

  private async obtenerChatConMatch(idChat: number) {
    const chat = await this.prisma.chat.findUnique({
      where: {
        IdChat: idChat,
      },
      include: {
        Match: true,
      },
    });

    if (!chat) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: `No existe un chat con el ID ${idChat}.`,
        error: 'Not Found',
      });
    }

    return chat;
  }

  private verificarUsuarioPerteneceAlMatch(
    idUsuario: number,
    idUsuarioUno: number,
    idUsuarioDos: number,
  ): void {
    const perteneceAlMatch =
      idUsuario === idUsuarioUno || idUsuario === idUsuarioDos;

    if (!perteneceAlMatch) {
      throw new RpcException({
        statusCode: HttpStatus.FORBIDDEN,
        message: 'El usuario no pertenece al match asociado con este chat.',
        error: 'Forbidden',
      });
    }
  }

  private formatearMensaje(
    mensaje: MensajeConChatYMatch,
    usuarioEmisor: unknown | null,
  ) {
    const { Chat, ...datosMensaje } = mensaje;
    const { Match, ...datosChat } = Chat;

    return {
      ...datosMensaje,
      chat: {
        ...datosChat,
        match: Match,
      },
      usuarioEmisor,
    };
  }
}
