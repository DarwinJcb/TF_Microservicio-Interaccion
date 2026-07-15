/* tf_microservicio-interacciones/src/configuracion/entorno.ts */
export function obtenerVariableEntorno(nombre: string): string {
  const valor = process.env[nombre];

  if (valor === undefined || valor.trim() === '') {
    throw new Error(`La variable de entorno ${nombre} no está configurada.`);
  }

  return valor.trim();
}

export function obtenerPuertoEntorno(nombre: string): number {
  const valor = obtenerVariableEntorno(nombre);
  const puerto = Number(valor);

  if (!Number.isInteger(puerto) || puerto < 1 || puerto > 65535) {
    throw new Error(
      `La variable de entorno ${nombre} debe contener un puerto válido.`,
    );
  }

  return puerto;
}
