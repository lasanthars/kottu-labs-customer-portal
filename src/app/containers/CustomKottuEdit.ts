import {Component} from '@angular/core';

@Component({
  selector: 'kottu-labs-app',
  template: require('./CustomKottuEdit.html'),
})
export class CustomKottuEditComponent {
  public pageMenuTitle: string;

  constructor() {
    this.pageMenuTitle = 'SELECT YOUR CHOICE OF CARB, DRESSING AND PROTEIN';
  }
}
