import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of, switchMap, throwError } from 'rxjs';
import { IAuthConfig, IModuleConfig } from 'ds2-orchestration-portal-header';
//import { IAuthConfig, IModuleConfig } from 'ice-orchestration-portal-header';

export interface IAppConfig {
  apiEndpoint: string;
  gatewayEndpoint: string;
  configEndpoint: string;
  configKey: string;
  portalConfig: IPortalConfig;
}

export interface IPortalConfig {
  usePortal: boolean;
  security: IAuthConfig;
  modules: IModuleConfig[];
}

interface IConfigEntry {
  key: string;
  value: any;
}

@Injectable({ providedIn: 'root' })
export class ConfigService {
  public config: IAppConfig;

  constructor(private http: HttpClient) {}

  public load(): Promise<boolean> {
    if (this.config) {
      return Promise.resolve(true);
    }

    //hmmm1
    var test = "";

    return new Promise((resolve, reject) => {
      this.http
        .get('config.json')
        .pipe(
          switchMap((cfg: IAppConfig) => {
            if (cfg.configEndpoint) {
              const configKey = cfg.configKey || 'PORTAL_CONFIG';
              return this.http
                .get<IConfigEntry[]>(
                  `${cfg.configEndpoint}/api/config?key=${configKey}`
                )
                .pipe(
                  catchError((err) => {
                    return throwError(() => 'Error connecting to Config API');
                  }),
                  switchMap((cfgEntries) => {
                    if (!cfgEntries?.length) {
                      return throwError(() => 'Portal config not found');
                    }

                    cfg.portalConfig = cfgEntries[0].value;
                    return of(cfg);
                  })
                );
            }

            return of(cfg);
          })
        )
        .subscribe((cfg: IAppConfig) => {
          this.config = cfg;
          resolve(true);
        });
    });
  }
}
