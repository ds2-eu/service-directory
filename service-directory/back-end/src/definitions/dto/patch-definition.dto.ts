import { ApiProperty } from '@nestjs/swagger';
import { CreateDefinitionDTO } from './create-definition.dto';

export class PatchDefinitionDTO extends CreateDefinitionDTO {
	@ApiProperty({
		description: 'The Mongo ID of the object representing the single definition',
	})
	public id: string;

}
