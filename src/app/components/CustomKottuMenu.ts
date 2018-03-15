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
  public timer: any[];
  public showContents: boolean;
  private totalPrice: any;
  private finalOrderMenu: any;
  private finalCartMenu: any;

  constructor(private menuService: HttpService) {
    this.kImg1 = k1;
    this.modalId = 'customKottuModalDialog';
    this.modalInfo =['/Menu', '/CustomKottu', 'Add another Kottu'];
    this.showContents = false;
    this.finalOrderMenu = [{
        ingredients: [],
        orderDetail: {
            carbId: '',
            id: '',
            isCustom: true,
            itemId: '',
            orderId: '',
            portionId: '',
            price: 0,
            qty: 1,
            setmenuId: 1,
            total: 0
        }
    }];
    this.finalCartMenu = [{
        carb: '',
        item: 'My Kottu',
        itemId: '',
        portion: '',
        ingredients: [],
        qty: 1,
        price: 0,
        total: 0,
        isEdit: true,
        isKottu: true
    }];
    this.timer = [];
  }

  getAllCustomMenus(): void {
    this.menuService
      .getAllCustomMenus()
      .then(menus => {
        this.menus = menus;
        const gross = this.menus[0].portions[0].price + this.menus[0].carbs[0].price;
        this.menus[0].totalPrice = gross;
        this.finalOrderMenu[0].orderDetail.carbId = this.menus[0].carbs[0].id;
        this.finalCartMenu[0].carb = this.menus[0].carbs[0].name;
        this.finalOrderMenu[0].orderDetail.portionId = this.menus[0].portions[0].id;
        this.finalCartMenu[0].portion = this.menus[0].portions[0].name;
        this.menuService.hideUiBlocker();
      });
  }

    toggleShow(){
        this.showContents = !this.showContents;
    }

  addCustomMenu(): void {
    this.menuService
      .getAllCustomMenus()
      .then(menus => {
        const resp = menus;
        const gross = this.menus[0].portions[0].price + this.menus[0].carbs[0].price;
        resp[0].totalPrice = gross;
        this.menus.push(...resp);
        this.menuService.hideUiBlocker();
      });
  }

  removeCustomMenu(index: number) {
    this.menus.splice(index);
    this.menuService.hideUiBlocker();
  }

  ngOnInit(): void {
    this.menuService.showUiBlocker('Preparing your personalized kottu');
    this.getAllCustomMenus();
    this.getCartDetails();
    this.getFinalOrder();
    this.totalPrice = 0;
    this.customKottuMenu = 1;
    this.itemCompleted = false;
  }

  setCustomInfo() {

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
            if  (obj[innerIndex].id === selected) {
                newPrice = obj[innerIndex].price;
                if(this.finalOrderMenu[objIndex].ingredients.length > 0) {
                    for (let j = 0; j < this.finalOrderMenu[objIndex].ingredients.length; j++) {
                        const ingId = this.finalOrderMenu[objIndex].ingredients[j];
                        const filterdArray = this.menus[objIndex].ingredients.filter(ing => ingId === ing.id);
                        newPrice = newPrice + filterdArray[0].price;
                    }
                    break;
                }
            }
        }
        return newPrice;
    }

  changePortion(event: any, obj: object, type: string, index: number, elementId: string) {
    const element = (document.getElementById(elementId)) as HTMLSelectElement;
    const selectedPortion = element.options[element.selectedIndex].value;
    for (let key of Object.keys(obj)) {
      if (event.target.value === obj[key].id) {
        if (type === 'portion') {
            const otherMenu = this.getOtherPrice(this.menus[index].carbs, index, selectedPortion);
            this.menus[index].totalPrice = obj[key].price + otherMenu;
            this.finalOrderMenu[index].portionId = obj[key].id;
            this.finalOrderMenu[index].setmenuId = obj[key].setmenu_type;
            this.finalCartMenu[index].portion = obj[key].name;
        } else {
            const otherMenu = this.getOtherPrice(this.menus[index].portions, index, selectedPortion);
            this.menus[index].totalPrice = obj[key].price + otherMenu;
            this.finalOrderMenu[index].carbId = obj[key].id;
            this.finalCartMenu[index].carb = obj[key].name;
        }
      }
    }
      this.isCartDisable();
  }

  calculateAddons(event: any, price: number, id: string, name: string, index: number) {
    if (event.target.checked) {
      this.menus[index].totalPrice += price;
      this.finalOrderMenu[index].ingredients.push(id);
      this.finalCartMenu[index].ingredients.push(name);
    } else {
      this.menus[index].totalPrice -= price;
      const newOrderArray = this.finalOrderMenu[index].ingredients.filter(order => order !== id);
      this.finalOrderMenu[index].ingredients = newOrderArray;
      const newCartArray = this.finalCartMenu[index].ingredients.filter(cart => cart !== id);
      this.finalCartMenu[index].ingredients = newCartArray;
    }
    this.isCartDisable();
  }

  initializeOrder(action: string) {
    if (action === 'add') {
      const cart = {
          carb: '',
          item: 'My Kottu',
          itemId: '',
          ingredients: [],
          portion: '',
          qty: 1,
          price: 0,
          total: 0,
          isEdit: true,
          isKottu: true
      };
      const newObj = {
          ingredients: [],
          orderDetail: {
              carbId: '',
              id: '',
              isCustom: true,
              itemId: '',
              orderId: '',
              portionId: '',
              price: 0,
              qty: 1,
              setmenuId: '',
              total: 0
          }
      };
        newObj.orderDetail.carbId = this.menus[0].carbs[0].id;
        cart.carb = this.menus[0].carbs[0].name;
        newObj.orderDetail.portionId = this.menus[0].portions[0].id;
        cart.portion = this.menus[0].portions[0].name;
        this.finalOrderMenu.push(newObj);
        this.finalCartMenu.push(cart);
    } else {
        this.finalOrderMenu.splice(this.menus.length, 1);
        this.finalCartMenu.splice(this.menus.length, 1);
    }

  }

  createNewCustomMenu(model: number) {
    this.menuService.showUiBlocker('Preparing your personalized kottu');
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
        const checkAllItems = [];
        for (let k = 0; k < this.finalOrderMenu.length; k++) {
           if (this.finalOrderMenu[k].ingredients.length > 0) {
               checkAllItems.push('true');
           } else {
               checkAllItems.push('false');
           }
        }
        const checkArray = checkAllItems.filter(check => check === 'true');
        this.itemCompleted = checkArray.length === this.finalCartMenu.length ? true : false;
    }

    addOrderToCart() {
        for (let k = 0; k < this.menus.length; k++) {
            this.finalOrderMenu[k].orderDetail.price = this.menus[k].totalPrice;
            this.finalOrderMenu[k].orderDetail.total = this.menus[k].totalPrice;
            this.finalCartMenu[k].price = this.menus[k].totalPrice;
            this.finalCartMenu[k].total = this.menus[k].totalPrice;
            this.finalOrder[0].order.grossTotal += this.menus[k].totalPrice;
            this.finalOrder[0].order.nettTotal += this.menus[k].totalPrice;
            this.finalOrder[0].orderDetailDTO.push(this.finalOrderMenu[k]);
            this.cartInfo[0].cart.push(this.finalCartMenu[k]);
        }
        this.menuService.pushCart(this.cartInfo).subscribe(result => {this.cartInfo = result; this.menuService.hideUiBlocker()});
        this.menuService.pushOrder(this.finalOrder).subscribe(result => {this.finalOrder = result; this.menuService.hideUiBlocker()});
    }
}
