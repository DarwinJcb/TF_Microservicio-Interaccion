/* tf_microservicio-interacciones/src/interacciones/interacciones.service.ts */
import { Injectable } from '@nestjs/common';
import { CreateInteraccionDto } from './dto/create-interaccion.dto';
import { UpdateInteraccionDto } from './dto/update-interaccion.dto';

@Injectable()
export class InteraccionesService {
  create(createInteraccioneDto: CreateInteraccionDto) {
    return 'This action adds a new interaccione';
  }

  findAll() {
    return `This action returns all interacciones`;
  }

  findOne(id: number) {
    return `This action returns a #${id} interaccione`;
  }

  update(id: number, updateInteraccioneDto: UpdateInteraccionDto) {
    return `This action updates a #${id} interaccione`;
  }

  remove(id: number) {
    return `This action removes a #${id} interaccione`;
  }
}
