import { Component, OnDestroy, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { catchError } from 'rxjs/operators';
import { of, Subscription } from 'rxjs';

import { GatewayService, ITestServiceRequest } from '../../gateway-service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-security-testing-modal',
  templateUrl: './security-testing-modal.component.html',
  styleUrls: ['./security-testing-modal.component.scss'],
})
export class SecurityTestingModalComponent implements OnInit, OnDestroy {
  public request: ITestServiceRequest;
  public isBusy: boolean;
  public response: string;

  // Allows observables to be cancelled when the component dismounts.
  subscription = new Subscription();

  public frmTest: FormGroup;

  constructor(private modalRef: BsModalRef, private service: GatewayService) {
    this.response = '';
    this.frmTest = new FormGroup({
      url: new FormControl('', [Validators.required]),
      method: new FormControl('', [Validators.required]),
    });
  }

  public ngOnInit(): void {
    this.frmTest.patchValue({
      url: this.request.options.url,
      method: this.request.options.method,
    });
  }

  public dismiss(): void {
    this.modalRef.hide();
  }

  public testService(): void {
    this.frmTest.markAllAsTouched();
    if (!this.frmTest.valid) {
      return;
    }

    this.request.options = {
      ...this.frmTest.value,
    };

    this.isBusy = true;
    this.subscription.add(
      this.service
        .testService(this.request)
        .pipe(
          catchError((err) => {
            this.isBusy = false;
            return of(err);
          })
        )
        .subscribe((data) => {
          this.response = JSON.stringify(data);
          this.isBusy = false;
        })
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
