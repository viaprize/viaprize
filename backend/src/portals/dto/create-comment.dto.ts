import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateCommentDto {
    @ApiProperty({
        type: String,
        description: 'The comment for the prize',
        example: "HI",
    })
    @IsString()
    comment: string;
}