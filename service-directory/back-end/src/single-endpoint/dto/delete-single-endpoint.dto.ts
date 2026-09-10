import { ApiProperty } from '@nestjs/swagger';

export class DeleteSingleEndpointDTO {
	@ApiProperty({
		description: 'The Mongo ID of the object representing the single endpoint',
	})
	readonly _id: string;
}
