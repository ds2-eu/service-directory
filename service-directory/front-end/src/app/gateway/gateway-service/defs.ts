export interface SecurityDefinition {
  id: string;
  name: string;
  url: string;
  authType: string;
  authInfo: AuthInfo;
  headers?: HeaderInfo[];
  serviceId?: string;
}

export class HeaderInfo {
  name: string;
  value: string;
}

export type AuthInfo = OAuth2Data | BasicAuthData;

export class OAuth2Data {
  clientId: string;
  clientSecret: string;
  authUrl: string;
  audience: string;
  omitBearerPrefix: boolean;
  customBearerHeader: string;
}

export class BasicAuthData {
  username: string;
  password: string;
}

export enum AuthType {
  OAuth2 = 'OAuth2',
  Basic = 'Basic',
}

export interface IGetSecurityDefinitionListRequest {
  url?: string;
  serviceId?: string;
}

export interface ITestServiceOptions {
  url: string;
  method: string;
  params?: any;
  body?: any;
  headers?: any;
}

export interface ITestServiceRequest {
  options: ITestServiceOptions;
  authInfo: AuthInfo;
}
