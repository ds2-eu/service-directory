import { Test, TestingModule } from '@nestjs/testing';

import { ServiceController } from './service.controller';
import { ServiceService } from './service.service';
import mockServiceService, {
	createServiceMockDTO,
	createdMockService,
	deleteServiceMockDTO,
	deletedMockService,
	mockServices,
	patchServiceMockDTO,
	patchedMockService,
} from './mock-service-service';

describe('Service controller', () => {
	let app: TestingModule;
	let serviceController: ServiceController;
	let serviceService: ServiceService;

	beforeEach(async () => {
		app = await Test.createTestingModule({
			controllers: [ServiceController],
			providers: [
				{
					provide: ServiceService,
					useValue: mockServiceService,
				},
			],
		}).compile();

		serviceController = app.get<ServiceController>(ServiceController);
		serviceService = app.get<ServiceService>(ServiceService);
	});

	afterAll(async () => {
		await app.close();
	});

	it('should be defined', () => {
		expect(serviceController).toBeDefined();
	});

	describe('create()', () => {
		it('should create a new service', async () => {
			const createSpy = jest.spyOn(serviceService, 'create');
			await serviceController.create(createServiceMockDTO);
			expect(createSpy).toHaveBeenCalled();
		});

		it('should create a new service with all the fields that were passed in', async () => {
			expect(await serviceController.create(createServiceMockDTO)).toEqual({
				...createServiceMockDTO,
				_id: 'ID1',
				__v: 0,
			});
		});

		it('should create a service with an _id', async () => {
			expect(
				(await serviceController.create(createServiceMockDTO))._id,
			).toBeTruthy();
		});

		it('should return a created service', async () => {
			expect(serviceController.create(createServiceMockDTO)).resolves.toEqual(
				createdMockService,
			);
		});
	});

	describe('findAll()', () => {
		it('should call the `findAll` service-method', async () => {
			const spy = jest.spyOn(serviceService, 'findAll');
			await serviceController.findAll();
			expect(spy).toHaveBeenCalled();
		});

		it('should return a list of services', async () => {
			expect(serviceController.findAll()).resolves.toEqual(mockServices);
		});
	});

	describe('patch()', () => {
		it('should call the `patch` service-method', async () => {
			const spy = jest.spyOn(serviceService, 'patch');
			await serviceController.patch(patchServiceMockDTO);
			expect(spy).toHaveBeenCalled();
		});

		it('should return a service with one property changed', async () => {
			expect(serviceController.patch(patchServiceMockDTO)).resolves.toEqual(
				patchedMockService,
			);
		});
	});

	describe('delete()', () => {
		it('should call the `delete` service-method', async () => {
			const spy = jest.spyOn(serviceService, 'delete');
			await serviceController.delete(deleteServiceMockDTO);
			expect(spy).toHaveBeenCalledWith(deleteServiceMockDTO);
		});

		it('should return a service as it was before it was deleted', async () => {
			expect(serviceController.delete(deleteServiceMockDTO)).resolves.toEqual(
				deletedMockService,
			);
		});
	});
});
