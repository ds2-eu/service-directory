import { Component } from '@angular/core';
import { IModuleConfig } from 'ds2-orchestration-portal-header';
//import { IModuleConfig } from 'ice-orchestration-portal-header';
import { ConfigService } from './core/config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public usePortal: boolean;
  public modules: IModuleConfig[];
  public loggedIn: boolean;
  public isLoading = true; // show loader initially

  constructor(private configService: ConfigService) {
    this.usePortal = this.configService.config.portalConfig?.usePortal;
    this.modules = this.configService.config.portalConfig?.modules;

    setTimeout(() => {
      this.isLoading = false;
    }, 300);
  }

  public onLoggedIn($event: boolean): void {
    setTimeout(() => {
      this.loggedIn = $event;
    }, 0);
  }
}
