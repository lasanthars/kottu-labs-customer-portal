import { Component } from '@angular/core';
import { ActivatedRoute }   from '@angular/router';
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
  public modalId: string;
  public modalInfo: any[];
  public veggeies: any[];
  public itemCompleted: boolean;
  public showContents: boolean;
  public menuInterval: any;
  public editItem: any[];
  private totalPrice: any;
  private finalOrderMenu: any;
  private finalCartMenu: any;
  private routerParam: number;

  constructor(private menuService: HttpService, private route: ActivatedRoute) {
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
    this.veggeies = [];
    this.itemCompleted = false;
    this.editItem = [];
      this.menuService.showUiBlocker('Preparing your personalized kottu');
      this.getRouterParam();
      this.getCartDetails();
      this.getFinalOrder();
      this.getAllCustomMenus();
      this.totalPrice = 0;
      this.customKottuMenu = 1;
      if(this.routerParam && this.finalOrder[0].orderDetailDTO.length > this.routerParam){
        this.editItem.push(this.finalOrder[0].orderDetailDTO[this.routerParam]);
        this.menuInterval = setInterval(() => {
            if(this.menus){
                this.menus[0].totalPrice = this.finalOrder[0].orderDetailDTO[this.routerParam].orderDetail.total;
                this.checkTheDisability();
                clearInterval(this.menuInterval);
            }
          },25);
        this.finalOrderMenu.pop();
        this.finalOrderMenu.push(this.finalOrder[0].orderDetailDTO[this.routerParam]);
        this.finalCartMenu.pop()
        this.finalCartMenu.push(this.cartInfo[0].cart[this.routerParam]);
        this.itemCompleted = true;
      } else if(this.routerParam && this.finalOrder[0].orderDetailDTO.length <= this.routerParam){
          window.location.href = '/404';
      }

  }


  getAllCustomMenus(): void {
    this.menuService
      .getAllCustomMenus()
      .then(menus => {
        this.menus = menus;
        const gross = this.menus[0].portions[0].price + this.menus[0].carbs[0].price;
        this.menus[0].veggeies = [];
        this.menus[0].protein = [];
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

    getRouterParam(){
        this.route.params.subscribe(params => {
            this.routerParam = params['index'];
        });
    }
  addCustomMenu(): void {
    this.menuService
      .getAllCustomMenus()
      .then(menus => {
        const resp = menus;
        const gross = this.menus[0].portions[0].price + this.menus[0].carbs[0].price;
        resp[0].veggeies = [];
          resp[0].protein = [];
        resp[0].totalPrice = gross;
        this.menus.push(...resp);
          this.isCartDisable();
        this.menuService.hideUiBlocker();
      });
  }

  removeCustomMenu(index: number) {
    this.menus.splice(index);
      this.finalCartMenu.splice(index);
      this.isCartDisable();
    this.menuService.hideUiBlocker();
  }

  // ngOnInit(): void {
  //   this.menuService.showUiBlocker('Preparing your personalized kottu');
  //   this.getAllCustomMenus();
  //   this.getCartDetails();
  //   this.getFinalOrder();
  //   this.totalPrice = 0;
  //   this.customKottuMenu = 1;
  //   this.route.params.subscribe(params => {
  //       this.routerParam = params['index'];
  //   });
  //   this.editItem.push(this.finalOrder[0].orderDetailDTO[this.routerParam]);
  // }

    getFinalOrder(): void {
        this.menuService.getOrders()
            .subscribe(orders => {this.finalOrder = orders;});
    }

    getCartDetails(): void {
        this.menuService.getCart()
            .subscribe(list => {this.cartInfo = list;});
    }

    getOtherPrice(obj: any, objIndex:number, selected: string) {
        debugger;
        let newPrice = 0;
        let hasIngredients = false;
        for (let innerIndex of Object.keys(obj)) {
            if  (obj[innerIndex].id === selected) {
                newPrice = obj[innerIndex].price;
                if(this.finalOrderMenu[objIndex].ingredients.length > 0) {
                    for (let j = 0; j < this.finalOrderMenu[objIndex].ingredients.length; j++) {
                        const ingId = this.finalOrderMenu[objIndex].ingredients[j];
                        const filterdArray = this.menus[objIndex].ingredients.filter(ing => ingId === ing.id);
                        //this.menus[index].totalPrice =  (ingredient.type === 1 && this.menus[index].veggeies.length <= 1 || ingredient.type === 2) ? this.menus[index].totalPrice + ingredient.price : (this.menus[index].totalPrice - ingredient.price) + ingredient.price;
                        if((hasIngredients === false && filterdArray[0].type === 1) || filterdArray[0].type === 2){
                            newPrice = newPrice + filterdArray[0].price;
                            hasIngredients = true;
                        }
                        else{
                            newPrice = (newPrice - filterdArray[0].price )+ filterdArray[0].price;
                        }
                    }
                    break;
                }
            }
        }
        return newPrice;
    }

    checkTheDisability() {
        for(let z = 0; z < this.menus[0].ingredients.length; z++){
           for (let b = 0; b < this.editItem[0].ingredients.length; b++) {
               if(this.menus[0].ingredients[z].type === 1 && this.menus[0].ingredients[z].id === this.editItem[0].ingredients[b]) {
                   this.menus[0].veggeies.push(this.editItem[0].ingredients[b]);
                   (<HTMLInputElement>document.getElementById('veggies_0' + z)).checked = true;
                   (<HTMLInputElement>document.getElementById('veggies_0' + z)).disabled = false;
               } else if(this.menus[0].ingredients[z].type === 1 && this.menus[0].ingredients[z].id !== this.editItem[0].ingredients[b] && (this.editItem[0].ingredients.length - 1) === 4 && !(<HTMLInputElement>document.getElementById('veggies_0' + z)).checked){
                   (<HTMLInputElement>document.getElementById('veggies_0' + z)).disabled = true;
               } else if(this.menus[0].ingredients[z].type === 2 && this.menus[0].ingredients[z].id === this.editItem[0].ingredients[b]){
                   this.menus[0].protein.push(this.editItem[0].ingredients[b]);
                   (<HTMLInputElement>document.getElementById('protein_0' + z)).checked = true;
                   (<HTMLInputElement>document.getElementById('protein_0' + z)).disabled = false;
               }else if(this.menus[0].ingredients[z].type === 2 && this.menus[0].ingredients[z].id !== this.editItem[0].ingredients[b]){
                   (<HTMLInputElement>document.getElementById('protein_0' + z)).disabled = true;
               }
           }


            // if(this.menus[0].ingredients[z].type === 1 && this.menus[0].ingredients[z].id === this.editItem[0].ingredients[z]) {
            //     this.menus[0].veggeies.push(ingredient.id);
            //     return true;
            // } else if(ingredient.type === 2 && ingredient.id === this.editItem[0].ingredients[z]){
            //     this.menus[0].protein.push(ingredient.id);
            //    return true;
            // }
        }
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

  calculateAddons(event: any, ingredient: any, index: number) {
    if (event.target.checked) {
      this.disableOtherChecks(event.target.checked, ingredient, index);
      this.menus[index].totalPrice =  (ingredient.type === 1 && this.menus[index].veggeies.length <= 1 || ingredient.type === 2) ? this.menus[index].totalPrice + ingredient.price : (this.menus[index].totalPrice - ingredient.price) + ingredient.price;
      this.finalOrderMenu[index].ingredients.push(ingredient.id);
      this.finalCartMenu[index].ingredients.push(ingredient.name);
    } else {
      this.disableOtherChecks(event.target.checked, ingredient, index);
      this.menus[index].totalPrice =  (ingredient.type === 1 && this.menus[index].veggeies.length === 0 || ingredient.type === 2) ? this.menus[index].totalPrice - ingredient.price : this.menus[index].totalPrice;
      const newOrderArray = this.finalOrderMenu[index].ingredients.filter(order => order !== ingredient.id);
      this.finalOrderMenu[index].ingredients = newOrderArray;
      const newCartArray = this.finalCartMenu[index].ingredients.filter(cart => cart !== ingredient.name);
      this.finalCartMenu[index].ingredients = newCartArray;
    }
    this.isCartDisable();
  }

  disableOtherChecks(checked: boolean, ingredient: any, menuIndex: number){
    if(checked && ingredient.type === 1 && this.menus[menuIndex].veggeies.indexOf(ingredient.id) === -1){
        this.menus[menuIndex].veggeies.push(ingredient.id);
    } else{
        this.menus[menuIndex].veggeies = this.menus[menuIndex].veggeies.filter(ingd => ingd !== ingredient.id);
    }
      if(checked && ingredient.type === 2 && this.menus[menuIndex].protein.indexOf(ingredient.id) === -1){
          this.menus[menuIndex].protein.push(ingredient.id);
      } else{
          this.menus[menuIndex].protein = this.menus[menuIndex].protein.filter(ingd => ingd !== ingredient.id);
      }
      if(checked && ingredient.type === 2){
          this.menus[menuIndex].protein.push(ingredient.id);
      }else{

      }
      this.disableOtherChecksLoop(checked, ingredient, menuIndex);
  }

  disableOtherChecksLoop(checked: boolean, ingredient: any, menuIndex: number){
      for(let h = 0; h < this.menus[menuIndex].ingredients.length; h++) {
          if(ingredient.type === 1 && this.menus[menuIndex].veggeies.length > 0 && this.menus[menuIndex].ingredients[h].id !== ingredient.id) {
              for (let v = 0; v < this.menus[menuIndex].veggeies.length; v++) {
                  if (checked && this.menus[menuIndex].veggeies.length === 4 && this.menus[menuIndex].ingredients[h].id !== this.menus[menuIndex].veggeies[v] && (<HTMLInputElement>document.getElementById('veggies_' + menuIndex + h)) && !(<HTMLInputElement>document.getElementById('veggies_' + menuIndex + h)).checked) {
                      (<HTMLInputElement>document.getElementById('veggies_'+ menuIndex + h)).disabled = checked;
                  } else if (!checked && this.menus[menuIndex].veggeies.length < 4 && this.menus[menuIndex].ingredients[h].id !== this.menus[menuIndex].veggeies[v] && (<HTMLInputElement>document.getElementById('veggies_' + menuIndex + h))){
                      (<HTMLInputElement>document.getElementById('veggies_' + menuIndex + h)).disabled = false;
                  }
              }
          }else if(ingredient.type === 2 && (<HTMLInputElement>document.getElementById('protein_' + menuIndex + h)) && this.menus[menuIndex].ingredients[h].id !== ingredient.id) {
              (<HTMLInputElement>document.getElementById('protein_' + menuIndex + h)).disabled = checked;

          }
      }
  }

    isCartDisable() {
      const checkAllItems = [];
        for (let k = 0; k < this.menus.length; k++) {
            if (this.menus[k].veggeies.length > 0 && this.menus[k].protein.length > 0) {
                checkAllItems.push('true');
            } else {
                checkAllItems.push('false');
            }
        }
        const checkArray = checkAllItems.filter(check => check === 'true');
        this.itemCompleted = checkArray.length === this.finalCartMenu.length ? true : false;
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
  }

    blockCharacters(event: any) {
        if (event.keyCode === 48 || event.keyCode === 43 || event.keyCode === 45) {
            event.preventDefault();
        }
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
