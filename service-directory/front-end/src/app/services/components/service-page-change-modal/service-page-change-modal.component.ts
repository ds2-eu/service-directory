import { Component, EventEmitter, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';

import { Service } from '../../services-service/service.interface';

@Component({
  selector: 'app-service-page-change-modal',
  templateUrl: './service-page-change-modal.component.html',
  styleUrls: ['./service-page-change-modal.component.scss'],
})
export class ServicePageChangeModalComponent {
  service?: Service;

  subscription = new Subscription();
  @Output() authenticationRedirect = new EventEmitter();

  constructor(private modalRef: BsModalRef) {}

  public saveAndGoToAuthentication(): void {
    // The parent component observing the event emitted is what saves
    // the information it has and redirects to the authentication page.
    this.authenticationRedirect.emit();
    this.closeModal();
  }

  public closeModal(): void {
    this.modalRef.hide();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
