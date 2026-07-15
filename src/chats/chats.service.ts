/* tf_microservicio-interacciones/src/chats/chats.service.ts */
import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

@Injectable()
export class ChatsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createChatDto: CreateChatDto) {
    await this.verificarMatch(createChatDto.MatchFK);

    const chatExistente = await this.prisma.chat.findUnique({
      where: {
        MatchFK: createChatDto.MatchFK,
      },
      select: {
        IdChat: true,
      },
    });

    if (chatExistente) {
      throw new RpcException({
        statusCode: HttpStatus.CONFLICT,
        message: `El match con el ID ${createChatDto.MatchFK} ya tiene un chat.`,
        error: 'Conflict',
      });
    }

    const chat = await this.prisma.chat.create({
      data: createChatDto,
      include: {
        Match: true,
        Mensaje: true,
      },
    });

    return this.formatearChat(chat);
  }

  async findAll() {
    const chats = await this.prisma.chat.findMany({
      include: {
        Match: true,
        Mensaje: true,
      },
      orderBy: {
        fechaCreacion: 'asc',
      },
    });

    return chats.map((chat) => this.formatearChat(chat));
  }

  async findByMatch(idMatch: number) {
    await this.verificarMatch(idMatch);

    const chat = await this.prisma.chat.findUnique({
      where: {
        MatchFK: idMatch,
      },
      include: {
        Match: true,
        Mensaje: true,
      },
    });

    if (!chat) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: `El match con el ID ${idMatch} no tiene un chat.`,
        error: 'Not Found',
      });
    }

    return this.formatearChat(chat);
  }

  async findOne(id: number) {
    const chat = await this.obtenerChat(id);

    return this.formatearChat(chat);
  }

  async update(id: number, updateChatDto: UpdateChatDto) {
    const chatActual = await this.obtenerChat(id);
    const idNuevoMatch = updateChatDto.MatchFK;

    if (idNuevoMatch !== undefined && idNuevoMatch !== chatActual.MatchFK) {
      if (chatActual.Mensaje.length > 0) {
        throw new RpcException({
          statusCode: HttpStatus.CONFLICT,
          message:
            'No se puede cambiar el match del chat porque contiene mensajes.',
          error: 'Conflict',
        });
      }

      await this.verificarMatch(idNuevoMatch);

      const chatDelMatch = await this.prisma.chat.findUnique({
        where: {
          MatchFK: idNuevoMatch,
        },
        select: {
          IdChat: true,
        },
      });

      if (chatDelMatch && chatDelMatch.IdChat !== id) {
        throw new RpcException({
          statusCode: HttpStatus.CONFLICT,
          message: `El match con el ID ${idNuevoMatch} ya tiene un chat.`,
          error: 'Conflict',
        });
      }
    }

    const chatActualizado = await this.prisma.chat.update({
      where: {
        IdChat: id,
      },
      data: updateChatDto,
      include: {
        Match: true,
        Mensaje: true,
      },
    });

    return this.formatearChat(chatActualizado);
  }

  async remove(id: number) {
    const chat = await this.obtenerChat(id);

    if (chat.Mensaje.length > 0) {
      throw new RpcException({
        statusCode: HttpStatus.CONFLICT,
        message: 'No se puede eliminar el chat porque contiene mensajes.',
        error: 'Conflict',
      });
    }

    return this.prisma.chat.delete({
      where: {
        IdChat: id,
      },
    });
  }

  private async obtenerChat(id: number) {
    const chat = await this.prisma.chat.findUnique({
      where: {
        IdChat: id,
      },
      include: {
        Match: true,
        Mensaje: true,
      },
    });

    if (!chat) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: `No existe un chat con el ID ${id}.`,
        error: 'Not Found',
      });
    }

    return chat;
  }

  private async verificarMatch(idMatch: number): Promise<void> {
    const match = await this.prisma.match.findUnique({
      where: {
        IdMatch: idMatch,
      },
      select: {
        IdMatch: true,
      },
    });

    if (!match) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: `No existe un match con el ID ${idMatch}.`,
        error: 'Not Found',
      });
    }
  }

  private formatearChat<
    ChatConRelaciones extends {
      Match: unknown;
      Mensaje: unknown[];
    },
  >(chat: ChatConRelaciones) {
    const { Match, Mensaje, ...datosChat } = chat;

    return {
      ...datosChat,
      match: Match,
      mensajes: Mensaje,
    };
  }
}