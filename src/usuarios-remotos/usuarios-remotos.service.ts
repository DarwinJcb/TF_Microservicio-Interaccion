/* tf_microservicio-interacciones/src/usuarios-remotos/usuarios-remotos.service.ts */
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { MICROSERVICIO_USUARIOS } from '../microservicios/microservicios.constants';
import { USUARIOS_REMOTOS_PATTERNS } from './usuarios-remotos.patterns';

interface IdUsuarioPayload {
  IdUsuario: number;
}

interface ErrorRpcConEstado {
  statusCode: number;
  message: string | string[];
  [propiedad: string]: unknown;
}

@Injectable()
export class UsuariosRemotosService {
  constructor(
    @Inject(MICROSERVICIO_USUARIOS)
    private readonly clienteUsuarios: ClientProxy,
  ) {}

  async asegurarUsuarioExiste(IdUsuario: number): Promise<void> {
    const payload: IdUsuarioPayload = {
      IdUsuario,
    };

    const existe = await this.enviarSolicitud<boolean>(
      USUARIOS_REMOTOS_PATTERNS.VERIFICAR_EXISTENCIA,
      payload,
    );

    if (!existe) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: `No existe un usuario con el ID ${IdUsuario}.`,
        error: 'Not Found',
      });
    }
  }

  obtenerUsuario(IdUsuario: number): Promise<unknown> {
    const payload: IdUsuarioPayload = {
      IdUsuario,
    };

    return this.enviarSolicitud<unknown>(
      USUARIOS_REMOTOS_PATTERNS.BUSCAR_POR_ID,
      payload,
    );
  }

  async obtenerUsuariosPorIds(
    idsUsuarios: number[],
  ): Promise<Map<number, unknown | null>> {
    const identificadoresUnicos = [...new Set(idsUsuarios)];

    const usuarios = await Promise.all(
      identificadoresUnicos.map(async (IdUsuario) => {
        const usuario = await this.obtenerUsuarioOpcional(IdUsuario);

        return [IdUsuario, usuario] as const;
      }),
    );

    return new Map(usuarios);
  }

  private async obtenerUsuarioOpcional(
    IdUsuario: number,
  ): Promise<unknown | null> {
    const payload: IdUsuarioPayload = {
      IdUsuario,
    };

    try {
      return await firstValueFrom(
        this.clienteUsuarios.send<unknown, IdUsuarioPayload>(
          USUARIOS_REMOTOS_PATTERNS.BUSCAR_POR_ID,
          payload,
        ),
      );
    } catch (error: unknown) {
      if (
        this.esErrorRpcConEstado(error) &&
        error.statusCode === HttpStatus.NOT_FOUND
      ) {
        return null;
      }

      throw this.crearExcepcionRemota(error);
    }
  }

  private async enviarSolicitud<Respuesta>(
    patron: string,
    payload: IdUsuarioPayload,
  ): Promise<Respuesta> {
    try {
      return await firstValueFrom(
        this.clienteUsuarios.send<Respuesta, IdUsuarioPayload>(patron, payload),
      );
    } catch (error: unknown) {
      throw this.crearExcepcionRemota(error);
    }
  }

  private crearExcepcionRemota(error: unknown): RpcException {
    if (this.esErrorRpcConEstado(error)) {
      return new RpcException(error);
    }

    return new RpcException({
      statusCode: HttpStatus.SERVICE_UNAVAILABLE,
      message:
        'No fue posible consultar usuarios porque el Microservicio de Usuarios no está disponible.',
      error: 'Service Unavailable',
    });
  }

  private esErrorRpcConEstado(error: unknown): error is ErrorRpcConEstado {
    if (typeof error !== 'object' || error === null) {
      return false;
    }

    const posibleError = error as Record<string, unknown>;
    const mensaje = posibleError.message;

    const mensajeValido =
      typeof mensaje === 'string' ||
      (Array.isArray(mensaje) &&
        mensaje.every((elemento) => typeof elemento === 'string'));

    return typeof posibleError.statusCode === 'number' && mensajeValido;
  }
}
