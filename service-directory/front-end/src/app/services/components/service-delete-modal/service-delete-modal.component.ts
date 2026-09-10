import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';

import { Service } from '../../services-service/service.interface';
import { ServicesService } from '../../services-service/services.service';

@Component({
  selector: 'app-service-delete-modal',
  templateUrl: './service-delete-modal.component.html',
  styleUrls: ['./service-delete-modal.component.scss'],
})
export class ServiceDeleteModalComponent {
  service?: Service;
  errorFromBackendOnDelete?: string;

  subscription = new Subscription();

  deleteForm = this.formBuilder.group({});

  constructor(
    private formBuilder: FormBuilder,
    public modalRef: BsModalRef,
    private router: Router,
    private servicesService: ServicesService
  ) {}

  public onSubmit(): void {
    if (this.service) {
      this.subscription.add(
        this.servicesService.deleteService(this.service).subscribe({
          next: (_) => {
            this.router.navigateByUrl('/');
            this.closeModal();
          },
          error: (error) => {
            this.errorFromBackendOnDelete = error.message;
          },
        })
      );
    }
  }

  public closeModal(): void {
    this.modalRef.hide();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
