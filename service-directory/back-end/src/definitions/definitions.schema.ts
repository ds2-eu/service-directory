import { ApiProperty } from '@nestjs/swagger';

/**
 * Public Definition API model. Persistence is handled by RepositoryService.
 */
export class Definition {
	@ApiProperty({ description: 'Definition name' })
	name: string;

	@ApiProperty({ description: 'Value of the definition' })
	value: string;

	@ApiProperty({
		description:
			'The Objects Repository object ID, exposed as `_id` for backwards compatibility',
	})
	readonly _id?: string;
}
