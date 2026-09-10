import { ApiProperty } from '@nestjs/swagger';

export class CreateDefinitionDTO {
	@ApiProperty({
		description:
			'A name for the definition; it cannot be empty or whitespace',
	})
	name: string;

	@ApiProperty({ description: 'Content (YAML or JSON) for the definition' })
	value: string;
}
