import { HttpException } from "@nestjs/common";

const SwaggerParser = require('@apidevtools/swagger-parser');
const yaml = require('js-yaml');

export async function validateOpenApiDefinition(value: string): Promise<any> {

  // validate open api definition
  const swagger = yaml.load(value);
  if (typeof swagger === 'string') {
    throw new HttpException('OpenAPI definition not valid', 400);
  }

  try {
    await SwaggerParser.validate(swagger);
  } catch {
    throw new HttpException('OpenAPI definition not valid', 400);
  }
}