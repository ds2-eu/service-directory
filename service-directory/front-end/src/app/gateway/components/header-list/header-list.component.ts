import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { RxwebValidators } from '@rxweb/reactive-form-validators';

import { HeaderInfo } from '@app/gateway/gateway-service';
import { debounceTime, distinctUntilChanged, takeWhile } from 'rxjs';

@Component({
  selector: 'app-header-list',
  templateUrl: './header-list.component.html',
  styleUrls: ['./header-list.component.scss'],
})
export class HeaderListComponent implements OnChanges, OnDestroy {
  @Input()
  public headers: HeaderInfo[];

  @Output()
  public changed: EventEmitter<{ headers: HeaderInfo[]; valid: boolean }>;

  public frm: FormGroup;

  private destroyed: boolean;
  private _headers: HeaderInfo[];

  constructor() {
    const rows = new FormArray([]);

    this.frm = new FormGroup(
      {
        rows,
      },
      { updateOn: 'blur' }
    );

    this.changed = new EventEmitter();

    this.frm.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeWhile(() => !this.destroyed)
      )
      .subscribe(() => {
        this._headers = this.frm.get('rows').value;

        this.changed.next({
          headers: this._headers,
          valid: this.frm.valid,
        });
      });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (this.headers !== this._headers) {
      this.rows.clear();

      for (let header of this.headers) {
        this.rows.push(
          new FormGroup(
            {
              name: new FormControl(header.name, [
                Validators.required,
                RxwebValidators.unique(),
              ]),
              value: new FormControl(header.value, Validators.required),
            },
            { updateOn: 'blur' }
          )
        );
      }

      this._headers = this.headers;
    }
  }

  public get rows(): FormArray {
    return this.frm.get('rows') as FormArray;
  }

  public addRow(): void {
    if (!this.frm.valid) {
      return;
    }

    const row = new FormGroup(
      {
        name: new FormControl('', [
          Validators.required,
          RxwebValidators.unique(),
        ]),
        value: new FormControl('', Validators.required),
      },
      { updateOn: 'blur' }
    );

    this.rows.push(row);
  }

  public getRow(i: number): FormGroup {
    return this.rows.controls[i] as FormGroup;
  }

  public deleteRow(i: number): void {
    this.rows.removeAt(i);
  }

  public ngOnDestroy(): void {
    this.destroyed = true;
  }
}
