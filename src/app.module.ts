/* tf_microservicio-interacciones/src/app.module.ts */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CondicionesComunicacionModule } from './condiciones-comunicacion/condiciones-comunicacion.module';
import { InteraccionesModule } from './interacciones/interacciones.module';
import { ReportesModule } from './reportes/reportes.module';
import { MatchesModule } from './matches/matches.module';
import { ChatsModule } from './chats/chats.module';

@Module({
  imports: [PrismaModule, CondicionesComunicacionModule, InteraccionesModule, ReportesModule, MatchesModule, ChatsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
