import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AuthService } from 'ds2-orchestration-portal-header';
//import { AuthService } from 'ice-orchestration-portal-header';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared';
import { GatewayModule } from './gateway/gateway.module';
import { ServicesModule } from './services/services.module';
import { CoreModule } from './core/core.module';
import { ConfigService } from './core/config';
import { DefinitionsModule } from './definitions';


@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CoreModule,
    AppRoutingModule,
    SharedModule,
    ServicesModule,
    GatewayModule,
    DefinitionsModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initApp,
      deps: [ConfigService, AuthService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}

export function initApp(config: ConfigService, auth: AuthService) {
  return () => {
    return config.load().then(() => {
      //if no security set then skip auth initialization
      const cfg = config.config;
      if (!cfg.portalConfig?.usePortal || !cfg.portalConfig?.security) {
        return Promise.resolve();
      }

      return auth.initialize(cfg.portalConfig.security);
    });
  };
}
