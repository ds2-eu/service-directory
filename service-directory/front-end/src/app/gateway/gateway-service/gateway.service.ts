import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { RequestService } from '../request/request.service';
import {
  SecurityDefinition,
  IGetSecurityDefinitionListRequest,
  ITestServiceRequest,
} from './defs';

@Injectable({
  providedIn: 'root',
})
export class GatewayService {
  constructor(private request: RequestService) {}

  public getList(
    filter?: IGetSecurityDefinitionListRequest
  ): Observable<SecurityDefinition[]> {
    return this.request.get('/api/services', filter);
  }

  public getSecurityDefinitionById(
    serviceId: string
  ): Observable<SecurityDefinition> {
    return this.request.get(`/api/services/${serviceId}`);
  }

  public getSecurityDefinitionWithSimilarUrl(
    url: string
  ): Observable<SecurityDefinition> {
    return this.getList().pipe(
      map((list) => {
        return (
          list.find((definition) => definition.url === url) ||
          list.find((definition) => definition.url.startsWith(url)) ||
          list.find((definition) => url.startsWith(definition.url))
        );
      })
    );
  }

  public createSecurityDefinition(
    request: SecurityDefinition
  ): Observable<SecurityDefinition> {
    return this.request.post('/api/services', request);
  }

  public updateSecurityDefinition(
    request: SecurityDefinition
  ): Observable<SecurityDefinition> {
    return this.request.put(`/api/services/${request.id}`, request);
  }

  public testService(request: ITestServiceRequest): Observable<any> {
    return this.request.post(`/api/test`, request);
  }
}
