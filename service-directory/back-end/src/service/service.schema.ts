import { ApiProperty } from '@nestjs/swagger';

/**
 * Public Service Directory API model.
 *
 * The filename is retained for backwards compatibility with existing imports,
 * but this class is no longer a Mongoose schema. Persistence is handled by
 * RepositoryService.
 */
export class Service {
	@ApiProperty({ description: 'A name for the service' })
	name: string;

	@ApiProperty({
		description: 'A description of the service',
		required: false,
	})
	description?: string;

	@ApiProperty({
		description:
			'The endpoint that gives the OpenAPI specification for the service, in JSON or YAML',
		example: 'https://service-api.orchestration-test.icelab.cloud/api-json',
	})
	openApiYamlEndpoint: string;

	@ApiProperty({
		description:
			'The endpoint that gives the Swagger user interface for the service, if the service uses Swagger',
		example: 'https://service-api.orchestration-test.icelab.cloud/api',
		required: false,
	})
	openApiUiEndpoint?: string;

	@ApiProperty({
		description:
			'The OpenAPI definition as text, if the service does not expose an OpenAPI endpoint',
	})
	openApiDefinition: string;

	@ApiProperty({
		description: 'Whether to hide this service in Orchestration/Process Designer',
	})
	hideFromOrchestration: boolean;

	@ApiProperty({
		description: 'The user that added the service to the Service Directory',
		required: true,
	})
	user: string;

	@ApiProperty({
		description:
			'The company that the user belongs to who added the service to the Service Directory',
		required: true,
	})
	company: string;

	@ApiProperty({
		description:
			'The organization that the user belongs to who added the service to the Service Directory',
		required: true,
	})
	organization: string;

	@ApiProperty({
		description:
			'The Objects Repository object ID, exposed as `_id` for backwards compatibility',
	})
	readonly _id: string;

	@ApiProperty({
		description:
			'Legacy compatibility field. Always 0 because Objects Repository does not expose MongoDB `__v`.',
	})
	readonly __v: number;
}
