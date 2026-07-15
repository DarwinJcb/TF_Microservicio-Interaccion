/* tf_microservicio-interacciones/src/condiciones-comunicacion/condiciones-comunicacion.module.ts */
import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CondicionesComunicacionController } from './condiciones-comunicacion.controller';
import { CondicionesComunicacionService } from './condiciones-comunicacion.service';

@Module({
  imports: [PrismaModule],
  controllers: [CondicionesComunicacionController],
  providers: [CondicionesComunicacionService],
})
export class CondicionesComunicacionModule {}
