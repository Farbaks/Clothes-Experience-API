import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Port
    const configService = app.get(ConfigService);
    const port = configService.get('PORT');

    // Validation
    app.useGlobalPipes(new ValidationPipe({
        transform: true
    }));

    // Cors
    app.enableCors({
        origin: '*'
    });

    await app.listen(port || 3000);
}
bootstrap();
