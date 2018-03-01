import { Component, OnInit } from '@angular/core';
import { CustomMenuInterface } from '../interface/CustomMenuInterface';

import { HttpService } from '../services';

const k1 = require( '../../images/sea_food_kottu.jpg');

import {OrderInterface} from "../interface/OrderInterface";
import { CartInterface } from '../interface/CartInterface';

@Component({
  selector: 'kottu-lab-custom-kottu-menu',
  template: require('./CustomKottuMenu.html')
})
export class CustomKottuMenuComponent {
  menus: CustomMenuInterface[];
  finalOrder: OrderInterface[];
  cartInfo: CartInterface[];
  public kImg1: any;
  public customKottuMenu: number;
  public itemCompleted: boolean;
  public modalId: string;
  public modalInfo: any[];
  private totalPrice: any;
  private finalOrderMenu: any;
  private finalCartMenu: any;

  constructor(private menuService: HttpService) {
    this.kImg1 = k1;
    this.modalId = 'customKottuModalDialog';
    this.modalInfo =['/Menu', '/CustomKottu', 'Add another Kottu'];
    this.finalOrderMenu = [{
        ingredients: [],
        orderDetail: {
            id: '',
            isCustom: true,
            itemId: '',
            orderId: '',
            price: 0,
            qty: 0,
            setmenuId: '',
            total: 0
        }
    }];
    this.finalCartMenu = [{
        carb: '',
        item: '',
        itemId: '',
        portion: '',
        ingredients: [],
        qty: 0,
        price: 0,
        total: 0,
        isEdit: true
    }];
  }

  getAllCustomMenus(): void {
    this.menuService
      .getAllCustomMenus()
      .then(menus => {
        this.menus = menus;
        const gross = this.menus[0].portions[0].price + this.menus[0].carbs[0].price;
        this.menus[0].totalPrice = gross;
        this.menus[0].previousCarbPrice = this.menus[0].carbs[0].price;
        this.menus[0].previousPortionPrice = this.menus[0].portions[0].price;
        this.menuService.hideUiBlocker();
      });
  }

  addCustomMenu(): void {
    this.menuService
      .getAllCustomMenus()
      .then(menus => {
        const resp = menus;
        const gross = this.menus[0].portions[0].price + this.menus[0].carbs[0].price;
        resp[0].totalPrice = gross;
        resp[0].previousCarbPrice = this.menus[0].carbs[0].price;
        resp[0].previousPortionPrice = this.menus[0].portions[0].price;
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
    this.getCartDetails();
    this.getFinalOrder();
    this.totalPrice = 0;
    this.customKottuMenu = 1;
    this.itemCompleted = false;
  }
    getFinalOrder(): void {
        this.menuService.getOrders()
            .subscribe(orders => {this.finalOrder = orders;});
    }

    getCartDetails(): void {
        this.menuService.getCart()
            .subscribe(list => {this.cartInfo = list;});
    }

    getOtherPrice(obj: any, objIndex:number, selected: string) {
        let newPrice = 0;
        for (let innerIndex of Object.keys(obj)) {
            if  (obj[innerIndex].name === selected) {
                newPrice = obj[innerIndex].price;
                if(this.finalOrderMenu[objIndex].ingredients.length > 0) {
                    for (let j = 0; j < this.finalOrderMenu[objIndex].ingredients.length; j++) {
                        const ingId = this.finalOrderMenu[objIndex].ingredients[j];
                        const filterdArray = this.menus[objIndex].ingredients.filter(ing => ingId === ing.id);
                        newPrice = newPrice + filterdArray[0].price;
                    }
                }
                break;
            }
        }
        return newPrice;
    }

  changePortion(event: any, obj: object, type: string, index: number, elementId: string) {
    const element = (document.getElementById(elementId)) as HTMLSelectElement;
    const selectedPortion = element.options[element.selectedIndex].value;
    for (let key of Object.keys(obj)) {
      if (event.target.value === obj[key].name) {
        if (type === 'portion') {
          // this.menus[index].previousPrice = obj[key].price;
            const otherMenu = this.getOtherPrice(this.menus[index].carbs, index, selectedPortion);
          // this.menus[index].totalPrice = otherMenu + obj[key].price;
          // this.finalCartMenu[index].portion = obj[key].id;
            this.menus[index].totalPrice = obj[key].price + otherMenu;
            this.menus[index].previousPortionPrice = obj[key].price;
            this.finalCartMenu[index].portion = obj[key].id;
        } else {
          // this.menus[index].previousPrice = obj[key].price;
            const otherMenu = this.getOtherPrice(this.menus[index].portions, index, selectedPortion);
          // this.menus[index].totalPrice = otherMenu + obj[key].price;
          // this.finalCartMenu[index].carb = obj[key].id;
            this.menus[index].totalPrice = obj[key].price + otherMenu;
            this.menus[index].previousCarbPrice = obj[key].price;
            this.finalCartMenu[index].carb = obj[key].id;
        }
      }
    }
      this.isCartDisable();
  }

  calculateAddons(event: any, price: number, id: string, index: number) {
    if (event.target.checked) {
      this.menus[index].totalPrice += price;
      this.finalOrderMenu[index].ingredients.push(id);
      this.finalCartMenu[index].ingredients.push(id);
    } else {
      this.menus[index].totalPrice -= price;
      this.finalCartMenu[index].ingredients.splice(index, 1)
    }
    this.isCartDisable();
  }

  initializeOrder(action: string) {
    if (action === 'add') {
      const cart = {
          carb: '',
          item: '',
          itemId: '',
          ingredients: [],
          portion: '',
          qty: 0,
          price: 0,
          total: 0,
          isEdit: true
      };
      const newObj = {
          ingredients: [],
          orderDetail: {
              id: '',
              isCustom: true,
              itemId: '',
              orderId: '',
              price: 0,
              qty: 0,
              setmenuId: '',
              total: 0
          }
      };
        this.finalOrderMenu.push(newObj);
        this.finalCartMenu.push(cart);
    } else {
        this.finalOrderMenu.splice(this.menus.length, 1);
        this.finalCartMenu.splice(this.menus.length, 1);
    }
  }

  createNewCustomMenu(model: number) {
    this.menuService.showUiBlocker();
    if (model > this.menus.length) {
      for (let k = 0; k < model - this.menus.length; k++) {
        this.addCustomMenu();
        this.initializeOrder('add');
      }
    } else if (model !== null) {
      this.removeCustomMenu(model);
      this.initializeOrder('remove');
    } else {
        this.menuService.hideUiBlocker();
    }
    this.isCartDisable();
  }

    blockCharacters(event: any) {
        if (event.keyCode === 48 || event.keyCode === 43 || event.keyCode === 45) {
            event.preventDefault();
        }
    }

    isCartDisable() {
        for (let k = 0; k < this.finalCartMenu.length; k++) {
           if (this.finalCartMenu[k].ingredients.length > 0 && this.finalCartMenu[k].portion !== '' && this.finalCartMenu[k].carb !== '') {
                this.itemCompleted = true;
           } else {
               this.itemCompleted = false;
           }
        }
    }
}
