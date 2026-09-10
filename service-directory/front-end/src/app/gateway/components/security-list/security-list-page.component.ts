import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

import { SecurityDefinition, GatewayService } from '../../gateway-service';

@Component({
  selector: 'app-security-list-page',
  templateUrl: './security-list-page.component.html',
  styleUrls: ['./security-list-page.component.scss'],
})
export class SecurityListPageComponent implements OnInit, OnDestroy {
  public definitions: SecurityDefinition[];
  loading = true;
  didBackendError = false;

  // Allows observables to be cancelled when the component dismounts.
  subscription = new Subscription();

  constructor(private service: GatewayService, public title: Title) {
    // Weirdly an error is thrown if the title is set without a timeout.
    // NG0100: Expression has changed after it was checked
    setTimeout(() => {
      this.title.setTitle(
        'Service Directory — Security definitions of services'
      );
    }, 0);
  }

  private loadDefinitions(): void {
    this.loading = true;
    this.subscription.add(
      this.service.getList().subscribe({
        next: (definitions) => {
          this.loading = false;
          this.didBackendError = false;
          this.definitions = definitions;
        },
        error: (_) => {
          this.loading = false;
          this.didBackendError = true;
        },
      })
    );
  }

  public ngOnInit(): void {
    this.definitions = [];
    this.loadDefinitions();
  }

  // Used in *ngFor
  public getDefinitionId(_: number, definition: SecurityDefinition): string {
    return definition.id;
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
