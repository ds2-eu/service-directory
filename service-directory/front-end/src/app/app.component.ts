import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public isLoading = true;

  constructor() {
    setTimeout(() => {
      this.isLoading = false;
    }, 300);
  }
}