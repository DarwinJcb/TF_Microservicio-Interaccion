/* tf_microservicio-interacciones/src/condiciones-comunicacion/condiciones-comunicacion.service.ts */
import { Injectable } from '@nestjs/common';
import { CreateCondicionComunicacionDto } from './dto/create-condicion-comunicacion.dto';
import { UpdateCondicionComunicacionDto } from './dto/update-condicion-comunicacion.dto';

@Injectable()
export class CondicionesComunicacionService {
  create(createCondicionesComunicacionDto: CreateCondicionComunicacionDto) {
    return 'This action adds a new condicionesComunicacion';
  }

  findAll() {
    return `This action returns all condicionesComunicacion`;
  }

  findOne(id: number) {
    return `This action returns a #${id} condicionesComunicacion`;
  }

  update(
    id: number,
    updateCondicionesComunicacionDto: UpdateCondicionComunicacionDto,
  ) {
    return `This action updates a #${id} condicionesComunicacion`;
  }

  remove(id: number) {
    return `This action removes a #${id} condicionesComunicacion`;
  }
}
