import { ApiProperty } from '@nestjs/swagger';

export class PatchSingleEndpointDTO {
	@ApiProperty({
		description: 'The Mongo ID of the object representing the single endpoint',
	})
	readonly _id: string;

	@ApiProperty({
		description:
			'A name for the single endpoint; it cannot be empty or whitespace',
	})
	name: string;

	@ApiProperty({ description: 'The endpoint (URL) itself', required: false })
	endpoint: string;

	@ApiProperty({
		description: 'A description of the single endpoint',
		required: false,
	})
	description?: string;
}
