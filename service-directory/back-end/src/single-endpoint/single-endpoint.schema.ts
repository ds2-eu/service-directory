import { ApiProperty } from '@nestjs/swagger';

/**
 * Public Single Endpoint API model. Persistence is handled by RepositoryService.
 */
export class SingleEndpoint {
	@ApiProperty({ description: 'A name for the single endpoint' })
	name: string;

	@ApiProperty({ description: 'The endpoint (URL) itself' })
	endpoint: string;

	@ApiProperty({
		description: 'A description of the single endpoint',
		required: false,
	})
	description?: string;

	@ApiProperty({
		description:
			'The user that added the single endpoint to the Service Directory',
		required: true,
	})
	user: string;

	@ApiProperty({
		description:
			'The company that the user belongs to who added the single endpoint to the Service Directory',
		required: true,
	})
	company: string;

	@ApiProperty({
		description:
			'The organization that the user belongs to who added the single endpoint to the Service Directory',
		required: true,
	})
	organization: string;

	@ApiProperty({
		description:
			'The Objects Repository object ID, exposed as `_id` for backwards compatibility',
	})
	readonly _id: string;

	@ApiProperty({
		description:
			'Legacy compatibility field. Always 0 because Objects Repository does not expose MongoDB `__v`.',
	})
	readonly __v: number;
}
