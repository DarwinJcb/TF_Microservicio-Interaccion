/* tf_microservicio-interacciones/src/chats/dto/create-chat.dto.ts */
import { IsInt, Min } from 'class-validator';

export class CreateChatDto {
    @IsInt()
    @Min(1)
    MatchFK: number;
}