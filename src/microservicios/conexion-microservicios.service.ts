/* tf_microservicio-interacciones/src/microservicios/conexion-microservicios.service.ts */
import {
  Inject,
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { MICROSERVICIO_USUARIOS } from './microservicios.constants';

@Injectable()
export class ConexionMicroserviciosService
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private readonly logger = new Logger(ConexionMicroserviciosService.name);

  constructor(
    @Inject(MICROSERVICIO_USUARIOS)
    private readonly clienteUsuarios: ClientProxy,
    private readonly configService: ConfigService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.clienteUsuarios.connect();

    const host = this.configService.getOrThrow<string>(
      'HOST_MICROSERVICIO_USUARIOS',
    );

    const puerto = this.configService.getOrThrow<string>(
      'PUERTO_MICROSERVICIO_USUARIOS',
    );

    this.logger.log(
      `Microservicio de Interacciones conectado por TCP al Microservicio de Usuarios en ${host}:${puerto}.`,
    );
  }

  async onApplicationShutdown(): Promise<void> {
    await this.clienteUsuarios.close();
  }
}
