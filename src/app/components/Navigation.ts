import {Component} from '@angular/core';
const logo = require( '../../images/logo.png');

@Component({
  selector: 'kottu-labs-navigation',
  template: require('./Navigation.html')
})
export class NavigationComponent {
  public brandName: any;

  constructor() {
    this.brandName = logo;
  }

  scollToElement(element: any) {
    console.log(element);
    // $('html, body').animate({
    //   scrollTop: $(element).offset().top
    // }, 600);
  }
}
