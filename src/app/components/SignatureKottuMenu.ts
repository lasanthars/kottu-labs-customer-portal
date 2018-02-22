import { Component, OnInit } from '@angular/core';
import { SignatureMenuInterface } from '../interface/SignatureMenuInterface';

import { HttpService } from '../services';

const k1 = require( '../../images/sea_food_kottu.jpg');

@Component({
  selector: 'kottu-lab-signature-kottu-menu',
  template: require('./SignatureKottuMenu.html')
})
export class SignatureKottuMenuComponent {
  menus: SignatureMenuInterface[];
  public kImg1: any;

  constructor(private menuService: HttpService) {
    this.kImg1 = k1;
  }

  getAllSignatureMenus(): void {
    this.menuService
      .getAllSignatureMenus()
      .then(menus => {
        this.menus = menus;
        this.menuService.hideUiBlocker();
      });
  }

  ngOnInit(): void {
    this.menuService.showUiBlocker();
    this.getAllSignatureMenus();
  }

  // convertToTotal(menu: any, index: number, quantity: any, type: string) {
  //   if (type === 'numeric') {
  //     if (quantity === undefined || quantity === '') {
  //       this.menus[index].setmenu = price * 1;
  //     } else {
  //       this.total = price * quantity;
  //     }
  //   } else {
  //     if (quantity === undefined || quantity === '') {
  //       this.total = price[0].price * 1;
  //     } else {
  //       this.total = price[0].price * quantity;
  //     }
  //   }
  // }

  convertTotalPortion(event:any, menu: any, index: number, model: number, type: string) {

  }

  convertToTotalQuantity(menu: any, index: number, model: number, type: string) {

  }

  // changePortion(event: any, obj: object, index: number, quantity: number) {
  //   this.total = 0;
  //   for (let key of Object.keys(obj)) {
  //     if (event.target.value === obj[key].name) {
  //
  //     }
  //   }
  // }
}
