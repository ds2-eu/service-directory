import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { catchError, distinctUntilChanged, of, Subscription } from 'rxjs';

import { AuthType, GatewayService } from '@app/gateway/gateway-service';
import { Service } from '../../services-service/service.interface';
import { ServicesService } from '../../services-service/services.service';
import { ServiceDeleteModalComponent } from '../service-delete-modal/service-delete-modal.component';

@Component({
  selector: 'app-service-details',
  templateUrl: './service-details.component.html',
  styleUrls: ['./service-details.component.scss'],
})
export class ServiceDetailsComponent implements OnInit, OnDestroy {
  service?: Service;
  authType: AuthType | 'loading' | 'not found' = 'loading';
  loading = true;
  errorFromBackend: string;

  // Allows observables to be cancelled when the component dismounts.
  subscription = new Subscription();

  constructor(
    private modal: BsModalService,
    private route: ActivatedRoute,
    private servicesService: ServicesService,
    private definitionsService: GatewayService
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      // Load the service whenever the service ID in the URL changes.
      this.route.paramMap.pipe(distinctUntilChanged()).subscribe(() => {
        this.getService();
      })
    );
  }

  getService(): void {
    const id = String(this.route.snapshot.paramMap.get('id'));
    this.loading = true;
    this.authType = 'loading';
    this.subscription.add(
      this.servicesService
        .getService(id)
        .pipe(
          catchError((error) => {
            if (error.status !== 404) {
              this.errorFromBackend = error.message;
            }
            return of(null);
          })
        )
        .subscribe((data) => {
          this.service = data;
          this.loading = false;
          if (data) {
            this.subscription.add(
              this.definitionsService
                .getSecurityDefinitionWithSimilarUrl(data.openApiYamlEndpoint)
                .pipe(
                  catchError((_) => {
                    return of(null);
                  })
                )
                .subscribe((definition) => {
                  this.authType = definition
                    ? <AuthType>definition.authType
                    : 'not found';
                })
            );
          }
        })
    );
  }

  public openModal(): void {
    this.modal.show(ServiceDeleteModalComponent, {
      initialState: {
        service: this.service,
      },
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
