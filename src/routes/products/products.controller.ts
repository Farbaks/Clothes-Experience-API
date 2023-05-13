import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request } from "@nestjs/common";
import { CreateProductDto, GetAllProductDto, GetProductDto, UpdateProductDto, UpdateProductIDDto } from "./dto/products.dto";
import { ProductsService } from "./products.service";

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post()
    create(@Request() request, @Body() createProductDto: CreateProductDto) {
        return this.productsService.create(request.decoded, createProductDto)
    }

    @Get()
    findAll(@Query() queryString: GetAllProductDto) {
        return this.productsService.findAll(queryString);
    }

    @Get('mine')
    findAllUserProducts(@Request() request, @Query() queryString: GetAllProductDto) {
        return this.productsService.findAllUserProducts(request.decoded, queryString);
    }

    @Get(':slug')
    findOne(@Param() params: GetProductDto) {
        return this.productsService.findOne(params.slug)
    }

    @Put(':productId')
    update(@Request() request, @Param() params: UpdateProductIDDto, @Body() updateProductDto: UpdateProductDto) {
        return this.productsService.update(request.decoded, params.productId, updateProductDto)
    }
    @Delete(':productId')
    remove(@Request() request, @Param() params: UpdateProductIDDto) {
        return this.productsService.remove(request.decoded, params.productId);
    }
}