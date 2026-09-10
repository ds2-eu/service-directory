import { HttpException } from '@nestjs/common';
const yaml = require('js-yaml');

import { isValidUrl, doesReturnOpenApiSpec } from '../core/utils';
import { CreateServiceDTO } from './dto/create-service.dto';
import { validateOpenApiDefinition } from '../core/utils/validateOpenApiDefinition';

async function validateService(service: CreateServiceDTO): Promise<any> {
	if (!service.name) {
		throw new HttpException('`name` is required.', 400);
	}

	//ensure we cast from '' to boolean
	if (!service.hideFromOrchestration) {
		service.hideFromOrchestration = false;
	}

	if (/^\s*$/.test(service.name)) {
		throw new HttpException('`name` cannot be whitespace.', 400);
	}

	if (service.openApiYamlEndpoint) {
		if (!isValidUrl(service.openApiYamlEndpoint)) {
			throw new HttpException(
				'`openApiYamlEndpoint` must begin with “http://” or “https://”, and must point to an OpenAPI specification file.',
				400,
			);
		}

		if (
			// The == '0' catches both 0 and '0'
			service.openApiUiEndpoint == '0' ||
			(service.openApiUiEndpoint && !isValidUrl(service.openApiUiEndpoint))
		) {
			throw new HttpException(
				'`openApiUiEndpoint` must be a valid URL if it is specified.',
				400,
			);
		}

		if (!(await doesReturnOpenApiSpec(service.openApiYamlEndpoint))) {
			throw new HttpException(
				`No OpenAPI specification file was found at ${service.openApiYamlEndpoint}`,
				400,
			);
		}
	} else {
		await validateOpenApiDefinition(service.openApiDefinition);
	}
}

export { validateService };
