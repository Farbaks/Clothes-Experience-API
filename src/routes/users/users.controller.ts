import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Query, Put } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { CreateUserDto, LoginDto, UpdateUserDto } from './dto/user.dto';
import { UsersService } from './users.service';


@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    async create(@Request() request, @Body() createUserDto: CreateUserDto) {
        return await this.usersService.create(createUserDto);
    }

    @Post('/login')
    async login(@Body() loginDto: LoginDto): Promise<any> {
        return await this.usersService.login(loginDto);
    }

    @Get('me')
    async me(@Request() request) {
        return await this.usersService.me(request.decoded)
    }

    @Put()
    async updateUser(@Request() request, @Body() updateUserDto: UpdateUserDto) {
        return await this.usersService.updateUser(request.decoded, updateUserDto);
    }
}
