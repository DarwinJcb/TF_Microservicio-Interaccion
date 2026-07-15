/* tf_microservicio-interacciones/src/mensajes/mensajes.patterns.ts */
export const MENSAJES_PATTERNS = {
  CREAR: 'mensajes.crear',
  LISTAR: 'mensajes.listar',
  LISTAR_POR_CHAT: 'mensajes.listarPorChat',
  LISTAR_POR_USUARIO: 'mensajes.listarPorUsuario',
  BUSCAR_POR_ID: 'mensajes.buscarPorId',
  ACTUALIZAR: 'mensajes.actualizar',
  ELIMINAR: 'mensajes.eliminar',
} as const;
