import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { HelloWorld } from './app-helloworld.model';
import { AppService } from './app.service';
import { Unprotected } from 'nest-keycloak-connect';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	@ApiOperation({ description: 'Get the text “Hello World!”' })
	@ApiOkResponse({
		description: 'The text was returned successfully.',
		type: HelloWorld,
	})
	@Unprotected()
	getHello() {
		return this.appService.getHello();
	}
}
