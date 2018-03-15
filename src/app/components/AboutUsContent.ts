import {Component} from '@angular/core';
const movie = require('../../images/about_us_page_video.mp4');
const img1 = require('../../images/about-1.png');
const img2 = require('../../images/about-2.png');
const img3 = require('../../images/about-3.png');

@Component({
  selector: 'kottu-lab-about-content',
  template: require('./AboutUsContent.html')
})
export class AboutUsContentComponent {
  public movieClip: any;
  public imgOne: any;
  public imgTwo: any;
  public imgThree: any;

  constructor() {
    this.movieClip = movie;
    this.imgOne = img1;
    this.imgTwo = img2;
    this.imgThree = img3;
  }
}
