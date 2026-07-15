/* tf_microservicio-interacciones/src/condiciones-comunicacion/condiciones-comunicacion.module.ts */
import { Module } from '@nestjs/common';
import { CondicionesComunicacionService } from './condiciones-comunicacion.service';
import { CondicionesComunicacionController } from './condiciones-comunicacion.controller';

@Module({
  controllers: [CondicionesComunicacionController],
  providers: [CondicionesComunicacionService],
})
export class CondicionesComunicacionModule { }
