/* tf_microservicio-interacciones/src/matches/dto/create-match.dto.ts */
import { IsInt, Min } from 'class-validator';

export class CreateMatchDto {
  @IsInt()
  @Min(1)
  UsuarioUnoFK: number;

  @IsInt()
  @Min(1)
  UsuarioDosFK: number;
}
