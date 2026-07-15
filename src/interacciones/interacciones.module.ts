/* tf_microservicio-interacciones/src/interacciones/interacciones.module.ts */
import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UsuariosRemotosModule } from '../usuarios-remotos/usuarios-remotos.module';
import { InteraccionesController } from './interacciones.controller';
import { InteraccionesService } from './interacciones.service';

@Module({
  imports: [PrismaModule, UsuariosRemotosModule],
  controllers: [InteraccionesController],
  providers: [InteraccionesService],
})
export class InteraccionesModule {}
