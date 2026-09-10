export interface RepositoryObjectType {
	name: string;
	level: number;
}

export interface RepositoryObject {
	id?: string;
	ownerId?: string;
	externalId?: string;
	objectType?: RepositoryObjectType;
	name?: string;
	description?: string;
	comments?: string;
	version?: string;
	tags?: string[];
	metadata?: Record<string, unknown>;
	contentType?: 'json' | 'text' | 'value' | 'binary';
	contentData?: any;
	createdAt?: string;
	updatedAt?: string;
	[key: string]: any;
}

export interface RepositorySearch {
	externalId?: string;
	name?: string;
	version?: string;
	typeName?: string;
	typeLevel?: number;
	text?: string;
	tags?: string[];
	metadata?: Record<string, unknown>;
	contentType?: 'json' | 'text' | 'value' | 'binary';
	contentData?: any;
}

export interface RepositoryInsert {
	ownerId: string;
	externalId: string;
	objectType: RepositoryObjectType;
	name: string;
	description?: string;
	comments?: string;
	version: string;
	tags?: string[];
	metadata?: Record<string, unknown>;
	contentType: 'json' | 'text' | 'value';
	contentData: any;
}

export interface RepositoryPartialUpdate {
	ownerId: string;
	id: string;
	externalId?: string;
	objectType?: RepositoryObjectType;
	name?: string;
	version?: string;
	description?: string;
	comments?: string;
	tags?: string[];
	metadata?: Record<string, unknown>;
	contentType?: 'json' | 'text' | 'value';
	contentData?: any;
}

export interface RepositoryMutationResult {
	upsertedId?: string;
	acknowledged?: boolean;
	matchedCount?: number;
	modifiedCount?: number;
	deletedCount?: number;
	success?: boolean;
	message?: string;
	error?: string;
	code?: number;
}
