import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

// Swagger (OpenAPI) configuration.
// Accessible at /api when the app is running.
export function setupSwagger(app: INestApplication) {
    const config = new DocumentBuilder()
        .setTitle('Notos API')
        .setDescription('REST API for the Notos application')
        .setVersion('1.0')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
}
