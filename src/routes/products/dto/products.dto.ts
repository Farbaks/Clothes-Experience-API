import { IsString, IsNotEmpty, IsOptional, IsIn, IsNumber, IsNumberString, IsMongoId } from "class-validator";


export class CreateProductDto {

    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    readonly description: string;

    @IsString()
    @IsNotEmpty()
    readonly slug: string;

    @IsNumber()
    @IsNotEmpty()
    readonly price: number;

    @IsString()
    @IsNotEmpty()
    readonly size: string;

    @IsNotEmpty()
    @IsString()
    readonly color: string;

    @IsOptional()
    @IsString()
    readonly imageUrl: string;
}

export class UpdateProductDto {

    @IsOptional()
    @IsString()
    readonly name: string;

    @IsOptional()
    @IsString()
    readonly description: string;

    @IsString()
    @IsOptional()
    readonly slug: string;

    @IsNumber()
    @IsOptional()
    readonly price: number;

    @IsOptional()
    @IsString()
    readonly size: string;

    @IsOptional()
    @IsString()
    readonly color: string;

    @IsOptional()
    @IsString()
    readonly imageUrl: string;
}

export class GetAllProductDto {
    @IsOptional()
    @IsNumberString()
    readonly page: number;

    @IsOptional()
    @IsNumberString()
    readonly limit: number;

    @IsOptional()
    @IsString()
    readonly query: string;

    @IsOptional()
    @IsIn(['mine', 'all'])
    readonly type: string;
}

export class GetProductDto {
    @IsString()
    readonly slug: string;
}

export class UpdateProductIDDto {
    @IsMongoId()
    readonly productId: string;
}