import {
	Body,
	Controller,
	Delete,
	Get,
	HttpException,
	Param,
	Patch,
	Post,
} from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiCreatedResponse,
	ApiForbiddenResponse,
	ApiInternalServerErrorResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Roles } from 'nest-keycloak-connect';

import { isValidUrl } from '../core/utils';
import { CreateSingleEndpointDTO } from './dto/create-single-endpoint.dto';
import { DeleteSingleEndpointDTO } from './dto/delete-single-endpoint.dto';
import { PatchSingleEndpointDTO } from './dto/patch-single-endpoint.dto';
import { SingleEndpoint } from './single-endpoint.schema';
import { SingleEndpointService } from './single-endpoint.service';

@Controller('single-endpoint')
@ApiTags('single-endpoint')
export class SingleEndpointController {
	constructor(private readonly singleEndpointService: SingleEndpointService) {}

	@Get()
	@ApiOperation({
		description: 'Returns all single endpoints in the database',
	})
	@ApiOkResponse({
		description: 'The single endpoints were returned successfully.',
		type: [SingleEndpoint],
	})
	@ApiUnauthorizedResponse({
		description: 'No user’s credentials were given in the request.',
	})
	@ApiForbiddenResponse({
		description: 'The user could not be authorised with the given credentials.',
	})
	@ApiInternalServerErrorResponse({ description: 'Internal server error.' })
	// @Roles({ roles: ['user'] })
	async findAll() {
		try {
			return await this.singleEndpointService.findAll();
		} catch (error) {
			throw new HttpException(error instanceof Error ? error.message : String(error), 500);
		}
	}

	@Get(':id')
	@ApiOperation({
		description: 'Returns one single endpoint from the database',
	})
	@ApiOkResponse({
		description: 'The single endpoint was returned successfully.',
		type: SingleEndpoint,
	})
	@ApiBadRequestResponse({
		description:
			'The request was not valid, perhaps because `id` was not a plausible ID.',
	})
	@ApiUnauthorizedResponse({
		description: 'No user’s credentials were given in the request.',
	})
	@ApiForbiddenResponse({
		description: 'The user could not be authorised with the given credentials.',
	})
	@ApiNotFoundResponse({
		description: 'A single endpoint with the ID does not exist.',
	})
	// @Roles({ roles: ['user'] })
	async findOne(@Param('id') id: string) {
		if (!id) {
			throw new HttpException('`id` is required.', 400);
		}
		// Mongo throws if `id` does not look like a possible ID,
		// and returns null if the ID was not found.
		try {
			const foundEndpoint = await this.singleEndpointService.findOne(id);
			if (foundEndpoint) {
				return foundEndpoint;
			}
		} catch (error) {
			throw new HttpException(error instanceof Error ? error.message : String(error), 400);
		}
		// If `deletedEndpoint` was null.
		throw new HttpException(`No single endpoint has an ID of ${id}`, 404);
	}

	@Post()
	@ApiOperation({ description: 'Adds a single endpoint to the database' })
	@ApiCreatedResponse({
		description: 'The single endpoint was created succesfully.',
		type: SingleEndpoint,
	})
	@ApiBadRequestResponse({
		description:
			'The request was not valid because a required property was missing.',
	})
	@ApiUnauthorizedResponse({
		description: 'No user’s credentials were given in the request.',
	})
	@ApiForbiddenResponse({
		description: 'The user could not be authorised with the given credentials.',
	})
	// @Roles({ roles: ['user'] })
	async create(@Body() endpoint: CreateSingleEndpointDTO) {
		if (!endpoint.name || !endpoint.endpoint) {
			throw new HttpException('`name` and `endpoint` are required.', 400);
		}

		if (/^\s*$/.test(endpoint.name)) {
			throw new HttpException('`name` cannot be whitespace.', 400);
		}

		if (!isValidUrl(endpoint.endpoint)) {
			throw new HttpException('`endpoint` must be a URL.', 400);
		}

		return await this.singleEndpointService.create(endpoint);
	}

	@Patch()
	@ApiOperation({
		description:
			'Updates a single endpoint in the database and returns the updated single endpoint; requires all fields to be supplied again',
	})
	@ApiOkResponse({
		description: 'The single endpoint was updated successfully.',
		type: SingleEndpoint,
	})
	@ApiBadRequestResponse({
		description:
			'The request was not valid, perhaps because `_id` was not a plausible ID.',
	})
	@ApiUnauthorizedResponse({
		description: 'No user’s credentials were given in the request.',
	})
	@ApiForbiddenResponse({
		description: 'The user could not be authorised with the given credentials.',
	})
	@ApiNotFoundResponse({
		description: 'A single endpoint with the ID does not exist.',
	})
	// @Roles({ roles: ['user'] })
	async patch(@Body() endpoint: PatchSingleEndpointDTO) {
		if (!endpoint._id) {
			throw new HttpException('`_id` is required.', 400);
		}

		if (endpoint.name === null || endpoint.endpoint === null) {
			throw new HttpException('`name` and `endpoint` cannot be null.', 400);
		}

		if (/^\s*$/.test(endpoint.name)) {
			throw new HttpException(
				'`name` cannot be the empty string or whitespace.',
				400,
			);
		}

		if (endpoint.endpoint !== undefined && !isValidUrl(endpoint.endpoint)) {
			throw new HttpException('`endpoint` must be a URL.', 400);
		}

		// Mongo throws if `_id` does not look like a possible ID,
		// and returns null if the ID was not found.
		try {
			const patchedEndpoint = await this.singleEndpointService.patch(endpoint);
			if (patchedEndpoint) {
				return patchedEndpoint;
			}
		} catch (error) {
			throw new HttpException('Nothing was changed. ' + error, 400);
		}
		// If `patchedEndpoint` was null.
		throw new HttpException(
			`No single endpoint has an ID of ${endpoint._id}`,
			404,
		);
	}

	@Delete()
	@ApiOperation({
		description: 'Deletes a single endpoint from the database',
	})
	@ApiOkResponse({
		description: 'The single endpoint was deleted successfully.',
		type: SingleEndpoint,
	})
	@ApiBadRequestResponse({
		description:
			'The request was not valid, perhaps because `_id` was not a plausible ID.',
	})
	@ApiUnauthorizedResponse({
		description: 'No user’s credentials were given in the request.',
	})
	@ApiForbiddenResponse({
		description: 'The user could not be authorised with the given credentials.',
	})
	@ApiNotFoundResponse({
		description: 'A single endpoint with the ID does not exist.',
	})
	// @Roles({ roles: ['user'] })
	async delete(@Body() endpoint: DeleteSingleEndpointDTO) {
		if (!endpoint._id) {
			throw new HttpException('`_id` is required.', 400);
		}
		// Mongo throws if `_id` does not look like a possible ID,
		// and returns null if the ID was not found.
		try {
			const deletedEndpoint = await this.singleEndpointService.delete(endpoint);
			if (deletedEndpoint) {
				return deletedEndpoint;
			}
		} catch (error) {
			throw new HttpException('Nothing was deleted. ' + error, 400);
		}
		// If `deletedEndpoint` was null.
		throw new HttpException(
			`No single endpoint has an ID of ${endpoint._id}`,
			404,
		);
	}
}
