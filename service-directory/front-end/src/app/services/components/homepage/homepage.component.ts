import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent {
  constructor(
    public title: Title,
    private router: Router) {
    this.title.setTitle('Service Directory');
  }

  isServicesRoute() {
    return this.router.url.includes("/services");
  }

  isDefinitionsRoute() {
    return this.router.url.includes("/definitions");
  }

  isLocalhost(): boolean {
    return (
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1'
    );
  }
  
}
