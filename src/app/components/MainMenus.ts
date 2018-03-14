import {Component, Input} from '@angular/core';
const ownkottuImage1 = require('../../images/Create-your-own-kottu.jpg');
const sigkottuImage1 = require('../../images/Our-Signature-Kottu.jpg');

@Component({
  selector: 'kottu-lab-main-menus',
  template: require('./MainMenus.html')
})
export class MainMenusComponent {
  public sigKottu: any;
  public ownKottu: any;

  constructor() {
    this.sigKottu = sigkottuImage1;
    this.ownKottu = ownkottuImage1;
  }
}
