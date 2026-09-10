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

import { CreateServiceDTO } from './dto/create-service.dto';
import { DeleteServiceDTO } from './dto/delete-service.dto';
import { PatchServiceDTO } from './dto/patch-service.dto';
import { Service } from './service.schema';
import { ServiceService } from './service.service';
import { changeNullPropertiesToEmptyString } from '../core/utils';
import { validateService } from './service.utils';

@Controller('service')
@ApiTags('service')
export class ServiceController {
	constructor(private readonly serviceService: ServiceService) {}

	@Get()
	@ApiOperation({ description: 'Returns all services in the database' })
	@ApiOkResponse({
		description: 'The services were returned successfully.',
		type: [Service],
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
			return await this.serviceService.findAll();
		} catch (error) {
			throw new HttpException(error instanceof Error ? error.message : String(error), 500);
		}
	}

	@Get(':id')
	@ApiOperation({ description: 'Returns one service from the database' })
	@ApiOkResponse({
		description: 'The service was returned successfully.',
		type: Service,
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
		description: 'A service with the ID does not exist.',
	})
	// @Roles({ roles: ['user'] })
	async findOne(@Param('id') id: string) {
		if (!id) {
			throw new HttpException('`id` is required.', 400);
		}
		// Mongo throws if `id` does not look like a possible ID,
		// and returns null if the ID was not found.
		try {
			const foundService = await this.serviceService.findOne(id);
			if (foundService) {
				return foundService;
			}
		} catch (error) {
			throw new HttpException(error instanceof Error ? error.message : String(error), 400);
		}
		// If `deletedService` was null.
		throw new HttpException(`No service has an ID of ${id}`, 404);
	}

	@Post()
	@ApiOperation({ description: 'Adds a service to the database' })
	@ApiCreatedResponse({
		description: 'The service was created successfully.',
		type: Service,
	})
	@ApiBadRequestResponse({
		description:
			'The request was not valid because required properties were missing or because a service would be a duplicate.',
	})
	@ApiUnauthorizedResponse({
		description: 'No user’s credentials were given in the request.',
	})
	@ApiForbiddenResponse({
		description: 'The user could not be authorised with the given credentials.',
	})
	// @Roles({ roles: ['user'] })
	async create(@Body() service: CreateServiceDTO) {
		if (await this.serviceService.wouldServiceNameBeDuplicate(service)) {
			throw new HttpException(
				`A service already exists with the name “${service.name}”.`,
				400,
			);
		}

		service.user ??= '0';
		service.company ??= '0';
		service.organization ??= '0';

		const sanitisedService = changeNullPropertiesToEmptyString(service);
		await validateService(sanitisedService);

		return await this.serviceService.create(sanitisedService);
	}

	@Patch()
	@ApiOperation({
		description:
			'Updates a service in the database, but only the fields given, and returns the updated service',
	})
	@ApiOkResponse({
		description: 'The service was updated successfully.',
		type: Service,
	})
	@ApiBadRequestResponse({
		description:
			'The request was not valid, perhaps because `_id` was not a plausible ID, or because the given name is the same as for a different service.',
	})
	@ApiUnauthorizedResponse({
		description: 'No user’s credentials were given in the request.',
	})
	@ApiForbiddenResponse({
		description: 'The user could not be authorised with the given credentials.',
	})
	@ApiNotFoundResponse({
		description: 'A service with the ID does not exist.',
	})
	// @Roles({ roles: ['user'] })
	async patch(@Body() service: PatchServiceDTO) {
		if (!service._id) {
			throw new HttpException('`_id` is required.', 400);
		}

		if (await this.serviceService.wouldPatchNameBeDuplicate(service)) {
			throw new HttpException(
				`A different service already exists with the name “${service.name}”.`,
				400,
			);
		}

		const foundService = await this.serviceService
			.findOne(service._id)
			.catch((error) => {
				throw new HttpException('Nothing was changed. ' + error, 400);
			});

		if (!foundService) {
			throw new HttpException(`No service has an ID of ${service._id}`, 404);
		}

		const sanitisedService = changeNullPropertiesToEmptyString({
			...foundService,
			...service,
		});
		await validateService(sanitisedService);

		return this.serviceService
			.patch(sanitisedService)
			.then(() => {
				// Read back the updated repository object so callers receive the persisted state.
				return this.serviceService.findOne(service._id);
			})
			.catch((error) => {
				throw new HttpException(error instanceof Error ? error.message : String(error), 500);
			});
	}

	@Delete()
	@ApiOperation({ description: 'Deletes a service from the database' })
	@ApiOkResponse({
		description: 'The service was deleted successfully.',
		type: Service,
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
		description: 'A service with the ID does not exist.',
	})
	// @Roles({ roles: ['user'] })
	async delete(@Body() service: DeleteServiceDTO) {
		if (!service._id) {
			throw new HttpException('`_id` is required.', 400);
		}
		// The repository adapter returns null when the object is not present in
		// the shared Service Directory owner namespace.
		try {
			const deletedService = await this.serviceService.delete(service);
			if (deletedService) {
				return deletedService;
			}
		} catch (error) {
			throw new HttpException('Nothing was deleted. ' + error, 400);
		}
		// If `deletedService` was null.
		throw new HttpException(`No service has an ID of ${service._id}`, 404);
	}
}
