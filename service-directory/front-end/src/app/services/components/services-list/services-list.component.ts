import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { catchError, filter, of, Subscription } from 'rxjs';

import { Service } from '@app/services/services-service/service.interface';
import { ServicesService } from '../../services-service/services.service';

@Component({
  selector: 'app-services-list',
  templateUrl: './services-list.component.html',
  styleUrls: ['./services-list.component.scss'],
})
export class ServicesListComponent implements OnInit, OnDestroy {
  services = <Service[]>[];
  currentServiceId = '';
  loading = true;
  errorFromBackend: string;

  // Allows observables to be cancelled when the component dismounts.
  subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private servicesService: ServicesService,
    private title: Title
  ) {
    this.title.setTitle('Service Directory');
  }

  ngOnInit(): void {
    this.getServices();

    this.subscription.add(
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe(() => {
          this.setCurrentServiceId();

          if (!this.currentServiceId) {
            this.getServices();
          }
        })
    );
  }

    /* if (this.isLocalhost() == true){
      this.services = [
              {
                _id: "64a421dee9ef4d50590015bc",
                name: "Service API",
                description:
                  "Created by the WASP team to contain endpoints useful for email notifications, and some other endpoints from that were in the original marketplace design.",
                openApiYamlEndpoint:
                  "https://service-api.orchestration-test.icelab.cloud/api-json",
                openApiUiEndpoint:
                  "https://service-api.orchestration-test.icelab.cloud/api",
                openApiDefinition: "",
                hideFromOrchestration: false,
                __v: 0,
              },
              {
                _id: "64a42225e9ef4d50590015c3",
                name: "Generic API",
                description: "Used for a generic application",
                openApiYamlEndpoint:
                  "https://eportal-test-api.eportal.icelab.cloud/api-json",
                openApiUiEndpoint:
                  "https://eportal-test-api.eportal.icelab.cloud/api",
                openApiDefinition: "",
                hideFromOrchestration: false,
                __v: 0,
              }
            ];
      this.loading = false;
      this.setCurrentServiceId();

    } 

  } */

  getServices() {
    this.subscription.add(
      this.servicesService
        .getServices()
        .pipe(
          catchError((error) => {
            this.errorFromBackend = error.message;
            return of([]);
          })
        )
        .subscribe((data) => {
          this.services = data;
          this.loading = false;
          this.setCurrentServiceId();
        })
    );
  }

  // Used in *ngFor
  public getServiceId(_: number, service: Service): string {
    return service._id;
  }

  // Used for highlighting the selected service, if there is one.
  setCurrentServiceId() {
    this.currentServiceId =
      this.route.snapshot.firstChild?.params['id'] ?? null;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  isLocalhost(): boolean {
    return (
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1'
    );
  }

  sortAscending = true;

  toggleSort(): void {
    this.sortAscending = !this.sortAscending;

    this.services.sort((a, b) => {
      const nameA = (a.name || '').trim().toLowerCase();
      const nameB = (b.name || '').trim().toLowerCase();

      const comparison = nameA.localeCompare(nameB);

      return this.sortAscending ? comparison : -comparison;
    });
  }
}
