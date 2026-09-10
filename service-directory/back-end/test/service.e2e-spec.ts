import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from './../src/app.module';
import mockServiceService, {
	createServiceMockDTO,
	createdMockService,
	deleteServiceMockDTO,
	deletedMockService,
	mockServices,
	patchServiceMockDTO,
	patchedMockService,
} from '../src/service/mock-service-service';
import { ServiceService } from '../src/service/service.service';

describe('ServiceController (e2e)', () => {
	let app: INestApplication;

	beforeAll(async () => {
		const moduleFixture = await Test.createTestingModule({
			imports: [AppModule],
		})
			.overrideProvider(ServiceService)
			.useValue(mockServiceService)
			.compile();
		app = moduleFixture.createNestApplication();
		await app.init();
	});

	afterAll(async () => {
		await app.close();
	});

	it('should give 200 and return all services on GET', () => {
		return request(app.getHttpServer())
			.get('/service/')
			.expect(200)
			.expect(JSON.stringify(mockServices));
	});

	it('should give 400 if no ID was specified on POST', () => {
		return request(app.getHttpServer()).post('/service/').expect(400);
	});

	it('should give 400 if no ID was specified on PATCH', () => {
		return request(app.getHttpServer()).patch('/service/').expect(400);
	});

	it('should give 400 if no ID was specified on DELETE', () => {
		return request(app.getHttpServer()).delete('/service/').expect(400);
	});

	it('should give 201 and create a service on POST', () => {
		return request(app.getHttpServer())
			.post('/service')
			.send(createServiceMockDTO)
			.expect(201)
			.expect(createdMockService);
	});

	it('should give 200 and update a service on PATCH', () => {
		return request(app.getHttpServer())
			.patch('/service')
			.send(patchServiceMockDTO)
			.expect(200)
			.expect(patchedMockService);
	});

	it('should give 200 and return a service on DELETE', () => {
		return request(app.getHttpServer())
			.delete('/service')
			.send(deleteServiceMockDTO)
			.expect(200)
			.expect(deletedMockService);
	});

	it('should give 200 and return a service on GET', () => {
		return request(app.getHttpServer())
			.get('/service/' + patchedMockService._id)
			.expect(200)
			.expect(patchedMockService);
	});
});
