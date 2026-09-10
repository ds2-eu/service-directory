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

import { Definition } from './definitions.schema';
import { DefinitionsService } from './definitions.service';
import { CreateDefinitionDTO } from './dto/create-definition.dto';
import { DeleteDefinitionDTO } from './dto/delete-definition.dto';
import { PatchDefinitionDTO } from './dto/patch-definition.dto';

@Controller('definitions')
@ApiTags('definitions')
export class DefinitionsController {

  constructor(
    private service: DefinitionsService
  ) {
  }

  @Get()
	@ApiOperation({
		description: 'Returns all definitions in the database',
	})
	@ApiOkResponse({
		description: 'The definitions were returned successfully.',
		type: [Definition],
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
			return await this.service.findAll();
		} catch (error) {
			throw new HttpException(error instanceof Error ? error.message : String(error), 500);
		}
	}

	@Get(':id')
	@ApiOperation({
		description: 'Look ups single definition by ID from the database',
	})
	@ApiOkResponse({
		description: 'The single definition was returned successfully.',
		type: Definition,
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
		description: 'A single definition with the ID does not exist.',
	})
	// @Roles({ roles: ['user'] })
	async findOne(@Param('id') id: string) {

    // Mongo throws if `id` does not look like a possible ID,
		// and returns null if the ID was not found.
		try {
			const foundRecord = await this.service.findById(id);
			if (foundRecord) {
				return foundRecord;
			}
		} catch (error) {
			throw new HttpException(error instanceof Error ? error.message : String(error), 400);
		}
		// If `deletedDefinition` was null.
		throw new HttpException(`No single definition has an ID of ${id}`, 404);
	}
	
	@Get('value/:name')
	@ApiOperation({
		description: 'Look ups single definition by Name from the database and returns value',
	})
	@ApiOkResponse({
		description: 'The value of the definition was returned successfully.',
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
		description: 'A single definition with the ID does not exist.',
	})
	// @Roles({ roles: ['user'] })
	async getValueByName(@Param('name') name: string) {
		if (!name) {
			throw new HttpException('Name is required.', 400);
		}

		try {
			const value = await this.service.getValueByName(name);
			if (value) {
				return value;
			}
		} catch (error) {
			throw new HttpException(error instanceof Error ? error.message : String(error), 400);
		}
		// If `deletedDefinition` was null.
		throw new HttpException(`No single definition has a name of ${name}`, 404);
	}

	@Post()
	@ApiOperation({ description: 'Adds a single definition to the database' })
	@ApiCreatedResponse({
		description: 'The single definition was created succesfully.',
		type: Definition,
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
	async create(@Body() request: CreateDefinitionDTO) {
		if (!request.name || !request.value) {
			throw new HttpException('`name` and `value` are required.', 400);
		}

    try {
      return await this.service.create(request);
		} catch (error) {
			throw new HttpException(error instanceof Error ? error.message : String(error), 500);
		}
	}

	@Patch()
	@ApiOperation({
		description:
			'Updates a single definition in the database and returns the updated single definition; requires all fields to be supplied again',
	})
	@ApiOkResponse({
		description: 'The single definition was updated successfully.',
		type: Definition,
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
		description: 'A single definition with the ID does not exist.',
	})
	// @Roles({ roles: ['user'] })
	async patch(@Body() request: PatchDefinitionDTO) {
		if (!request.id) {
			throw new HttpException('`id` is required.', 400);
		}

		try {
			const patchedRecord = await this.service.patch(request);
			if (patchedRecord) {
				return patchedRecord;
			}
		} catch (error) {
			throw new HttpException('Nothing was changed. ' + error, 400);
		}
		throw new HttpException(
			`No single definition has an ID of ${request.id}`,
			404,
		);

	}

	@Delete()
	@ApiOperation({
		description: 'Deletes a single definition from the database',
	})
	@ApiOkResponse({
		description: 'The single definition was deleted successfully.',
		type: Definition,
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
		description: 'A single definition with the ID does not exist.',
	})
	// @Roles({ roles: ['user'] })
	async delete(@Body() request: DeleteDefinitionDTO) {
		if (!request.id) {
			throw new HttpException('`id` is required.', 400);
		}

		// Mongo throws if `_id` does not look like a possible ID,
		// and returns null if the ID was not found.
		try {
			const deletedRecord = await this.service.delete(request);
			if (deletedRecord) {
				return deletedRecord;
			}
		} catch (error) {
			throw new HttpException('Nothing was deleted. ' + error, 400);
		}
		// If `deletedRecord` was null.
		throw new HttpException(
			`No single definition has an ID of ${request.id}`,
			404,
		);
	}

}
