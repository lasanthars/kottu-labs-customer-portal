import { Component, OnInit } from '@angular/core';
import { HttpService } from '../services';

import { CartInterface } from '../interface/CartInterface';

@Component({
  selector: 'kottu-lab-cart',
  template: require('./MyCart.html')
})
export class MyCartComponent implements OnInit {
    cartInfo: CartInterface[];
    public itemToDelete: any;
    public newGrossTotal: number;
    constructor(private cartService: HttpService) {
        this.itemToDelete = '';
    }

    ngOnInit(): void {
        this.getCartDetails();
        this.newGrossTotal = 0;
    }

    getCartDetails(): void {
        this.cartService.getCart()
            .subscribe(list => {
                this.cartInfo = list;
            });
    }

    calculateSum() {
      let total = 0;
      for(let k = 0; k < this.cartInfo[0].cart.length; k++){
          total += this.cartInfo[0].cart[k].total;
      }
      this.newGrossTotal = total;
      return total;
    }

    assignToConfirm(item: any) {
        this.itemToDelete = item;
    }
}
