import { Component, OnInit } from '@angular/core';
import { CustomMenuInterface } from '../interface/CustomMenuInterface';

import { HttpService } from '../services';

const k1 = require( '../../images/sea_food_kottu.jpg');

@Component({
  selector: 'kottu-lab-custom-kottu-menu',
  template: require('./CustomKottuMenu.html')
})
export class CustomKottuMenuComponent {
  menus: CustomMenuInterface[];
  public kImg1: any;
  public selectedCarb: string;
  public selectedCarbPrice: any;
  public selectedPortion: string;
  public selectedPortionPrice: any;
  public customKottuMenu: number;
  public itemCompleted: boolean;
  private totalPrice: any;

  constructor(private menuService: HttpService) {
    this.kImg1 = k1;
  }

  getAllCustomMenus(): void {
    this.menuService
      .getAllCustomMenus()
      .then(menus => {
        this.menus = menus;
        this.menus[0].totalPrice = 0;
        this.menuService.hideUiBlocker();
      });
  }

  addCustomMenu(): void {
    this.menuService
      .getAllCustomMenus()
      .then(menus => {
        const resp = menus;
        resp[0].totalPrice = 0;
        this.menus.push(...resp);
        this.menuService.hideUiBlocker();
      });
  }

  removeCustomMenu(index: number) {
    this.menus.splice(index);
    this.menuService.hideUiBlocker();
  }

  ngOnInit(): void {
    this.menuService.showUiBlocker();
    this.getAllCustomMenus();
    this.selectedCarb = '-1';
    this.selectedPortion = '-1';
    this.totalPrice = 0;
    this.selectedPortionPrice = 0;
    this.selectedCarbPrice = 0;
    this.customKottuMenu = 1;
    this.itemCompleted = false;
  }

  changePortion(event: any, obj: object, type: string, index: number) {
    for (let key of Object.keys(obj)) {
      if (event.target.value === obj[key].name) {
        if (type === 'portion') {
          this.menus[index].totalPrice = (this.menus[index].totalPrice - this.selectedPortionPrice) + obj[key].price;
          this.selectedPortionPrice = obj[key].price;
        } else {
          this.menus[index].totalPrice = (this.menus[index].totalPrice - this.selectedCarbPrice) + obj[key].price;
          this.selectedCarbPrice = obj[key].price;
        }
      }
    }
  }

  calculateAddons(event: any, price: number, index: number) {
    if (event.target.checked) {
      this.menus[index].totalPrice += price;
    } else {
      this.menus[index].totalPrice += price;
    }
  }

  createNewCustomMenu(model: number) {
    this.menuService.showUiBlocker();
    if (model > this.menus.length) {
      for (let k = 0; k < model - this.menus.length; k++) {
        this.addCustomMenu();
      }
    } else {
      this.removeCustomMenu(model);
    }
  }
}
