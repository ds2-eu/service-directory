import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-spin-button',
  templateUrl: './spin-button.component.html',
  styleUrls: ['./spin-button.component.scss']
})
export class SpinButtonComponent {
  
  @Input()
  public working: boolean;

  @Input()
  public text: string;

  @Input()
  public type: string;

  @Output()
  public click: EventEmitter<any>;

  constructor() {
    this.type = 'button';
    this.click = new EventEmitter();
  }


  public raiseClick($event: any): void {
    this.click.next($event);
    $event.stopPropagation();
  }
}
