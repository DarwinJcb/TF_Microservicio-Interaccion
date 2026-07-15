/* tf_microservicio-interacciones/src/matches/matches.module.ts */
import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UsuariosRemotosModule } from '../usuarios-remotos/usuarios-remotos.module';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';

@Module({
  imports: [PrismaModule, UsuariosRemotosModule],
  controllers: [MatchesController],
  providers: [MatchesService],
})
export class MatchesModule {}
