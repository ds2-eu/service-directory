import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class MsgboxService {

  constructor(private toastr: ToastrService) { }

  public showSuccess(message: string): void {
    this.toastr.success(message);
  }
}
