import { Test, TestingModule } from '@nestjs/testing';
import { CreateSingleEndpointDTO } from './dto/create-single-endpoint.dto';
import { DeleteSingleEndpointDTO } from './dto/delete-single-endpoint.dto';
import { PatchSingleEndpointDTO } from './dto/patch-single-endpoint.dto';
import { SingleEndpointController } from './single-endpoint.controller';
import { SingleEndpointService } from './single-endpoint.service';

describe('Single endpoint controller', () => {
	let endpointController: SingleEndpointController;
	let endpointService: SingleEndpointService;

	const user = '123';
	const company = '456';
	const organization = '789';

	// The endpoint DTO is the parameter passed into the `create`,`patch`,`delete` methods.
	// The endpoint is what should be returned from the methods (inside a promise).
	const createEndpointDTO: CreateSingleEndpointDTO = {
		name: 'Example Single Endpoint',
		endpoint: 'http://example1.com',
		user,
		company,
		organization,
	};

	const createdEndpoint = {
		name: 'Example Single Endpoint',
		endpoint: 'http://example1.com',
		user,
		company,
		organization,
		_id: 'ID1',
		__v: 0,
	};

	const patchEndpointDTO: PatchSingleEndpointDTO = {
		_id: 'ID1',
		name: 'Updated Name 1',
		endpoint: 'http://example1.com',
	};

	const patchedEndpoint = {
		name: 'Updated Name 1',
		endpoint: 'http://example1.com',
		description: 'Description 1',
		user,
		company,
		organization,
		_id: 'ID1',
		__v: 0,
	};

	const deleteEndpointDTO: DeleteSingleEndpointDTO = {
		_id: 'ID3',
	};

	const deletedEndpoint = {
		name: 'Name 3',
		endpoint: 'http://example3.com',
		description: 'Description 3',
		user,
		company,
		organization,
		_id: 'ID3',
		__v: 0,
	};

	const allEndpoints = [
		{
			name: 'Name 1',
			description: 'Description 1',
			endpoint: 'http://example1.com',
			_id: 'ID1',
			__v: 0,
			user,
			company,
			organization,
		},
		{
			name: 'Name 2',
			description: 'Description 2',
			endpoint: 'http://example2.com',
			_id: 'ID2',
			__v: 0,
			user,
			company,
			organization,
		},
		deletedEndpoint,
	];

	beforeEach(async () => {
		const app: TestingModule = await Test.createTestingModule({
			controllers: [SingleEndpointController],
			providers: [
				{
					provide: SingleEndpointService,
					useValue: {
						findAll: jest.fn().mockResolvedValue(allEndpoints),
						create: jest.fn().mockResolvedValue(createdEndpoint),
						patch: jest.fn().mockResolvedValue(patchedEndpoint),
						delete: jest.fn().mockResolvedValue(deletedEndpoint),
					},
				},
			],
		}).compile();

		endpointController = app.get<SingleEndpointController>(
			SingleEndpointController,
		);
		endpointService = app.get<SingleEndpointService>(SingleEndpointService);
	});

	describe('create()', () => {
		it('should create a new single endpoint', async () => {
			const createSpy = jest
				.spyOn(endpointService, 'create')
				.mockResolvedValueOnce(createdEndpoint);

			await endpointController.create(createEndpointDTO);
			expect(createSpy).toHaveBeenCalledWith(createEndpointDTO);
		});
	});

	describe('create()', () => {
		it('should create a new single endpoint with all the fields that were passed in', async () => {
			expect(endpointController.create(createEndpointDTO)).resolves.toEqual({
				...createEndpointDTO,
				__v: 0,
				_id: 'ID1',
			});
		});
	});

	describe('create()', () => {
		it('should create a single endpoint with an _id', async () => {
			expect(
				(await endpointController.create(createEndpointDTO))._id,
			).toBeTruthy();
		});
	});

	describe('findAll()', () => {
		it('should return an array of categories', async () => {
			expect(endpointController.findAll()).resolves.toEqual([
				{
					name: 'Name 1',
					endpoint: 'http://example1.com',
					description: 'Description 1',
					_id: 'ID1',
					__v: 0,
					user: '123',
					company: '456',
					organization: '789',
				},
				{
					name: 'Name 2',
					endpoint: 'http://example2.com',
					description: 'Description 2',
					_id: 'ID2',
					__v: 0,
					user: '123',
					company: '456',
					organization: '789',
				},
				{
					name: 'Name 3',
					endpoint: 'http://example3.com',
					description: 'Description 3',
					_id: 'ID3',
					__v: 0,
					user: '123',
					company: '456',
					organization: '789',
				},
			]);
			expect(endpointService.findAll).toHaveBeenCalled();
		});
	});

	describe('patch()', () => {
		it('should return a single endpoint with one property changed', async () => {
			const spy = jest
				.spyOn(endpointService, 'patch')
				.mockResolvedValueOnce(patchedEndpoint);

			await endpointController.patch(patchEndpointDTO);
			expect(spy).toHaveBeenCalledWith(patchEndpointDTO);
		});
	});

	describe('delete()', () => {
		it('should return a single endpoint', async () => {
			const spy = jest
				.spyOn(endpointService, 'delete')
				.mockResolvedValueOnce(deletedEndpoint);

			const result = await endpointController.delete(deleteEndpointDTO);
			expect(spy).toHaveBeenCalledWith(deleteEndpointDTO);
			expect(result).toBe(deletedEndpoint);
		});
	});

	describe('patch()', () => {
		it('should return a single endpoint with one property changed', async () => {
			expect(
				endpointController.patch({
					_id: 'ID1',
					name: 'Updated Name 1',
					endpoint: 'http://example1.com',
				}),
			).resolves.toEqual(patchedEndpoint);
		});
	});

	describe('delete()', () => {
		it('should return a single endpoint', async () => {
			expect(endpointController.delete({ _id: 'ID3' })).resolves.toEqual(
				deletedEndpoint,
			);
			expect(endpointService.delete).toHaveBeenCalled();
		});
	});
});
