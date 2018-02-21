import {Component} from '@angular/core';

@Component({
  selector: 'kottu-labs-app',
  template: require('./App.html')
})
export class AppComponent {
  public pageSubTitle: string;

  constructor() {
    this.pageSubTitle = 'CALL 2421124 TO PLACE AN ORDER OR ORDER ONLINE';
  }
}
