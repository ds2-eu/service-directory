import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from './../src/app.module';
import { DefinitionsService } from '../src/definitions/definitions.service';
import mockDefinitionsService, {
	createDefinitionMockDTO,
	createdMockDefinition,
	deleteDefinitionMockDTO,
	deletedMockDefinition,
	mockDefinitions,
	patchDefinitionMockDTO,
	patchedMockDefinition,
} from '../src/definitions/mock-definitions-service';

describe('DefinitionsController (e2e)', () => {
	let app: INestApplication;

	beforeAll(async () => {
		const moduleFixture = await Test.createTestingModule({
			imports: [AppModule],
		})
			.overrideProvider(DefinitionsService)
			.useValue(mockDefinitionsService)
			.compile();
		app = moduleFixture.createNestApplication();
		await app.init();
	});

	afterAll(async () => {
		await app.close();
	});

	it('should give 200 and return all definitions on GET', () => {
		return request(app.getHttpServer())
			.get('/definitions/')
			.expect(200)
			.expect(JSON.stringify(mockDefinitions));
	});

	it('should give 400 if no ID was specified on POST', () => {
		return request(app.getHttpServer()).post('/definitions/').expect(400);
	});

	it('should give 400 if no ID was specified on PATCH', () => {
		return request(app.getHttpServer()).patch('/definitions/').expect(400);
	});

	it('should give 400 if no ID was specified on DELETE', () => {
		return request(app.getHttpServer()).delete('/definitions/').expect(400);
	});

	it('should give 404 if no ID for a value was specified on DELETE', () => {
		return request(app.getHttpServer())
			.delete('/definitions/value/')
			.expect(404);
	});

	it('should give 201 and create a definition on POST', () => {
		return request(app.getHttpServer())
			.post('/definitions')
			.send(createDefinitionMockDTO)
			.expect(201)
			.expect(createdMockDefinition);
	});

	it('should give 200 and update a definition on PATCH', () => {
		return request(app.getHttpServer())
			.patch('/definitions')
			.send(patchDefinitionMockDTO)
			.expect(200)
			.expect(patchedMockDefinition);
	});

	it('should give 200 and return a definition on DELETE', () => {
		return request(app.getHttpServer())
			.delete('/definitions')
			.send(deleteDefinitionMockDTO)
			.expect(200)
			.expect(deletedMockDefinition);
	});

	it('should give 200 and return a definition on GET', () => {
		return request(app.getHttpServer())
			.get('/definitions/' + createdMockDefinition.id)
			.expect(200)
			.expect(createdMockDefinition);
	});

	it('should give 200 and return a value on GET', () => {
		return request(app.getHttpServer())
			.get('/definitions/value/' + createdMockDefinition.name)
			.expect(200)
			.expect(createdMockDefinition.value);
	});
});
