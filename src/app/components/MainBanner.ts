import {Component, HostListener} from '@angular/core';
const iconOne = require( '../../images/signature-kottu.png');
const iconTwo = require('../../images/own-kottu.png');
const movie = require('../../images/home_page_video.mp4');
const bannerImage = require('../../images/home_banner.jpg');

@Component({
  selector: 'kottu-lab-main-banner',
  template: require('./MainBanner.html')
})
export class MainBannerComponent {
  public sigKottu: any;
  public ownKottu: any;
  public movieClip: any;
  public mainBanner: any;

  constructor() {
    this.sigKottu = iconOne;
    this.ownKottu = iconTwo;
    this.movieClip = movie;
    this.mainBanner = bannerImage;
  }
    ngAfterViewInit(){
        this.resizeVideo();
    }

    @HostListener('window:resize') onResize() {
      this.resizeVideo();
    }

    removePreloader(preloader: any){
      document.getElementById(preloader).style.display = 'none';
    }

    resizeVideo(){
        let videoHeight = document.getElementById('introVideo').offsetHeight;
        if(videoHeight <= 570){
            document.getElementById('mainVideoBannerWrapper').style.height = videoHeight + 'px';
        }
    }


}
