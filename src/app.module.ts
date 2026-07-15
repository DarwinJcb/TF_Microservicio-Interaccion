/* tf_microservicio-interacciones/src/app.module.ts */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChatsModule } from './chats/chats.module';
import { CondicionesComunicacionModule } from './condiciones-comunicacion/condiciones-comunicacion.module';
import { InteraccionesModule } from './interacciones/interacciones.module';
import { MatchesModule } from './matches/matches.module';
import { MensajesModule } from './mensajes/mensajes.module';
import { ReportesModule } from './reportes/reportes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CondicionesComunicacionModule,
    InteraccionesModule,
    ReportesModule,
    MatchesModule,
    ChatsModule,
    MensajesModule,
  ],
})
export class AppModule {}
