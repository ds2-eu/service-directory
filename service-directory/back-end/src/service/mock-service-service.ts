import { CreateServiceDTO } from './dto/create-service.dto';
import { DeleteServiceDTO } from './dto/delete-service.dto';
import { PatchServiceDTO } from './dto/patch-service.dto';

const user = '123';
const company = '456';
const organization = '789';

// The service DTO is the parameter passed into the `create`,`patch`,`delete` methods.
// The service is what should be returned from the methods (inside a promise).
const createServiceMockDTO: CreateServiceDTO = {
	name: 'Example Service',
	openApiYamlEndpoint:
		'https://service-api.orchestration-test.icelab.cloud/api-json',
	user,
	company,
	organization,
	openApiDefinition: '',
	hideFromOrchestration: false,
};

const createdMockService = {
	name: 'Example Service',
	openApiYamlEndpoint:
		'https://service-api.orchestration-test.icelab.cloud/api-json',
	user,
	company,
	organization,
	openApiDefinition: '',
	hideFromOrchestration: false,
	_id: 'ID1',
	__v: 0,
};

const patchServiceMockDTO: PatchServiceDTO = {
	_id: 'ID1',
	name: 'Updated Name 1',
};

const patchedMockService = {
	name: 'Updated Name 1',
	openApiYamlEndpoint:
		'https://service-api.orchestration-test.icelab.cloud/api-json',
	user,
	company,
	organization,
	openApiDefinition: '',
	hideFromOrchestration: false,
	_id: 'ID1',
	__v: 0,
};

const deleteServiceMockDTO: DeleteServiceDTO = {
	_id: 'ID3',
};

const deletedMockService = {
	name: 'Name 3',
	description: 'Description 3',
	openApiYamlEndpoint:
		'https://service-directory-api.orchestration-test.icelab.cloud/api-json',
	user,
	company,
	organization,
	openApiDefinition: '',
	hideFromOrchestration: false,
	_id: 'ID3',
	__v: 0,
};

const mockServices = [
	{
		name: 'Name 1',
		description: 'Description 1',
		openApiYamlEndpoint:
			'https://service-api.orchestration-test.icelab.cloud/api-json',
		user,
		company,
		organization,
		openApiDefinition: '',
		hideFromOrchestration: false,
		_id: 'ID1',
		__v: 0,
	},
	{
		name: 'Name 2',
		description: 'Description 2',
		openApiYamlEndpoint:
			'https://services.ebusiness-cloud.com/workflow/v2/ebwasp/message/api-json',
		user,
		company,
		organization,
		openApiDefinition: '',
		hideFromOrchestration: false,
		_id: 'ID2',
		__v: 0,
	},
	deletedMockService,
];

const mockServiceService = {
	findAll: jest.fn().mockResolvedValue(mockServices),
	create: jest.fn().mockResolvedValue(createdMockService),
	findOne: jest.fn().mockResolvedValue(patchedMockService),
	patch: jest.fn().mockResolvedValue(createdMockService),
	delete: jest.fn().mockResolvedValue(deletedMockService),
	wouldServiceNameBeDuplicate: jest.fn().mockResolvedValue(false),
	wouldPatchNameBeDuplicate: jest.fn().mockResolvedValue(false),
	validateService: jest.fn().mockResolvedValue(undefined),
};

export default mockServiceService;
export {
	createServiceMockDTO,
	patchServiceMockDTO,
	deleteServiceMockDTO,
	createdMockService,
	patchedMockService,
	deletedMockService,
	mockServices,
};
