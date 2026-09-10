export interface Service {
  name: string;
  description?: string;
  openApiYamlEndpoint: string;
  openApiUiEndpoint?: string;
  openApiDefinition: string;
  hideFromOrchestration: boolean;
  __v: number;
  _id: string;
}
