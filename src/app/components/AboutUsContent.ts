import {Component} from '@angular/core';
const movie = require('../../images/about_us_page_video.mp4');

@Component({
  selector: 'kottu-lab-about-content',
  template: require('./AboutUsContent.html')
})
export class AboutUsContentComponent {
  public movieClip: any;

  constructor() {
    this.movieClip = movie;
  }
}
