/* tf_microservicio-interacciones/src/reportes/reportes.module.ts */
import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UsuariosRemotosModule } from '../usuarios-remotos/usuarios-remotos.module';
import { ReportesController } from './reportes.controller';
import { ReportesService } from './reportes.service';

@Module({
  imports: [PrismaModule, UsuariosRemotosModule],
  controllers: [ReportesController],
  providers: [ReportesService],
})
export class ReportesModule {}
