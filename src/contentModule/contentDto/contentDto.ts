import {IsNotEmpty} from "class-validator"
export class CreateContentDto {
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    description: string;
}

export class UpdateContentDto {
    description: string;
    isApproved: boolean;
}