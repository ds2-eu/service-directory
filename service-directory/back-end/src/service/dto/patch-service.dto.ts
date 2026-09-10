import { ApiProperty } from '@nestjs/swagger';

export class PatchServiceDTO {
	@ApiProperty({
		description: 'The Mongo ID of the object representing the service',
	})
	readonly _id: string;

	// The properties below are the same as CreateServiceDTO, except that none are required.
	@ApiProperty({
		description: 'A name for the service; it cannot be empty or whitespace',
		required: false,
	})
	name?: string;

	@ApiProperty({
		description: 'A description of the service',
		required: false,
	})
	description?: string;

	@ApiProperty({
		description:
			'The endpoint that gives the Open API specification for the service, in Json or otherwise in Yaml',
		example: 'https://service-api.orchestration-test.icelab.cloud/api-json',
		required: false,
	})
	openApiYamlEndpoint?: string;

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
		required: false,
	})
	openApiDefinition?: string;

	@ApiProperty({
		description:
			'Whether to hide this service in Orchestration/Process Designer',
		required: false,
	})
	hideFromOrchestration?: boolean;

	@ApiProperty({
		description: 'The user that is adding the service to the Service Directory',
		required: false,
	})
	user?: string;

	@ApiProperty({
		description:
			'The company that the user belongs to who is adding the service to the Service Directory',
		required: false,
	})
	company?: string;

	@ApiProperty({
		description:
			'The organization that the user belongs to who is adding the service to the Service Directory',
		required: false,
	})
	organization?: string;
}
