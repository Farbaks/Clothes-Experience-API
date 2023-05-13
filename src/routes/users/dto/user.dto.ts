import { IsString, IsNotEmpty, IsOptional } from "class-validator";


export class CreateUserDto {

    @IsString()
    @IsNotEmpty()
    readonly firstName: string;

    @IsString()
    @IsNotEmpty()
    readonly lastName: string;

    @IsNotEmpty()
    @IsString()
    readonly emailAddress: string;

    @IsOptional()
    @IsString()
    readonly phoneNumber: string;

    @IsString()
    readonly password: string;
}

export class UpdateUserDto {

    @IsOptional()
    @IsString()
    readonly firstName: string;

    @IsOptional()
    @IsString()
    readonly lastName: string;

    @IsOptional()
    @IsString()
    readonly emailAddress: string;

    @IsOptional()
    @IsString()
    readonly phoneNumber: string;

    readonly status: string;
}

export class LoginDto {
    @IsString()
    readonly emailAddress: string;

    @IsString()
    readonly password: string;
}