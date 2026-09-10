import { randomUUID } from 'crypto';
import { Injectable } from '@nestjs/common';

import { RepositoryObject } from '../repository/repository.types';
import { RepositoryService } from '../repository/repository.service';
import { Service } from './service.schema';
import { CreateServiceDTO } from './dto/create-service.dto';
import { DeleteServiceDTO } from './dto/delete-service.dto';
import { PatchServiceDTO } from './dto/patch-service.dto';

const TYPE_NAME = 'service';
const TYPE_LEVEL = 1;

@Injectable()
export class ServiceService {
	constructor(private readonly repository: RepositoryService) {}

	private toService(object: RepositoryObject): Service | null {
		if (!object) return null;
		const content = object.contentData || {};
		const metadata = object.metadata || {};
		const id = this.repository.getId(object);
		if (!id) return null;

		return {
			_id: id,
			__v: 0,
			name: object.name || '',
			description: object.description || '',
			openApiYamlEndpoint: content.openApiYamlEndpoint || '',
			openApiUiEndpoint: content.openApiUiEndpoint || '',
			openApiDefinition: content.openApiDefinition || '',
			hideFromOrchestration: Boolean(content.hideFromOrchestration),
			user: String(metadata.user ?? content.user ?? '0'),
			company: String(metadata.company ?? content.company ?? '0'),
			organization: String(metadata.organization ?? content.organization ?? '0'),
		};
	}

	private content(service: Partial<Service>) {
		return {
			openApiYamlEndpoint: service.openApiYamlEndpoint || '',
			openApiUiEndpoint: service.openApiUiEndpoint || '',
			openApiDefinition: service.openApiDefinition || '',
			hideFromOrchestration: Boolean(service.hideFromOrchestration),
		};
	}

	private metadata(service: Partial<Service>) {
		return {
			user: service.user || '0',
			company: service.company || '0',
			organization: service.organization || '0',
		};
	}

	async create(service: CreateServiceDTO): Promise<Service> {
		const created = await this.repository.insert({
			externalId: randomUUID(),
			objectType: { name: TYPE_NAME, level: TYPE_LEVEL },
			name: service.name,
			description: service.description || '',
			version: '1',
			metadata: this.metadata(service),
			contentType: 'json',
			contentData: this.content(service),
		});
		return this.toService(created);
	}

	async findAll(): Promise<Service[]> {
		const objects = await this.repository.search({
			typeName: TYPE_NAME,
			typeLevel: TYPE_LEVEL,
		});
		return objects.map((o) => this.toService(o)).filter(Boolean) as Service[];
	}

	async findOne(serviceId: string): Promise<Service> {
		const object = await this.repository.get(serviceId);
		if (!object || object.objectType?.name !== TYPE_NAME) return null;
		return this.toService(object);
	}

	async patch(service: PatchServiceDTO): Promise<Service> {
		await this.repository.partialUpdate({
			id: service._id,
			objectType: { name: TYPE_NAME, level: TYPE_LEVEL },
			name: service.name,
			description: service.description,
			metadata: this.metadata(service),
			contentType: 'json',
			contentData: this.content(service),
		});
		return this.findOne(service._id);
	}

	async delete(service: DeleteServiceDTO): Promise<Service> {
		const deleted = await this.repository.delete(service._id);
		return this.toService(deleted);
	}

	async wouldServiceNameBeDuplicate(service: CreateServiceDTO) {
		const matches = await this.repository.search({
			typeName: TYPE_NAME,
			typeLevel: TYPE_LEVEL,
			name: service.name,
		});
		return matches.length > 0;
	}

	async wouldPatchNameBeDuplicate(service: PatchServiceDTO) {
		if (!service.name) return false;
		const matches = await this.repository.search({
			typeName: TYPE_NAME,
			typeLevel: TYPE_LEVEL,
			name: service.name,
		});
		return matches.some((match) => this.repository.getId(match) !== service._id);
	}
}
