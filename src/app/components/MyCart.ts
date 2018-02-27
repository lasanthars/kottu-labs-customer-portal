import { Component, OnInit } from '@angular/core';
import { HttpService } from '../services';

import { CartInterface } from '../interface/CartInterface';

@Component({
  selector: 'kottu-lab-cart',
  template: require('./MyCart.html')
})
export class MyCartComponent {
    cartInfo: CartInterface[];
    constructor(private cartService: HttpService) {}

    ngOnInit(): void {
        this.getCartDetails();
    }

    getCartDetails(): void {
        this.cartService.getCart()
            .subscribe(list => {this.cartInfo = list;});

    }

    calculateSum() {
      let total = 0;
      for(let k = 0; k < this.cartInfo[0].cart.length; k++){
          total += this.cartInfo[0].cart[k].price;
      }
      return total;
    }
}
