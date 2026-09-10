import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ConfigService } from '@app/core/config';
import { Service } from './service.interface';

@Injectable({
  providedIn: 'root',
})
export class ServicesService {
  constructor(
    private httpClient: HttpClient,
    private cfgService: ConfigService
  ) {}

  private get url(): string {
    return this.cfgService.config.apiEndpoint;
  }

  public getServices(): Observable<Service[]> {
    return this.httpClient.get<Service[]>(this.url + '/service');
  }

  public getService(_id: string): Observable<Service> {
    return this.httpClient.get<Service>(this.url + '/service/' + _id);
  }

  public addService(newService: Service): Observable<Service> {
    delete newService._id;
    return this.httpClient.post<Service>(this.url + '/service', newService);
  }

  public saveService(newService: Service): Observable<Service> {
    return this.httpClient.patch<Service>(this.url + '/service', newService);
  }

  public deleteService(service: Service): Observable<Service> {
    return this.httpClient.delete<Service>(this.url + '/service', {
      body: service,
    });
  }
}
