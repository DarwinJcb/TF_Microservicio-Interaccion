/* tf_microservicio-interacciones/src/mensajes/mensajes.module.ts */
import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UsuariosRemotosModule } from '../usuarios-remotos/usuarios-remotos.module';
import { MensajesController } from './mensajes.controller';
import { MensajesService } from './mensajes.service';

@Module({
  imports: [PrismaModule, UsuariosRemotosModule],
  controllers: [MensajesController],
  providers: [MensajesService],
})
export class MensajesModule {}
