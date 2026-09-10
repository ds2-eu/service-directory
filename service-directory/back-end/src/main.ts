import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const swagger = new DocumentBuilder()
		.setTitle('Orchestration Service Directory API')
		.setDescription(
			'Back-end for the service directory in ICE Orchestration (WASP), secured by Keycloak. If you’re receiving 401 errors, set a header with a valid access-token, in the format `Authorization: Bearer eyJhbGciOiJSU…`',
		)
		.setVersion('1.0')
		.addTag(
			'service',
			'Endpoints for performing CRUD operations on the OpenAPI-compliant services in the service directory',
		)
		.addTag(
			'single-endpoint',
			'Endpoints for performing CRUD operations on the single endpoints (not OpenAPI-compliant) in the service directory',
		)
		.addTag(
			'definitions',
			'Endpoints for performing CRUD operations on the common definitions in the service directory — these are extracts of specification that can be embedded in the OpenAPI specifications for services’',
		)
		.build();
	const document = SwaggerModule.createDocument(app, swagger);
	SwaggerModule.setup('api', app, document);
	app.enableCors();

	await app.listen(process.env.PORT || 3002);
}
bootstrap();
