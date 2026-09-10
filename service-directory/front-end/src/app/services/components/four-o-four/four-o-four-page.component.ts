import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-four-o-four-page',
  templateUrl: './four-o-four-page.component.html',
  styleUrls: ['./four-o-four-page.component.scss'],
})
export class FourOFourPageComponent implements OnInit {
  constructor(public title: Title) {}

  ngOnInit(): void {
    this.title.setTitle('Service Directory — Page not found');
  }
}
