/* tf_microservicio-interacciones/src/app.module.ts */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChatsModule } from './chats/chats.module';
import { CondicionesComunicacionModule } from './condiciones-comunicacion/condiciones-comunicacion.module';
import { InteraccionesModule } from './interacciones/interacciones.module';
import { MatchesModule } from './matches/matches.module';
import { MensajesModule } from './mensajes/mensajes.module';
import { MicroserviciosModule } from './microservicios/microservicios.module';
import { ReportesModule } from './reportes/reportes.module';
import { UsuariosRemotosModule } from './usuarios-remotos/usuarios-remotos.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MicroserviciosModule,
    UsuariosRemotosModule,
    CondicionesComunicacionModule,
    InteraccionesModule,
    ReportesModule,
    MatchesModule,
    ChatsModule,
    MensajesModule,
  ],
})
export class AppModule { }