import { Component, OnInit } from '@angular/core';
import { OtherMenuInterface } from '../interface/OtherMenuInterface';

import { HttpService } from '../services';

const k1 = require( '../../images/sea_food_kottu.jpg');

@Component({
  selector: 'kottu-lab-beverages',
  template: require('./Beverages.html')
})
export class BeveragesComponent {
  otherMenus: OtherMenuInterface[];
  public kImg1: any;

  constructor(private starterService: HttpService) {
    this.kImg1 = k1;
  }

  getAllOtherMenus(): void {
    this.starterService
      .getAllOtherMenus()
      .then(menus => {
        this.otherMenus = menus;
        this.starterService.hideUiBlocker();
      });
  }

  ngOnInit(): void {
    this.starterService.showUiBlocker();
    this.getAllOtherMenus();
  }

  toggleQuantity(value: number, index: number, price: number) {
    const newPrice = price * value;
    this.otherMenus[index].newPrice = newPrice;
  }
}
