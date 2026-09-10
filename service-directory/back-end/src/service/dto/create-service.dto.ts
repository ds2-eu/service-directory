import { ApiProperty } from '@nestjs/swagger';

export class CreateServiceDTO {
	@ApiProperty({
		description: 'A name for the service; it cannot be empty or whitespace',
	})
	name: string;

	@ApiProperty({
		description: 'A description of the service',
		required: false,
	})
	description?: string;

	@ApiProperty({
		description:
			'The endpoint that gives the Open API specification for the service, in Json or otherwise in Yaml',
		example: 'https://service-api.orchestration-test.icelab.cloud/api-json',
	})
	openApiYamlEndpoint: string;

	@ApiProperty({
		description:
			'The endpoint that gives the Swagger user-interface for the service, if the service uses Swagger',
		example: 'https://service-api.orchestration-test.icelab.cloud/api',
		required: false,
	})
	openApiUiEndpoint?: string;

	@ApiProperty({
		description:
			'The Open API definition by text, if service does not expose an Open API endpoint',
	})
	openApiDefinition: string;

	@ApiProperty({
		description:
			'Whether to hide this service in Orchestration/Process Designer',
	})
	hideFromOrchestration: boolean;

	@ApiProperty({
		description: 'The user that is adding the service to the Service Directory',
		required: true,
	})
	user: string;

	@ApiProperty({
		description:
			'The company that the user belongs to who is adding the service to the Service Directory',
		required: true,
	})
	company: string;

	@ApiProperty({
		description:
			'The organization that the user belongs to who is adding the service to the Service Directory',
		required: true,
	})
	organization: string;
}
