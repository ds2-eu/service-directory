import { ApiProperty } from '@nestjs/swagger';

export class CreateSingleEndpointDTO {
	@ApiProperty({
		description:
			'A name for the single endpoint; it cannot be empty or whitespace',
	})
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
			'The user that is adding the single endpoint to the Service Directory',
		required: true,
	})
	user: string;

	@ApiProperty({
		description:
			'The company that the user belongs to who is adding the single endpoint to the Service Directory',
		required: true,
	})
	company: string;

	@ApiProperty({
		description:
			'The organization that the user belongs to who is adding the single endpoint to the Service Directory',
		required: true,
	})
	organization: string;
}
