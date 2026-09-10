import { randomUUID } from 'crypto';
import { HttpException, Injectable } from '@nestjs/common';

import { isNullOrWhiteSpace } from '../core/utils';
import { RepositoryObject } from '../repository/repository.types';
import { RepositoryService } from '../repository/repository.service';
import { CreateDefinitionDTO } from './dto/create-definition.dto';
import { DefinitionDTO } from './dto/definition.dto';
import { DeleteDefinitionDTO } from './dto/delete-definition.dto';
import { PatchDefinitionDTO } from './dto/patch-definition.dto';

const TYPE_NAME = 'definition';
const TYPE_LEVEL = 1;

@Injectable()
export class DefinitionsService {
	constructor(private readonly repository: RepositoryService) {}

	private toDTO(object: RepositoryObject): DefinitionDTO {
		if (!object) return null;
		const id = this.repository.getId(object);
		if (!id) return null;
		return {
			id,
			name: object.name || '',
			value:
				typeof object.contentData === 'string'
					? object.contentData
					: object.contentData?.value ?? '',
		};
	}

	public async create(request: CreateDefinitionDTO): Promise<DefinitionDTO> {
		if (isNullOrWhiteSpace(request.name) || isNullOrWhiteSpace(request.value)) {
			throw new HttpException('`name` and `value` are required.', 400);
		}
		const created = await this.repository.insert({
			externalId: randomUUID(),
			objectType: { name: TYPE_NAME, level: TYPE_LEVEL },
			name: request.name,
			version: '1',
			contentType: 'value',
			contentData: request.value,
		});
		return this.toDTO(created);
	}

	public async findAll(): Promise<DefinitionDTO[]> {
		const records = await this.repository.search({
			typeName: TYPE_NAME,
			typeLevel: TYPE_LEVEL,
		});
		return records.map((r) => this.toDTO(r)).filter(Boolean);
	}

	public async findById(id: string): Promise<DefinitionDTO> {
		const record = await this.repository.get(id);
		if (!record || record.objectType?.name !== TYPE_NAME) return null;
		return this.toDTO(record);
	}

	public async getValueByName(name: string): Promise<string> {
		const records = await this.repository.search({
			typeName: TYPE_NAME,
			typeLevel: TYPE_LEVEL,
			name,
		});
		const record = records[0];
		return record ? this.toDTO(record)?.value : null;
	}

	public async patch(request: PatchDefinitionDTO): Promise<DefinitionDTO> {
		await this.repository.partialUpdate({
			id: request.id,
			objectType: { name: TYPE_NAME, level: TYPE_LEVEL },
			name: request.name,
			contentType: 'value',
			contentData: request.value,
		});
		return this.findById(request.id);
	}

	public async delete(definition: DeleteDefinitionDTO): Promise<DefinitionDTO> {
		const record = await this.repository.delete(definition.id);
		return this.toDTO(record);
	}
}
