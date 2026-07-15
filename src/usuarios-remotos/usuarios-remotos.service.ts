/* tf_microservicio-interacciones/src/usuarios-remotos/usuarios-remotos.service.ts */
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { MICROSERVICIO_USUARIOS } from '../microservicios/microservicios.constants';
import { USUARIOS_REMOTOS_PATTERNS } from './usuarios-remotos.patterns';

interface IdUsuarioPayload {
    IdUsuario: number;
}

@Injectable()
export class UsuariosRemotosService {
    constructor(
        @Inject(MICROSERVICIO_USUARIOS)
        private readonly clienteUsuarios: ClientProxy,
    ) { }

    async asegurarUsuarioExiste(IdUsuario: number): Promise<void> {
        const payload: IdUsuarioPayload = {
            IdUsuario,
        };

        let existe: boolean;

        try {
            existe = await firstValueFrom(
                this.clienteUsuarios.send<boolean, IdUsuarioPayload>(
                    USUARIOS_REMOTOS_PATTERNS.VERIFICAR_EXISTENCIA,
                    payload,
                ),
            );
        } catch {
            throw new RpcException({
                statusCode: HttpStatus.SERVICE_UNAVAILABLE,
                message:
                    'No fue posible verificar el usuario porque el Microservicio de Usuarios no está disponible.',
                error: 'Service Unavailable',
            });
        }

        if (!existe) {
            throw new RpcException({
                statusCode: HttpStatus.NOT_FOUND,
                message: `No existe un usuario con el ID ${IdUsuario}.`,
                error: 'Not Found',
            });
        }
    }
}