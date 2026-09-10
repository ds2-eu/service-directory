import {
	isValidUrl,
	doesReturnOpenApiSpec,
	isNullOrWhiteSpace,
	removeNonJsonProperties,
} from './index';

describe('Utility functions testing URLs', () => {
	describe('Utility functions testing URLs', () => {
		const openApiSpecs = [
			'https://service-api.orchestration-test.icelab.cloud/api-json',
			'https://service-directory-api.orchestration-test.icelab.cloud/api-json',
			'https://software.zdmp.eu/openapi/edge-tier/digital-twin/openapi.yaml',
		];
		test.each(openApiSpecs)('should say a valid URL is %s', (url) => {
			expect(isValidUrl(url)).toBe(true);
		});
		test.each(openApiSpecs)(
			'should say an OpenAPI specification is %s',
			(url) => {
				expect(doesReturnOpenApiSpec(url)).resolves.toBe(true);
			},
		);

		const urlsButNotOpenApiSpecs = [
			'http://informationcatalyst.com',
			'https://service-api.orchestration-test.icelab.cloud/api',
			'https://service-directory-api.orchestration-test.icelab.cloud/service',
		];
		test.each(urlsButNotOpenApiSpecs)('should say a valid URL is %s', (url) => {
			expect(isValidUrl(url)).toBe(true);
		});
		test.each(urlsButNotOpenApiSpecs)(
			'should NOT say an OpenAPI specification is %s',
			(url) => {
				expect(doesReturnOpenApiSpec(url)).resolves.toBe(false);
			},
		);

		const invalidUrls = [
			' https://service-api.orchestration-test.icelab.cloud/api-json',
			'something random',
			'mailto://duncan.ritchie@informationcatalyst.com',
			'',
			'0',
		];
		test.each(invalidUrls)('should say an invalid URL is %s', (url) => {
			expect(isValidUrl(url)).toBe(false);
		});
	});

	describe('Utility method checking for null or whitespace', () => {
		const nullOrWhitespaceValues = ['', '   ', '\t', undefined, null];
		const neitherNullNorWhitespaceValues = ['Example', '   Example', '123'];

		test.each(nullOrWhitespaceValues)(
			'should say %s is null or whitespace',
			(value) => {
				expect(isNullOrWhiteSpace(value)).toBe(true);
			},
		);

		test.each(neitherNullNorWhitespaceValues)(
			'should say %s is neither null nor whitespace',
			(value) => {
				expect(isNullOrWhiteSpace(value)).toBe(false);
			},
		);
	});

	describe('Utility method for making Json valid', () => {
		const invalidJsonObject = {
			a: 'a string',
			b: undefined,
			c: new Set(['foo', 'bar']),
			d: null,
		};

		const validJsonObject = { a: 'a string', c: {}, d: null };

		expect(removeNonJsonProperties(invalidJsonObject)).toEqual(validJsonObject);
	});
});
