import { CreateDefinitionDTO } from './dto/create-definition.dto';
import { DeleteDefinitionDTO } from './dto/delete-definition.dto';
import { PatchDefinitionDTO } from './dto/patch-definition.dto';

const createDefinitionMockDTO: CreateDefinitionDTO = {
	name: 'Name 1',
	value: 'Value 1',
};

const createdMockDefinition = {
	name: 'Name 1',
	value: 'Value 1',
	id: 'ID1',
};

const patchDefinitionMockDTO: PatchDefinitionDTO = {
	id: 'ID1',
	name: 'Updated Name 1',
	value: 'Updated Value 1',
};

const patchedMockDefinition = {
	name: 'Updated Name 1',
	value: 'Updated Value 1',
	id: 'ID1',
};

const deleteDefinitionMockDTO: DeleteDefinitionDTO = {
	id: 'ID3',
};

const deletedMockDefinition = {
	name: 'Name 3',
	value: 'Value 0003',
	id: 'ID3',
};

const mockDefinitions = [
	{
		name: 'Name 1',
		value: 'Value',
		id: 'ID1',
	},
	{
		name: 'Name 2',
		value: 'Value 2',
		id: 'ID2',
	},
	deletedMockDefinition,
];

const mockDefinitionsService = {
	findAll: jest.fn().mockResolvedValue(mockDefinitions),
	create: jest.fn().mockResolvedValue(createdMockDefinition),
	findById: jest.fn().mockResolvedValue(createdMockDefinition),
	patch: jest.fn().mockResolvedValue(patchedMockDefinition),
	delete: jest.fn().mockResolvedValue(deletedMockDefinition),
	getValueByName: jest.fn().mockImplementation(x => x ? createdMockDefinition.value : null),
};

export default mockDefinitionsService;
export {
	createDefinitionMockDTO,
	patchDefinitionMockDTO,
	deleteDefinitionMockDTO,
	createdMockDefinition,
	patchedMockDefinition,
	deletedMockDefinition,
	mockDefinitions,
};
