import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';

import { ConfigService } from '@app/core/config';

export declare interface IErrorResponse {
  status: number;
  error: string;
}

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  constructor(private configService: ConfigService, private http: HttpClient) {}

  private joinUrl(url1: string, url2: string): string {
    if (url1.endsWith('/') || url2.startsWith('/')) {
      return url1 + url2;
    }
    return url1 + '/' + url2;
  }

  private getApiUrl(url): string {
    return this.joinUrl(this.configService.config.gatewayEndpoint, url);
  }

  private handleError<T>(response): Observable<IErrorResponse> {
    if (response instanceof HttpErrorResponse) {
      return throwError(() =>
        response.status === 0
          ? {
              status: 0,
              error:
                'Something went wrong when loading/saving your definition(s).',
            }
          : {
              status: response.status,
              error: response.error.message || response.statusText,
            }
      );
    }
    return throwError(() => ({ status: 0, error: 'Unknown error' }));
  }

  private request<T>(
    url: string,
    method: string,
    body?: any,
    options?: any
  ): Observable<any> {
    return this.http
      .request<T>(method, this.getApiUrl(url), { ...options, body })
      .pipe(catchError(this.handleError));
  }

  public get<T>(url: string, params?: any): Observable<T> {
    return this.request(url, 'GET', null, { params });
  }

  public post<T>(url: string, body: T, options?: any): Observable<any> {
    return this.request(url, 'POST', body, options);
  }

  public put<T>(url: string, body: T): Observable<any> {
    return this.request(url, 'PUT', body);
  }

  public delete<T>(url: string, body?: T): Observable<any> {
    return this.request(url, 'DELETE', body);
  }
}
