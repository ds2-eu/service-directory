import { ApiProperty } from '@nestjs/swagger';

export class DeleteDefinitionDTO {
	@ApiProperty({
		description: 'The Mongo ID of the object representing the single definition',
	})
	public id: string;
}
