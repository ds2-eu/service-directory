import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { catchError, of, takeWhile } from 'rxjs';

import { Service } from '../../services-service/service.interface';
import { ServicesService } from '../../services-service/services.service';
import { ServicePageChangeModalComponent } from '../service-page-change-modal/service-page-change-modal.component';

const URL_PATTERN = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(:[0-9]+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;

@Component({
  selector: 'app-service-edit-page',
  templateUrl: './service-edit-page.component.html',
  styleUrls: ['./service-edit-page.component.scss'],
})
export class ServiceEditPageComponent implements OnInit, OnDestroy {
  
  public service?: Service;
  public loading: boolean;
  public errorFromBackendOnLoad?: string;
  public errorFromBackendOnSave?: string;

  public editForm: FormGroup;
  public frmOpenApiRemote: FormGroup;
  public frmOpenApiText: FormGroup;
  public working: boolean;

  private destroyed: boolean;

  constructor(
    private modal: BsModalService,
    private route: ActivatedRoute,
    private router: Router,
    private servicesService: ServicesService,
    public title: Title
  ) {
    // Temporary title while page loads.
    this.title.setTitle('Service Directory');

    this.loading = true;

    this.editForm = new FormGroup(
      {
        name: new FormControl('', Validators.required),
        description: new FormControl(''),
        hasOpenApiEndpoint: new FormControl(true),
        openApiYamlEndpoint: new FormControl('', [
          Validators.pattern(URL_PATTERN),
        ]),
        openApiUiEndpoint: new FormControl('', [
          Validators.pattern(URL_PATTERN),
        ]),
        openApiDefinition: new FormControl(''),
        hideFromOrchestration: new FormControl(''),
        _id: new FormControl(''),
        __v: new FormControl(0),
      },
      { validators: this.validateForm }
    );
  }

  private validateForm(frm: FormGroup): any {
    const hasOpenApiEndpoint = frm.get('hasOpenApiEndpoint').value;

    let required = null;
    let optional = null;

    if (hasOpenApiEndpoint) {
      required = 'openApiYamlEndpoint';
      optional = 'openApiDefinition';
    } else {
      required = 'openApiDefinition';
      optional = 'openApiYamlEndpoint';
    }

    if (frm.get(optional).hasError('required')) {
      frm.get(optional).setErrors(null);
    }

    if (!frm.get(required).value) {
      frm.get(required).setErrors({ required: true });
      return { required: true };
    }

    return null;
  }

  public ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.servicesService
        .getService(id)
        .pipe(
          takeWhile(() => !this.destroyed),
          catchError((response) => {
            this.loading = false;
            if (response.status !== 404) {
              this.errorFromBackendOnLoad =
                response.error?.message ||
                'Something went wrong in loading your service. Please try again later.';
            }

            return of(null);
          })
        )
        .subscribe((data) => {
          if (data) {
            this.service = data;
            this.loading = false;

            this.editForm.patchValue({
              ...this.service,
              hasOpenApiEndpoint: this.service.openApiYamlEndpoint
                ? true
                : false,
            });

            this.title.setTitle(`Service Directory — Edit service`);
            this.errorFromBackendOnLoad = null;
          }
        });
    } else {
      this.loading = false;
      this.title.setTitle(`Service Directory — Create service`);
    }
  }

  public shouldShowErrorFor(fieldName: string, errorName?: string): boolean {
    return (
      this.editForm.get(fieldName).touched &&
      (errorName
        ? this.editForm.get(fieldName).errors?.[errorName]
        : !this.editForm.get(fieldName).valid)
    );
  }

  public submitThenRedirect(redirectPath?: string) {
    this.errorFromBackendOnSave = null;

    if (!this.editForm.valid) {
      // Validation error-messages only appear if a control has been touched.
      this.editForm.markAllAsTouched();
      return;
    }

    const request = this.editForm.value;

    // use empty string so API will store these props as empty
    if (request.hasOpenApiEndpoint) {
      request.openApiDefinition = '';
    } else {
      request.openApiYamlEndpoint = '';
      request.openApiUiEndpoint = '';
    }

    this.working = true;

    const op = request._id
      ? this.servicesService.saveService(request)
      : this.servicesService.addService(request);

    op.pipe(
      takeWhile(() => !this.destroyed),
      catchError((response) => {
        this.working = false;
        this.errorFromBackendOnSave =
          response.error?.error ||
          'Something went wrong in saving your service. Please check the information is correct, or try again later.';

        return of(null);
      })
    ).subscribe((savedService: Service) => {

      this.working = false;

      if (savedService) {
        // _id is generated by the back-end if we’re adding a new service,
        // so it’s safe to navigate to it once we’ve created the service.
        this.router.navigateByUrl(
          redirectPath ?? `/services/details/${savedService._id}`
        );
      }
    });
  }

  // We intercept clicks on the “Authentication” link to show a modal if the form has unsaved changes.
  // When any changes have been saved, we navigate to the href of the link.
  public onAuthenticationLinkClick(event: Event): void {
    event.preventDefault();

    // This is expected to be `/gateway/service/${this.service._id}`
    const redirectPath = event.target['getAttribute']('href');

    if (this.editForm.dirty) {
      const modalRef = this.modal.show(ServicePageChangeModalComponent, {
        initialState: {
          service: this.service,
        },
      });

      modalRef.content.authenticationRedirect.subscribe(() => {
        this.submitThenRedirect(redirectPath);
      });
    } else {
      this.router.navigateByUrl(redirectPath);
    }
  }

  public ngOnDestroy(): void {
    this.destroyed = true;
  }
}
