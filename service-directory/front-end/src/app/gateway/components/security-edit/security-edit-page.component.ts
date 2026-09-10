import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, Observable, of, take, takeWhile, throwError } from 'rxjs';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Title } from '@angular/platform-browser';

import {
  SecurityDefinition,
  GatewayService,
  AuthType,
  HeaderInfo,
} from '../../gateway-service';
import { ServicesService } from '@app/services/services-service/services.service';
import { SecurityTestingModalComponent } from '../security-testing-modal/security-testing-modal.component';

@Component({
  selector: 'app-security-edit-page',
  templateUrl: './security-edit-page.component.html',
  styleUrls: ['./security-edit-page.component.scss'],
})
export class SecurityEditPageComponent implements OnInit, OnDestroy {
  public headers: HeaderInfo[];
  public formMain: FormGroup;
  public formBasic: FormGroup;
  public formOAuth: FormGroup;

  public serviceId?: string;

  public isLoading = true;
  public errorFromBackendOnLoad = '';
  public isSubmitting = false;
  public errorFromBackendOnSave = '';

  private destroyed: boolean;
  private headersValid: boolean;

  constructor(
    private definitionsService: GatewayService,
    private servicesService: ServicesService,
    private router: Router,
    private route: ActivatedRoute,
    public title: Title,
    private modal: BsModalService
  ) {
    // If `required` were an attribute on the HTML <input> elements in the child forms,
    // the NG0100 error would be thrown because at least one of the child forms is hidden.
    // So we use Angular validators here instead.
    this.formMain = new FormGroup({
      id: new FormControl(''),
      name: new FormControl('', [Validators.required]),
      url: new FormControl('', [Validators.required]),
      authType: new FormControl('', [Validators.required]),
      authInfo: new FormGroup({}),
    });

    this.formBasic = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });

    this.formOAuth = new FormGroup({
      clientId: new FormControl('', [Validators.required]),
      clientSecret: new FormControl('', [Validators.required]),
      authUrl: new FormControl('', [Validators.required]),
      clientField: new FormControl(''),
      secretField: new FormControl(''),
      audience: new FormControl(''),
      grantType: new FormControl(''),
      omitBearerPrefix: new FormControl(''),
      customBearerHeader: new FormControl(''),
    });

    this.headers = [];
    this.headersValid = true;
  }

  public ngOnInit(): void {
    this.loadSecurityDefinition();
  }

  // Public so it can be mocked in unit tests.
  public loadSecurityDefinition() {
    // take(1) avoids duplicate requests — the data only load once.
    this.route.paramMap.pipe(take(1)).subscribe((prms) => {
      // The definition to be loaded depends on the format of the URL.
      // If the URL contains a definition’s ID:
      if (prms.has('definitionId')) {
        this.loadById(prms.get('definitionId'));
      }

      // If the definition should correspond to a service:
      else if (prms.has('serviceId')) {
        this.loadByServiceId(prms.get('serviceId'));
      }

      // If the definition should match a URL:
      else if (prms.has('url')) {
        const url = decodeURIComponent(prms.get('url'));
        this.loadByUrl(url);
      }

      // If no ID/URL is in the URL, we’ll be creating a new definition.
      else {
        this.isLoading = false;
        this.title.setTitle('Service Directory — Add security definition');
      }
    });
  }

  public shouldShowErrorFor(fieldName: string, errorName?: string): boolean {
    const fieldInMainForm = this.formMain.get(fieldName);
    const fieldInChildForm =
      this.formMain.get('authType').value &&
      this.formMain.get('authInfo.' + fieldName);
    const field = fieldInMainForm || fieldInChildForm;

    if (!errorName) {
      return !field.valid;
    }

    return field && field.touched && field.errors?.[errorName];
  }

  public authTypeChanged(): void {
    const authType = this.formMain.get('authType').value;
    if (authType === AuthType.Basic) {
      this.formMain.setControl('authInfo', this.formBasic);
    } else if (authType === AuthType.OAuth2) {
      this.formMain.setControl('authInfo', this.formOAuth);
    }
  }

  private loadDefinition(definition: SecurityDefinition): void {
    this.formMain.patchValue(definition);
    this.authTypeChanged();
    this.formMain.patchValue(definition);

    this.headers = definition.headers;

    this.isLoading = false;
    this.errorFromBackendOnLoad = '';
    this.title.setTitle(`Service Directory — Edit security definition`);
  }

  private handleError(error: any): Observable<never> {
    this.isLoading = false;

    if (typeof error === 'string') {
      this.errorFromBackendOnLoad = error;
      // No need to trigger Toastr if error can simply be displayed as text.
      return of();
    }

    this.errorFromBackendOnLoad =
      error.error?.message ||
      error.error ||
      'Something went wrong while loading your security definition.';

    // Potentially trigger Toastr if this error is not caught.
    return throwError(() => error);
  }

  public loadById(id: string): void {
    this.definitionsService
      .getSecurityDefinitionById(id)
      .pipe(
        takeWhile(() => !this.destroyed),
        catchError((error) => this.handleError(error))
      )
      .subscribe((definition) => {
        if (definition) {
          this.loadDefinition(definition);
        } else {
          this.handleError('The security definition does not exist.');
        }
      });
  }

  private loadByServiceId(serviceId: string): void {
    this.serviceId = serviceId;

    this.servicesService
      .getService(this.serviceId)
      .pipe(
        takeWhile(() => !this.destroyed),
        catchError(() => {
          return this.handleError(
            `No security definition could be loaded, because the requested service does not exist.`
          );
        })
      )
      .subscribe((service) => {
        // Look for a definition with a similar URL to the service.
        this.definitionsService
          .getList({ serviceId: service._id })
          .pipe(
            takeWhile(() => !this.destroyed),
            catchError((error) => this.handleError(error))
          )
          .subscribe((definitions) => {
            if (definitions.length) {
              this.loadDefinition(definitions[0]);
            } else {
              // Use the name & URL from the service for the definition.
              this.formMain.patchValue({
                name: service.name,
                // If the Yaml endpoint ends in 'api-json'
                // or 'api.yaml' (etc), we don’t want this.
                url: this.deleteEndOfUrl(service.openApiYamlEndpoint),
              });

              this.isLoading = false;
              this.title.setTitle(
                `Service Directory — Add security definition`
              );
            }
          });
      });
  }

  private loadByUrl(url: string): void {
    this.definitionsService
      .getSecurityDefinitionWithSimilarUrl(url)
      .pipe(
        takeWhile(() => !this.destroyed),
        catchError((error) => this.handleError(error))
      )
      .subscribe((definition) => {
        if (definition) {
          this.loadDefinition(definition);
        } else {
          // Use the URL embedded in the page’s URL.
          this.formMain.patchValue({
            name: url,
            url,
          });

          this.isLoading = false;
          this.title.setTitle(`Service Directory — Add security definition`);
        }
      });
  }

  // Eg, "https://software.zdmp.eu/openapi/edge-tier/digital-twin/openapi.yaml" => "https://software.zdmp.eu/openapi/edge-tier/digital-twin/"
  private deleteEndOfUrl(url: string): string {
    if (url.replace('://', '').includes('/')) {
      return url.substring(0, url.lastIndexOf('/') + 1);
    }
    return url;
  }

  public testService(): void {
    const value = this.formMain.value as SecurityDefinition;

    this.modal.show(SecurityTestingModalComponent, {
      initialState: {
        request: {
          options: {
            url: value.url,
            method: 'GET',
          },
          authInfo: value.authInfo,
        },
      },
    });
  }

  public headersChanged($event): void {
    this.headersValid = $event.valid;
    this.headers = $event.headers;
  }

  public goBack(): void {
    this.router.navigate(['/']);
  }

  public submit(): void {
    this.formMain.markAllAsTouched();
    if (!this.formMain.valid || !this.headersValid) {
      return;
    }

    // Prevent double-clicks (etc) from submitting extra definitions.
    if (this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.errorFromBackendOnSave = '';

    const value = this.formMain.value as SecurityDefinition;

    if (this.serviceId) {
      value.serviceId = this.serviceId;
    }

    value.headers = this.headers;

    const op = value.id
      ? this.definitionsService.updateSecurityDefinition(value)
      : this.definitionsService.createSecurityDefinition(value);

    op.subscribe({
      next: () => {
        this.isSubmitting = false;
        this.errorFromBackendOnSave = '';
        this.goBack();
      },
      error: (response) => {
        this.isSubmitting = false;
        this.errorFromBackendOnSave =
          response.error?.message ||
          'Something went wrong in saving your security definition. Please check the information is correct, or try again later.';
      },
    });
  }

  public ngOnDestroy(): void {
    this.destroyed = true;
  }
}

