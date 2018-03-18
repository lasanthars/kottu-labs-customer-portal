import {Component} from '@angular/core';
import {Router} from '@angular/router';
const logo = require( '../../images/logo.png');
import { CartInterface } from '../interface/CartInterface';

import { HttpService } from '../services';

@Component({
  selector: 'kottu-labs-navigation',
  template: require('./Navigation.html')
})
export class NavigationComponent {
  cartInfo: CartInterface[];
  public brandName: any;
  private router: any;

  constructor(private _router: Router, private navigationService: HttpService) {
    this.getCartDetails();
    this.router = _router;
    this.brandName = logo;
  }

  getCartDetails(): void {
      this.navigationService.getCart()
          .subscribe(list => {this.cartInfo = list; this.navigationService.hideUiBlocker();});
  }

  scollToElement(element: any) {
    if(this.router.url === '/'){
      document.querySelector('#' + element).scrollIntoView({ behavior: 'smooth' });
    }
  }
}
