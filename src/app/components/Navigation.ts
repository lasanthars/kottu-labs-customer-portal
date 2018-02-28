import {Component} from '@angular/core';
import {Router} from '@angular/router';
const logo = require( '../../images/logo.png');

@Component({
  selector: 'kottu-labs-navigation',
  template: require('./Navigation.html')
})
export class NavigationComponent {
  public brandName: any;
  private router: any;

  constructor(private _router: Router) {
    this.router = _router;
    this.brandName = logo;
  }

  scollToElement(element: any) {
    if(this.router.url === '/'){
      document.querySelector('#' + element).scrollIntoView({ behavior: 'smooth' });
    }
  }
}
