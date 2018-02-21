import {Component} from '@angular/core';
const iconOne = require( '../../images/signature-kottu.png');
const iconTwo = require('../../images/own-kottu.png');

@Component({
  selector: 'kottu-lab-main-banner',
  template: require('./MainBanner.html')
})
export class MainBannerComponent {
  public sigKottu: any;
  public ownKottu: any;

  constructor() {
    this.sigKottu = iconOne;
    this.ownKottu = iconTwo;
  }
}
