import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

import {
	RepositoryInsert,
	RepositoryMutationResult,
	RepositoryObject,
	RepositoryPartialUpdate,
	RepositorySearch,
} from './repository.types';

/**
 * Adapter for the ICE Objects Repository.
 *
 * Service Directory deliberately uses one shared owner namespace so that every
 * Service Directory deployment pointing at the same repository sees the same
 * catalogue. User/organisation values belong in object metadata, not ownerId.
 */
@Injectable()
export class RepositoryService {
	private readonly baseUrl: string;
	readonly ownerId: string;
	private readonly apiKey: string;

	constructor(private readonly http: HttpService) {
		this.baseUrl = (process.env.REPOSITORY_API_URL || '').replace(/\/$/, '');
		this.ownerId = process.env.REPOSITORY_OWNER_ID || 'service-directory';
		this.apiKey = process.env.REPOSITORY_API_KEY || '';

		if (!this.baseUrl) {
			throw new Error('REPOSITORY_API_URL must be configured.');
		}
		if (!this.apiKey) {
			throw new Error('REPOSITORY_API_KEY must be configured.');
		}
	}

	private get options() {
		return {
			headers: {
				'API-KEY': this.apiKey,
			},
		};
	}

	private rethrow(error: any): never {
		const status = error?.response?.status || 500;
		const body = error?.response?.data;
		const message = body?.detail || body?.message || error?.message || body || error;
		throw new HttpException(message, status);
	}

	private isOwned(object: RepositoryObject | null): boolean {
		return Boolean(object && object.ownerId === this.ownerId);
	}

	/**
	 * Repository /get is global by object ID, so enforce the shared Service
	 * Directory owner locally before returning anything to callers.
	 */
	async get(id: string): Promise<RepositoryObject | null> {
		try {
			const response = await firstValueFrom(
				this.http.get(`${this.baseUrl}/get/${encodeURIComponent(id)}`, {
					...this.options,
					params: { includeContent: 'true' },
				}),
			);
			const object = (response.data || null) as RepositoryObject | null;
			return this.isOwned(object) ? object : null;
		} catch (error) {
			if (error?.response?.status === 404) return null;
			this.rethrow(error);
		}
	}

	async search(criteria: RepositorySearch): Promise<RepositoryObject[]> {
		try {
			const response = await firstValueFrom(
				this.http.post(
					`${this.baseUrl}/search/${encodeURIComponent(this.ownerId)}`,
					criteria,
					{
						...this.options,
						params: { includeContent: 'true', pageSize: 1000 },
					},
				),
			);
			return Array.isArray(response.data) ? response.data : [];
		} catch (error) {
			if (error?.response?.status === 404) return [];
			this.rethrow(error);
		}
	}

	/**
	 * /insert returns a mutation result ({ upsertedId, success, ... }), not the
	 * created repository object. Fetch it afterwards to preserve the existing
	 * Service Directory API contract which returns the created entity including ID.
	 */
	async insert(object: Omit<RepositoryInsert, 'ownerId'>): Promise<RepositoryObject> {
		try {
			const response = await firstValueFrom(
				this.http.post(
					`${this.baseUrl}/insert`,
					{ ...object, ownerId: this.ownerId },
					this.options,
				),
			);
			const result = response.data as RepositoryMutationResult;
			if (result?.success === false) {
				throw new HttpException(result.message || result.error || 'Repository insert failed.', 409);
			}
			if (!result?.upsertedId) {
				throw new HttpException('Repository insert did not return an object ID.', 502);
			}
			const created = await this.get(String(result.upsertedId));
			if (!created) {
				throw new HttpException('Repository object was inserted but could not be read back.', 502);
			}
			return created;
		} catch (error) {
			if (error instanceof HttpException) throw error;
			this.rethrow(error);
		}
	}

	async partialUpdate(
		object: Omit<RepositoryPartialUpdate, 'ownerId'>,
	): Promise<RepositoryMutationResult> {
		try {
			const response = await firstValueFrom(
				this.http.post(
					`${this.baseUrl}/partial-update`,
					{ ...object, ownerId: this.ownerId },
					this.options,
				),
			);
			const result = response.data as RepositoryMutationResult;
			if (result?.matchedCount === 0) {
				throw new HttpException('Repository object was not found for this owner.', 404);
			}
			return result;
		} catch (error) {
			if (error instanceof HttpException) throw error;
			this.rethrow(error);
		}
	}

	/**
	 * Repository /delete is also global by object ID. Read first and only issue
	 * the delete when the object belongs to the shared Service Directory owner.
	 */
	async delete(id: string): Promise<RepositoryObject | null> {
		const existing = await this.get(id);
		if (!existing) return null;

		try {
			const response = await firstValueFrom(
				this.http.delete(`${this.baseUrl}/delete/${encodeURIComponent(id)}`, this.options),
			);
			const result = response.data as RepositoryMutationResult;
			if (result?.success === false) {
				throw new HttpException(result.message || 'Repository delete failed.', 502);
			}
			return existing;
		} catch (error) {
			if (error instanceof HttpException) throw error;
			if (error?.response?.status === 404) return null;
			this.rethrow(error);
		}
	}

	getId(object: RepositoryObject): string | undefined {
		return object?.id;
	}
}
