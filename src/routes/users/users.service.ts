import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { CreateUserDto, LoginDto, UpdateUserDto } from './dto/user.dto';
import { User } from './interfaces/user.interface';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel('User') private readonly UserModel: Model<User>,
        private configService: ConfigService
    ) {

    }
    async create(createUserDto: CreateUserDto) {

        // Check if User already exists
        let checkUser = await this.UserModel.findOne({
            emailAddress: createUserDto.emailAddress
        }).exec()

        // Return error if User already exists
        if (checkUser) {
            return {
                statusCode: HttpStatus.BAD_REQUEST,
                message: "User already exists."
            }
        }

        let hashedPassword = await bcrypt.hash("" + createUserDto.password, 10);

        let user = new this.UserModel({
            firstName: createUserDto.firstName,
            lastName: createUserDto.lastName,
            emailAddress: createUserDto.emailAddress,
            phoneNumber: createUserDto.phoneNumber ?? "",
            password: hashedPassword
        })

        await user.save();

        // Create JWT token
        let jwtObject: any = JSON.parse(JSON.stringify(user));
        jwtObject.apiToken = await this.createJWTToken(user);

        return {
            statusCode: HttpStatus.OK,
            message: "User Registration Successful.",
            data: jwtObject
        }
    }

    async login(loginDto: LoginDto) {

        // Check if User exists and fetch just the password
        let checkUser = await this.UserModel.findOne({
            emailAddress: loginDto.emailAddress,
            status: 'active'
        }).select('password').exec()

        // Return error if User already exists
        if (!checkUser) {
            return {
                statusCode: HttpStatus.BAD_REQUEST,
                message: "This account does not exist. Please try again."
            }
        }

        // Compare password
        let match = await bcrypt.compare("" + loginDto.password, "" + checkUser.password);

        // Return error if passwords don't match
        if (!match) {
            return {
                statusCode: HttpStatus.BAD_REQUEST,
                message: "Your Email/Password is incorrect. Please try again."
            }
        }

        // Fetch user full info
        let user = await this.UserModel.findOne({
            emailAddress: loginDto.emailAddress,
            status: 'active'
        }).exec()

        // Create JWT token
        let jwtObject: any = JSON.parse(JSON.stringify(user));
        jwtObject.apiToken = await this.createJWTToken(user);

        return {
            statusCode: HttpStatus.OK,
            message: "User login successful.",
            data: jwtObject
        }

    }

    async me(userInfo: any) {
        let user = await this.UserModel.findOne({
            emailAddress: userInfo.emailAddress,
            status: "active"
        }).exec();

        // Create JWT token
        let jwtObject: any = JSON.parse(JSON.stringify(user));
        jwtObject.apiToken = await this.createJWTToken(user);

        return {
            statusCode: HttpStatus.OK,
            message: "User authentication successful.",
            data: jwtObject
        }
    }

    async updateUser(userInfo: any, updateUserDto: UpdateUserDto) {

        const user = await this.UserModel.findOne({
            _id: userInfo._id
        }).exec();

        if (updateUserDto.emailAddress) {
            const checkUser = await this.UserModel.findOne({
                _id: {
                    $ne: userInfo._id
                },
                emailAddress: updateUserDto.emailAddress
            }).exec();

            if (checkUser) {
                return {
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: "User with this email address already exists.",
                }
            }
            user.emailAddress = updateUserDto.emailAddress;
        };

        if (updateUserDto.firstName) user.firstName = updateUserDto.firstName;
        if (updateUserDto.lastName) user.lastName = updateUserDto.lastName;
        if (updateUserDto.phoneNumber) user.phoneNumber = updateUserDto.phoneNumber;


        user.updatedAt = new Date();
        await user.save();

        return {
            statusCode: HttpStatus.OK,
            message: "User updated successfully.",
            data: user
        }
    }

    async createJWTToken(user) {
        // Create JWT token
        let jwtObject: any = JSON.parse(JSON.stringify(user));

        let apiToken = await jwt.sign(jwtObject, this.configService.get('APPLICATION_KEY'), {
            expiresIn: "7d"
        });

        return apiToken;
    }
}
