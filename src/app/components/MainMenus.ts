import {Component, Input} from '@angular/core';
const kottuImage1 = require('../../images/sea_food_kottu.jpg');

@Component({
  selector: 'kottu-lab-main-menus',
  template: require('./MainMenus.html')
})
export class MainMenusComponent {
  public sigKottu: any;

  constructor() {
    this.sigKottu = kottuImage1;
  }
}
