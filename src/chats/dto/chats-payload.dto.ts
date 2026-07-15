/* tf_microservicio-interacciones/src/chats/dto/chats-payload.dto.ts */
import { Type } from 'class-transformer';
import { IsDefined, IsInt, Min, ValidateNested } from 'class-validator';
import { UpdateChatDto } from './update-chat.dto';

export class IdChatPayloadDto {
    @Type(() => Number)
    @IsInt()
    @Min(1)
    IdChat: number;
}

export class IdMatchChatsPayloadDto {
    @Type(() => Number)
    @IsInt()
    @Min(1)
    IdMatch: number;
}

export class ActualizarChatPayloadDto extends IdChatPayloadDto {
    @IsDefined()
    @ValidateNested()
    @Type(() => UpdateChatDto)
    datosChat: UpdateChatDto;
}