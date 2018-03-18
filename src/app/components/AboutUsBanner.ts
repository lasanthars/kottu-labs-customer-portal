import {Component, HostListener} from '@angular/core';
const movie = require('../../images/about_us_page_video.mp4');

@Component({
  selector: 'kottu-lab-about-banner',
  template: require('./AboutUsBanner.html')
})
export class AboutUsBannerComponent {
  public movieClip: any;
  public isPaused: boolean;
  public isMuted: boolean;

  constructor() {
    this.movieClip = movie;
    this.isPaused = false;
    this.isMuted = false;
  }

  controlVideo(ele:any, action:string){
    switch (action){
        case 'play':
            ele.pause();
            this.isPaused = true;
          break
        case 'pause':
            ele.play();
            this.isPaused = false;
            break
        case 'audio':
            ele.muted = true;
            this.isMuted = true;
            break
        case 'mute':
            ele.muted = false;
            this.isMuted = false;
            break
        default:
          break
    }
  }

    @HostListener('window:resize') onResize() {
        let videoHeight = document.getElementById('aboutVideo').offsetHeight;
        document.getElementById('aboutVideoWrapper').style.top = '-' + videoHeight/4.5 + 'px';
        if(videoHeight <= 570){
            document.getElementById('aboutVideoBannerWrapper').style.height = videoHeight + 'px';
        }
    }
}
