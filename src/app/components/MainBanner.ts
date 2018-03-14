import {Component} from '@angular/core';
const iconOne = require( '../../images/signature-kottu.png');
const iconTwo = require('../../images/own-kottu.png');
const movie = require('../../images/home_page_video.mp4');

@Component({
  selector: 'kottu-lab-main-banner',
  template: require('./MainBanner.html')
})
export class MainBannerComponent {
  public sigKottu: any;
  public ownKottu: any;
  public movieClip: any;

  constructor() {
    this.sigKottu = iconOne;
    this.ownKottu = iconTwo;
    this.movieClip = movie;
  }
}
