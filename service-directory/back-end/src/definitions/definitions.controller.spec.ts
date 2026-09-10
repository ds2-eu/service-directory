import { Test, TestingModule } from '@nestjs/testing';
import { DefinitionsController } from './definitions.controller';
import { DefinitionsService } from './definitions.service';
import mockDefinitionsService, {
	createDefinitionMockDTO,
	patchDefinitionMockDTO,
	deleteDefinitionMockDTO,
	deletedMockDefinition,
	patchedMockDefinition,
	mockDefinitions,
	createdMockDefinition,
} from './mock-definitions-service';

describe('DefinitionsController', () => {
	let app: TestingModule;
	let controller: DefinitionsController;
	let service: DefinitionsService;

	beforeEach(async () => {
		app = await Test.createTestingModule({
			controllers: [DefinitionsController],
			providers: [
				{
					provide: DefinitionsService,
					useValue: mockDefinitionsService,
				},
			],
		}).compile();

		controller = app.get<DefinitionsController>(DefinitionsController);
		service = app.get<DefinitionsService>(DefinitionsService);
	});

	afterAll(async () => {
		await app.close();
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	describe('create()', () => {
		it('should create a new definition', async () => {
			const createSpy = jest.spyOn(service, 'create');
			await controller.create(createDefinitionMockDTO);
			expect(createSpy).toHaveBeenCalled();
		});

		it('should create a new definition with all the fields that were passed in', async () => {
			expect(await controller.create(createDefinitionMockDTO)).toEqual({
				...createDefinitionMockDTO,
				id: 'ID1',
			});
		});

		it('should create a definition with an ID', async () => {
			expect(
				(await controller.create(createDefinitionMockDTO)).id,
			).toBeTruthy();
		});

		it('should return a created definition', async () => {
			expect(controller.create(createDefinitionMockDTO)).resolves.toEqual(
				createdMockDefinition,
			);
		});
	});

	describe('findAll()', () => {
		it('should call the `findAll` service-method', async () => {
			const spy = jest.spyOn(service, 'findAll');
			await controller.findAll();
			expect(spy).toHaveBeenCalled();
		});

		it('should return a list of definitions', async () => {
			expect(controller.findAll()).resolves.toEqual(mockDefinitions);
		});
	});

	describe('patch()', () => {
		it('should call the `patch` service-method', async () => {
			const spy = jest.spyOn(service, 'patch');
			await controller.patch(patchDefinitionMockDTO);
			expect(spy).toHaveBeenCalledWith(patchDefinitionMockDTO);
		});

		it('should return a patched definition', async () => {
			expect(controller.patch(patchDefinitionMockDTO)).resolves.toEqual(
				patchedMockDefinition,
			);
		});
	});

	describe('delete()', () => {
		it('should call the `delete` service-method', async () => {
			const spy = jest.spyOn(service, 'delete');
			await controller.delete(deleteDefinitionMockDTO);
			expect(spy).toHaveBeenCalledWith(deleteDefinitionMockDTO);
		});

		it('should return a definition as it was before it was deleted', async () => {
			expect(controller.delete(deleteDefinitionMockDTO)).resolves.toEqual(
				deletedMockDefinition,
			);
		});
	});

	describe('getValueByName()', () => {
		it('should call the `getValueByName` service-method', async () => {
			const spy = jest.spyOn(service, 'getValueByName');
			await controller.getValueByName('Name 1');
			expect(spy).toHaveBeenCalled();
		});

		it('should return a simple value', async () => {
			expect(controller.getValueByName('Name 1')).resolves.toEqual('Value 1');
		});
	});
});

