import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import {
	AuthGuard,
	KeycloakConnectModule,
	ResourceGuard,
	RoleGuard,
} from 'nest-keycloak-connect';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggingInterceptor } from './core/interceptors/logging.interceptor';
import { ServiceModule } from './service/service.module';
import { SingleEndpointModule } from './single-endpoint/single-endpoint.module';
import { HttpExceptionFilter } from './core/filters/http-exception.filter';
import { DefinitionsModule } from './definitions/definitions.module';
import { RepositoryModule } from './repository/repository.module';

if (process.env.NODE_ENV !== 'production') {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	require('dotenv').config();
}

const SECURITY_ENABLED = process.env.SECURITY_ENABLED === 'true';

const securityImportsIfEnabled = SECURITY_ENABLED
	? [
			KeycloakConnectModule.register({
				authServerUrl: process.env.AUTH_URL,
				realm: process.env.REALM,
				clientId: process.env.CLIENT_ID,
				secret: process.env.CLIENT_SECRET,
			}),
	  ]
	: [];

const securityProvidersIfEnabled = SECURITY_ENABLED
	? [
			{
				provide: APP_GUARD,
				useClass: AuthGuard,
			},
			{
				provide: APP_GUARD,
				useClass: ResourceGuard,
			},
			{
				provide: APP_GUARD,
				useClass: RoleGuard,
			},
	  ]
	: [];

@Module({
	imports: [
		...securityImportsIfEnabled,
		RepositoryModule,
		ServiceModule,
		SingleEndpointModule,
		DefinitionsModule,
	],
	controllers: [AppController],
	providers: [
		AppService,
		...securityProvidersIfEnabled,
		{
			provide: APP_INTERCEPTOR,
			useClass: LoggingInterceptor,
		},
		{
			provide: APP_FILTER,
			useClass: HttpExceptionFilter,
		},
	],
})
export class AppModule {}
