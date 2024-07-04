import {IsNotEmpty} from "class-validator"
export class CreateContentDto {
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    description: string;
}

export class UpdateContentDto {
    title: string;
    description: string;
    isApproved: boolean;
}