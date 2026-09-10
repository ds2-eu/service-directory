import { Injectable } from '@nestjs/common';
import { HelloWorld } from './app-helloworld.model';

@Injectable()
export class AppService {
	getHello(): HelloWorld {
		return { message: 'Hello World!' };
	}
}
