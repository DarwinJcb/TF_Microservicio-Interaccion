/* tf_microservicio-interacciones/src/main.ts */
import 'dotenv/config';
import {
  HttpStatus,
  Logger,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  MicroserviceOptions,
  RpcException,
  Transport,
} from '@nestjs/microservices';
import { AppModule } from './app.module';
import {
  obtenerPuertoEntorno,
  obtenerVariableEntorno,
} from './configuracion/entorno';

function obtenerMensajesValidacion(
  errores: ValidationError[],
): string[] {
  return errores.flatMap((error) => {
    const mensajesPropios = error.constraints
      ? Object.values(error.constraints)
      : [];

    const mensajesHijos = error.children
      ? obtenerMensajesValidacion(error.children)
      : [];

    return [...mensajesPropios, ...mensajesHijos];
  });
}

async function bootstrap(): Promise<void> {
  const host = obtenerVariableEntorno('MICROSERVICIO_HOST');
  const puerto = obtenerPuertoEntorno('MICROSERVICIO_PUERTO');

  const microservicio =
    await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.TCP,
      options: {
        host,
        port: puerto,
      },
    });

  microservicio.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      validateCustomDecorators: true,
      exceptionFactory: (errores: ValidationError[]) =>
        new RpcException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: obtenerMensajesValidacion(errores),
          error: 'Bad Request',
        }),
    }),
  );

  microservicio.enableShutdownHooks();

  await microservicio.listen();

  Logger.log(
    `Microservicio de Interacciones iniciado y escuchando por TCP en ${host}:${puerto}`,
    'MicroservicioInteracciones',
  );
}

bootstrap().catch((error: unknown) => {
  const mensaje =
    error instanceof Error
      ? error.message
      : 'Ocurrió un error desconocido al iniciar el microservicio.';

  Logger.error(mensaje, undefined, 'Bootstrap');
  process.exit(1);
});