/* tf_microservicio-interacciones/src/condiciones-comunicacion/condiciones-comunicacion.service.ts */
import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCondicionComunicacionDto } from './dto/create-condicion-comunicacion.dto';
import { UpdateCondicionComunicacionDto } from './dto/update-condicion-comunicacion.dto';

@Injectable()
export class CondicionesComunicacionService {
  constructor(private readonly prisma: PrismaService) {}

  create(createCondicionComunicacionDto: CreateCondicionComunicacionDto) {
    return this.prisma.condicionComunicacion.create({
      data: createCondicionComunicacionDto,
    });
  }

  findAll() {
    return this.prisma.condicionComunicacion.findMany({
      orderBy: {
        IdCondicionComunicacion: 'asc',
      },
    });
  }

  async findOne(idCondicionComunicacion: number) {
    const condicionComunicacion =
      await this.prisma.condicionComunicacion.findUnique({
        where: {
          IdCondicionComunicacion: idCondicionComunicacion,
        },
      });

    if (!condicionComunicacion) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message:
          `No existe una condición de comunicación con el ID ` +
          `${idCondicionComunicacion}.`,
        error: 'Not Found',
      });
    }

    return condicionComunicacion;
  }

  async update(
    idCondicionComunicacion: number,
    updateCondicionComunicacionDto: UpdateCondicionComunicacionDto,
  ) {
    await this.findOne(idCondicionComunicacion);

    if (Object.keys(updateCondicionComunicacionDto).length === 0) {
      throw new RpcException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Debe enviar al menos un campo para actualizar.',
        error: 'Bad Request',
      });
    }

    return this.prisma.condicionComunicacion.update({
      where: {
        IdCondicionComunicacion: idCondicionComunicacion,
      },
      data: updateCondicionComunicacionDto,
    });
  }

  async remove(idCondicionComunicacion: number) {
    await this.findOne(idCondicionComunicacion);

    return this.prisma.condicionComunicacion.delete({
      where: {
        IdCondicionComunicacion: idCondicionComunicacion,
      },
    });
  }
}
