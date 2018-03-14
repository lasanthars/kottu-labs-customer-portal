import {Component} from '@angular/core';
const movie = require('../../images/about_us_page_video.mp4');

@Component({
  selector: 'kottu-lab-about-banner',
  template: require('./AboutUsBanner.html')
})
export class AboutUsBannerComponent {
  public movieClip: any;

  constructor() {
    this.movieClip = movie;
  }
}
