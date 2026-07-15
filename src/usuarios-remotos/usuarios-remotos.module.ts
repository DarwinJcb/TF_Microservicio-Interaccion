/* tf_microservicio-interacciones/src/usuarios-remotos/usuarios-remotos.module.ts */
import { Module } from '@nestjs/common';
import { UsuariosRemotosService } from './usuarios-remotos.service';

@Module({
  providers: [UsuariosRemotosService],
  exports: [UsuariosRemotosService],
})
export class UsuariosRemotosModule {}
