import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface IAppConfig {
  apiEndpoint: string;
  gatewayEndpoint?: string;
}

@Injectable({ providedIn: 'root' })
export class ConfigService {
  public config: IAppConfig;

  constructor(private http: HttpClient) {}

  public load(): Promise<boolean> {
    if (this.config) {
      return Promise.resolve(true);
    }

    return new Promise((resolve, reject) => {
      this.http.get<IAppConfig>('config.json').subscribe({
        next: (cfg) => {
          this.config = cfg;
          resolve(true);
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }
}