/* tf_microservicio-interacciones/src/microservicios/microservicios.module.ts */
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConexionMicroserviciosService } from './conexion-microservicios.service';
import { MICROSERVICIO_USUARIOS } from './microservicios.constants';

@Global()
@Module({
    imports: [
        ClientsModule.registerAsync([
            {
                name: MICROSERVICIO_USUARIOS,
                imports: [ConfigModule],
                inject: [ConfigService],
                useFactory: (configService: ConfigService) => {
                    const host = configService.get<string>(
                        'HOST_MICROSERVICIO_USUARIOS',
                    );

                    const puertoTexto = configService.get<string>(
                        'PUERTO_MICROSERVICIO_USUARIOS',
                    );

                    if (host === undefined || host.trim() === '') {
                        throw new Error(
                            'La variable HOST_MICROSERVICIO_USUARIOS no está configurada.',
                        );
                    }

                    if (puertoTexto === undefined || puertoTexto.trim() === '') {
                        throw new Error(
                            'La variable PUERTO_MICROSERVICIO_USUARIOS no está configurada.',
                        );
                    }

                    const puerto = Number(puertoTexto);

                    if (!Number.isInteger(puerto) || puerto < 1 || puerto > 65535) {
                        throw new Error(
                            'PUERTO_MICROSERVICIO_USUARIOS debe contener un puerto válido.',
                        );
                    }

                    return {
                        transport: Transport.TCP,
                        options: {
                            host: host.trim(),
                            port: puerto,
                        },
                    };
                },
            },
        ]),
    ],
    providers: [ConexionMicroserviciosService],
    exports: [ClientsModule],
})
export class MicroserviciosModule { }