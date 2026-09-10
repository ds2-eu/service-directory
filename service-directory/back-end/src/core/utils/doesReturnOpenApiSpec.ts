import { HttpService } from '@nestjs/axios';
import { Logger } from '@nestjs/common';

// HttpService is Nest.js’s wrapper around Axios and returns observables.
// The underlying Axios instance is accessed as httpService.axiosRef
// which is useful when we don’t want to handle observables.
const httpService = new HttpService();

const logger = new Logger('doesReturnOpenApiSpec');

// Returns true if the URL points to an Open API specification file.
export function doesReturnOpenApiSpec(url: string): Promise<boolean> {
	logger.log('Request for OpenAPI spec at URL: ' + url);
	return httpService.axiosRef
		.get(url)
		.then((response) => {
			// If response is Yaml, not Json
			if (response?.headers?.['content-type'] === 'application/x-yaml') {
				// We’re not trying to parse the Yaml, just checking it includes some text.
				return (response.data as string)?.includes('openapi:');
			}
			// If response is Json
			return response?.data?.openapi;
		})
		.catch((error) => {
			logger.error(error);
		})
		.then((response) => {
			return !!response;
		});
}
