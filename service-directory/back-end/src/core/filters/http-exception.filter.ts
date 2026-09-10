import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
	Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { removeNonJsonProperties } from '../utils';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
	private logger = new Logger(HttpExceptionFilter.name);

	// Preserve the legacy friendly message for malformed ObjectId errors that may
	// be returned by the repository implementation. Other messages pass through unchanged.
	private rewriteErrorMessage(error: HttpException): string {
		const regex =
			/^Cast to ObjectId failed for value "(.*)" \(type string\) at path "_id" for model "(Service|SingleEndpoint)"$/;
		const regexResults = regex.exec(error.message);
		if (regexResults) {
			// We’re reading matches from the capturing groups in the regex.
			const invalidInput = regexResults[1];
			const itemType = regexResults[2];

			switch (itemType) {
				case 'Service':
					return `“${invalidInput}” is not a plausible ID for a service.`;
				case 'SingleEndpoint':
					return `“${invalidInput}” is not a plausible ID for a single endpoint.`;
			}
		}

		// If the regex didn’t match…
		return error.message;
	}

	catch(exception: HttpException, host: ArgumentsHost) {
		const context = host.switchToHttp();
		const request = context.getRequest<Request>();
		const response = context.getResponse<Response>();
		const status = exception.getStatus();

		const errorResponse = {
			error: this.rewriteErrorMessage(exception),
			statusCode: status,
			success: false,
		};

		this.logger.error({
			timestamp: new Date().toISOString(),
			method: request.method,
			path: request.url,
			requestBody: removeNonJsonProperties(request.body),
			response: errorResponse,
		});

		if (![400, 401, 403, 404, 500].includes(status)) {
			this.logger.warn(`Error has an unexpected status-code ${status}.`);
		}

		response.status(status).json(errorResponse);
	}
}
