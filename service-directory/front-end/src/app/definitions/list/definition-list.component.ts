import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { catchError, finalize, Observable, of, takeWhile, tap } from 'rxjs';

import { DefinitionsService, IDefinition } from '@app/core/definitions';

@Component({
  selector: 'app-definition-list',
  templateUrl: './definition-list.component.html',
  styleUrls: ['./definition-list.component.scss']
})
export class DefinitionListComponent implements OnInit, OnDestroy {

  public records$: Observable<IDefinition[]>;
  public currentRecordId = '';
  public loading = true;
  public errorFromBackend: string;

  // Allows observables to be cancelled when the component dismounts.
  private destroyed: boolean;

  constructor(
    private route: ActivatedRoute,
    private service: DefinitionsService,
    private title: Title
  ) {
    this.title.setTitle(`Service Directory — Common definitions`);
  }

  public ngOnInit(): void {

    this.records$ = this.service
      .getDefinitions()
      .pipe(
        tap(() => (this.loading = true)),
        takeWhile(() => !this.destroyed),
        catchError((error) => {
          console.log({ error });
          setTimeout(() => {
            this.errorFromBackend = error.message;
          }, 0);
          return of([]);
        }),
        finalize(() => (this.loading = false))
      );
  }

  // Used in *ngFor
  public getRecordId(index: number, record: IDefinition): string {
    return record.id;
  }

  public ngOnDestroy(): void {
    this.destroyed = true;
  }

}
