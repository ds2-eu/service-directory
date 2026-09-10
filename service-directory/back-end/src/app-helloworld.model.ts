import { ApiProperty } from '@nestjs/swagger';

export class HelloWorld {
	@ApiProperty({
		description: 'The text “Hello World!”',
		example: 'Hello World!',
	})
	public message: string;
}
