import { ApiProperty } from '@nestjs/swagger';

export class DeleteServiceDTO {
	@ApiProperty({
		description: 'The Mongo ID of the object representing the service',
	})
	readonly _id: string;
}
