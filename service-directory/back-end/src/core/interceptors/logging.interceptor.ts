import {
	CallHandler,
	ExecutionContext,
	Injectable,
	Logger,
	NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

import { removeNonJsonProperties } from '../utils';

// Copied from the Accounts API.

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
	private readonly logger = new Logger(LoggingInterceptor.name);

	intercept(
		context: ExecutionContext,
		next: CallHandler<any>,
	): Observable<any> | Promise<Observable<any>> {
		const request = context.switchToHttp().getRequest();
		const userAgent = request.get('user-agent') || '';
		const { body, ip, method, path } = request;
		const className = context.getClass().name;
		const handler = context.getHandler().name;

		this.logger.log(
			`Invoked: ${method} ${path} ${userAgent} ${ip}: ${className} ${handler}`,
		);
		this.logger.log('Request body:', removeNonJsonProperties(body));

		const startDate = Date.now();
		return next.handle().pipe(
			tap((res) => {
				const response = context.switchToHttp().getResponse();
				const { statusCode } = response;
				const contentLength = response.get('content-length');
				const duration = Date.now() - startDate;
				this.logger.log(
					`Handled: ${method} ${path} ${statusCode} ${contentLength} — ${userAgent} ${ip} : ${duration}ms`,
				);
				this.logger.log(
					'Response data (stringified):',
					JSON.stringify(removeNonJsonProperties(res)),
				);
			}),
		);
	}
}
