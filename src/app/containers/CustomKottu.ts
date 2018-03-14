import {Component} from '@angular/core';

@Component({
  selector: 'kottu-labs-app',
  template: require('./CustomKottu.html'),
})
export class CustomKottuComponent {
  public pageMenuTitle: string;

  constructor() {
    this.pageMenuTitle = 'SELECT YOUR CHOICE OF CARB, DRESSING AND PROTEIN';
  }
}
