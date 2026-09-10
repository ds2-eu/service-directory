import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ConfigService } from '../config';
import { IDefinition } from './defs';

@Injectable({
  providedIn: 'root'
})
export class DefinitionsService {

  private url: string;

  constructor(
    private httpClient: HttpClient,
    private cfgService: ConfigService
  ) {
    this.url = this.cfgService.config.apiEndpoint + '/definitions';
  }

  public getDefinitions(): Observable<IDefinition[]> {
    return this.httpClient.get<IDefinition[]>(this.url);
  }

  public getDefinitionById(id: string): Observable<IDefinition> {
    return this.httpClient.get<IDefinition>(`${this.url}/${id}`);
  }

  public createDefinition(definition: IDefinition): Observable<IDefinition> {
    delete definition.id;
    return this.httpClient.post<IDefinition>(this.url, definition);
  }

  public updateDefinition(definition: IDefinition): Observable<IDefinition> {
    return this.httpClient.patch<IDefinition>(this.url, definition);
  }

  public deleteDefinition(id: string): Observable<IDefinition> {
    return this.httpClient.delete<IDefinition>(this.url, {
      body: {
        id
      },
    });
  }

}
