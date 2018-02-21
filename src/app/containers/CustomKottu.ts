import {Component} from '@angular/core';

@Component({
  selector: 'kottu-labs-app',
  template: require('./CustomKottu.html'),
})
export class CustomKottuComponent {
  public pageSubTitle: string;

  constructor() {
    this.pageSubTitle = 'CREATE YOUR OWN KOTTU ';
  }
}
