import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateProductDto, GetAllProductDto, UpdateProductDto } from "./dto/products.dto";
import { Products } from "./interfaces/products.interface";

@Injectable()
export class ProductsService {
    constructor(
        @InjectModel('Products') private readonly ProductModel: Model<Products>) { }

    async create(userInfo: any, createProductDto: CreateProductDto) {

        // Check if slug exists
        const checkSlug = await this.ProductModel.findOne({
            slug: createProductDto.slug,
        }).exec();

        if (checkSlug) {
            return {
                statusCode: HttpStatus.BAD_REQUEST,
                message: "Slug already exists.",
            }
        }

        let createProduct = new this.ProductModel({
            name: createProductDto.name,
            description: createProductDto.description,
            price: createProductDto.price,
            size: createProductDto.size,
            slug: createProductDto.slug,
            color: createProductDto.color,
            imageUrl: createProductDto.imageUrl,
            user: userInfo._id
        });

        const productCreated = await createProduct.save()
        return {
            statusCode: HttpStatus.OK,
            message: "Product created successfully.",
            data: productCreated
        }
    }

    async findAll(queryString: GetAllProductDto) {
        let pageOptions = {
            page: queryString.page || 0,
            limit: (queryString.limit ? (queryString.limit > 100 ? 100 : queryString.limit) : 25),
            query: queryString.query || ""
        }

        let modelParameter = {
            $or: [
                {
                    name: {
                        $regex: `.*${pageOptions.query}.*`, $options: "i"
                    }
                },
                {
                    color: {
                        $regex: `.*${pageOptions.query}.*`, $options: "i"
                    },
                },
                {
                    price: pageOptions.query.replace(/[^\d.]/g, ""),
                },
                {
                    size: {
                        $regex: `.*${pageOptions.query}.*`, $options: "i"
                    },
                },
                {
                    description: {
                        $regex: `.*${pageOptions.query}.*`, $options: "i"
                    },
                },
            ]
        }

        const productsCount = await this.ProductModel.countDocuments(modelParameter).exec();
        const Products = await this.ProductModel.find(modelParameter)
            .skip(pageOptions.page * pageOptions.limit)
            .limit(pageOptions.limit * 1)
            .exec();

        return {
            statusCode: HttpStatus.OK,
            message: "Products fetched successfully.",
            data: Products,
            pagination: {
                total: productsCount,
                pages: Math.ceil(productsCount / pageOptions.limit),
                page: pageOptions.page,
                limit: pageOptions.limit
            }
        }
    }

    async findAllUserProducts(userInfo: any, queryString: GetAllProductDto) {
        let pageOptions = {
            page: queryString.page || 0,
            limit: (queryString.limit ? (queryString.limit > 100 ? 100 : queryString.limit) : 25),
            query: queryString.query || ""
        }

        let modelParameter: any = {
            user: userInfo._id
        }

        modelParameter = {
            ...modelParameter,
            $or: [
                {
                    name: {
                        $regex: `.*${pageOptions.query}.*`, $options: "i"
                    }
                },
                {
                    color: {
                        $regex: `.*${pageOptions.query}.*`, $options: "i"
                    },
                },
                {
                    price: pageOptions.query.replace(/[^\d.]/g, ""),
                },
                {
                    size: {
                        $regex: `.*${pageOptions.query}.*`, $options: "i"
                    },
                },
                {
                    description: {
                        $regex: `.*${pageOptions.query}.*`, $options: "i"
                    },
                },
            ]
        }

        const productsCount = await this.ProductModel.countDocuments(modelParameter).exec();
        const Products = await this.ProductModel.find(modelParameter)
            .skip(pageOptions.page * pageOptions.limit)
            .limit(pageOptions.limit * 1)
            .exec();

        return {
            statusCode: HttpStatus.OK,
            message: "Products fetched successfully.",
            data: Products,
            pagination: {
                total: productsCount,
                pages: Math.ceil(productsCount / pageOptions.limit),
                page: pageOptions.page,
                limit: pageOptions.limit
            }
        }
    }

    async findOne(slug: string) {

        let modelParameter: any = {
            slug: slug
        };

        const result = await this.ProductModel.findOne(modelParameter).populate('user').exec()
        if (!result) {
            return {
                statusCode: HttpStatus.BAD_REQUEST,
                message: "Product does not exist.",
            }
        }
        return {
            statusCode: HttpStatus.OK,
            message: "Product fetched successfully.",
            data: result
        }
    }

    async update(userInfo: any, productId: string, updateProductDto: UpdateProductDto) {

        const updateProduct = await this.ProductModel.findOne({
            _id: productId,
            user: userInfo._id
        }).exec();

        if (!updateProduct) {
            return {
                statusCode: HttpStatus.BAD_REQUEST,
                message: "Product does not exist.",
            }
        }

        if (updateProduct.slug) {
            // Check if slug exists
            const checkSlug = await this.ProductModel.findOne({
                _id: {
                    $ne: productId
                },
                slug: updateProductDto.slug
            }).exec();

            if (checkSlug) {
                return {
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: "Slug already exists.",
                }
            }
        }


        if (updateProductDto.name) updateProduct.name = updateProductDto.name;
        if (updateProductDto.color) updateProduct.color = updateProductDto.color;
        if (updateProductDto.price) updateProduct.price = updateProductDto.price;
        if (updateProductDto.description) updateProduct.description = updateProductDto.description;
        if (updateProductDto.size) updateProduct.size = updateProductDto.size;
        if (updateProductDto.slug) updateProduct.slug = updateProductDto.slug;
        if (updateProductDto.imageUrl) updateProduct.imageUrl = updateProductDto.imageUrl;
        updateProduct.updatedAt = new Date();
        await updateProduct.save();

        return {
            statusCode: HttpStatus.OK,
            message: "Product updated successfully.",
            data: updateProduct
        }
    }

    //delete products
    async remove(userInfo: any, productId: string) {
        const removeProduct = await this.ProductModel.findOne({
            _id: productId,
            user: userInfo._id,
        }).exec();

        if (!removeProduct) {
            return {
                statusCode: HttpStatus.BAD_REQUEST,
                message: "Product does not exist.",
            }
        }
        await removeProduct.deleteOne();

        return {
            statusCode: HttpStatus.OK,
            message: "Product deleted successfully.",
        }
    }
}