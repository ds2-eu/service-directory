import { randomUUID } from 'crypto';
import { Injectable } from '@nestjs/common';

import { changeNullPropertiesToEmptyString } from '../core/utils';
import { RepositoryObject } from '../repository/repository.types';
import { RepositoryService } from '../repository/repository.service';
import { CreateSingleEndpointDTO } from './dto/create-single-endpoint.dto';
import { DeleteSingleEndpointDTO } from './dto/delete-single-endpoint.dto';
import { PatchSingleEndpointDTO } from './dto/patch-single-endpoint.dto';
import { SingleEndpoint } from './single-endpoint.schema';

const TYPE_NAME = 'single-endpoint';
const TYPE_LEVEL = 1;

@Injectable()
export class SingleEndpointService {
	constructor(private readonly repository: RepositoryService) {}

	private toEndpoint(object: RepositoryObject): SingleEndpoint | null {
		if (!object) return null;
		const id = this.repository.getId(object);
		if (!id) return null;
		const content = object.contentData || {};
		const metadata = object.metadata || {};
		return {
			_id: id,
			__v: 0,
			name: object.name || '',
			endpoint: content.endpoint || '',
			description: object.description || '',
			user: String(metadata.user ?? content.user ?? '0'),
			company: String(metadata.company ?? content.company ?? '0'),
			organization: String(metadata.organization ?? content.organization ?? '0'),
		};
	}

	private metadata(endpoint: Partial<SingleEndpoint>) {
		return {
			user: endpoint.user || '0',
			company: endpoint.company || '0',
			organization: endpoint.organization || '0',
		};
	}

	async create(endpoint: CreateSingleEndpointDTO): Promise<SingleEndpoint> {
		endpoint.user ??= '0';
		endpoint.company ??= '0';
		endpoint.organization ??= '0';
		const sanitised = changeNullPropertiesToEmptyString(endpoint);
		const created = await this.repository.insert({
			externalId: randomUUID(),
			objectType: { name: TYPE_NAME, level: TYPE_LEVEL },
			name: sanitised.name,
			description: sanitised.description || '',
			version: '1',
			metadata: this.metadata(sanitised),
			contentType: 'json',
			contentData: { endpoint: sanitised.endpoint },
		});
		return this.toEndpoint(created);
	}

	async findAll(): Promise<SingleEndpoint[]> {
		const objects = await this.repository.search({
			typeName: TYPE_NAME,
			typeLevel: TYPE_LEVEL,
		});
		return objects.map((o) => this.toEndpoint(o)).filter(Boolean) as SingleEndpoint[];
	}

	async findOne(endpointId: string): Promise<SingleEndpoint> {
		const object = await this.repository.get(endpointId);
		if (!object || object.objectType?.name !== TYPE_NAME) return null;
		return this.toEndpoint(object);
	}

	async patch(endpoint: PatchSingleEndpointDTO): Promise<SingleEndpoint> {
		const existing = await this.findOne(endpoint._id);
		if (!existing) return null;
		const merged = changeNullPropertiesToEmptyString({ ...existing, ...endpoint });
		await this.repository.partialUpdate({
			id: endpoint._id,
			objectType: { name: TYPE_NAME, level: TYPE_LEVEL },
			name: merged.name,
			description: merged.description,
			metadata: this.metadata(merged),
			contentType: 'json',
			contentData: { endpoint: merged.endpoint },
		});
		return this.findOne(endpoint._id);
	}

	async delete(endpoint: DeleteSingleEndpointDTO): Promise<SingleEndpoint> {
		const deleted = await this.repository.delete(endpoint._id);
		return this.toEndpoint(deleted);
	}
}
