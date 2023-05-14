import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AppConfig, AppConfigValidationSchema } from './app.config';
import { UsersModule } from './routes/users/users.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD } from '@nestjs/core';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { UsersController } from './routes/users/users.controller';
import { UserSchema } from './routes/users/schemas/users.schema';
import { ProductsModule } from './routes/products/products.module';

@Module({
    imports: [
        UsersModule,
        ProductsModule,
        MongooseModule.forRoot(AppConfig.DATABASE_URI),
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: AppConfigValidationSchema
        }),
        ThrottlerModule.forRoot({
            ttl: 60,
            limit: 1000,
        }),
        
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard
        }
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthMiddleware)
            .exclude(
                { path: 'users', method: RequestMethod.POST },
                { path: 'users/login', method: RequestMethod.POST },
                { path: 'products', method: RequestMethod.GET },
            )
            .forRoutes(
                UsersController,
                { path: 'products', method: RequestMethod.POST },
                { path: 'products/mine', method: RequestMethod.GET },
                { path: 'products/:productId', method: RequestMethod.PUT },
                { path: 'products/:productId', method: RequestMethod.DELETE },
            )
    }
}
