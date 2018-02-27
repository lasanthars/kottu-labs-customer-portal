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

  convertTotalPortion(event: any, menu: any, index: number, model: number) {
      this.assignNewPrice(event.target.value, menu, index, model, 'portion');
  }

  convertToTotalQuantity(portionId: string, menu: any, index: number, model: number) {
      const element = (document.getElementById(portionId)) as HTMLSelectElement;
      const selectedPortion = element.options[element.selectedIndex].text;
      this.assignNewPrice(selectedPortion, menu, index, model, 'quantity');
  }

  private assignNewPrice (selected: string, menu: any, index: number, model: number, type: string) {
      if (type === 'portion' && selected === '-1') {
          if (model === undefined) {
              this.menus[index].setmenu.newPrice = this.menus[index].setmenu.price;
          } else {
              this.menus[index].setmenu.newPrice = this.menus[index].setmenu.price * model;
          }
      } else {
          for (let key of Object.keys(menu)) {
              if ((type === 'portion' && menu[key].name === selected)) {
                  if (model === undefined) {
                      this.menus[index].setmenu.newPrice = menu[key].price;
                  } else {
                      this.menus[index].setmenu.newPrice = menu[key].price * model;
                  }
              } else if (type === 'quantity' && menu[key].name === selected) {
                  this.menus[index].setmenu.newPrice = menu[key].price * model;
              } else if (type === 'quantity' && selected === 'Select') {
                  this.menus[index].setmenu.newPrice = this.menus[index].setmenu.price * model;
              }
          }
      }
  }
}
