import { Component, OnInit } from '@angular/core';
import { SignatureMenuInterface } from '../interface/SignatureMenuInterface';

import { HttpService } from '../services';
import {OrderInterface} from "../interface/OrderInterface";
import { CartInterface } from '../interface/CartInterface';

const k1 = require( '../../images/sea_food_kottu.jpg');

@Component({
  selector: 'kottu-lab-signature-kottu-menu',
  template: require('./SignatureKottuMenu.html')
})
export class SignatureKottuMenuComponent {
  menus: SignatureMenuInterface[];
  finalOrder: OrderInterface[];
  cartInfo: CartInterface[];
  public modalId: string;
  public kImg1: any;
  public modalInfo: any[];

  constructor(private menuService: HttpService) {
    this.kImg1 = k1;
      this.modalId = 'signatureModalDialog';
      this.modalInfo =['/Menu', '/SignatureKottu', 'Add another Kottu'];
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

    getFinalOrder(): void {
        this.menuService.getOrders()
            .subscribe(orders => {this.finalOrder = orders;});

    }

    getCartDetails(): void {
        this.menuService.getCart()
            .subscribe(list => {this.cartInfo = list;});

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

      retreiveItemPrice(selectedMenu, selectedText: string){
          for (let portionIndex of Object.keys(selectedMenu)) {
            if(selectedMenu[portionIndex].name === selectedText) {
                return selectedMenu[portionIndex].price;
            }
          }
      }

    blockCharacters(event: any) {
        if (event.keyCode === 48 || event.keyCode === 43 || event.keyCode === 45) {
            event.preventDefault();
        }
    }

    addOrderToCart(selectedMenu: any, quantity: number, portion: string){
        this.getCartDetails();
        this.getFinalOrder();
        const item = selectedMenu.setmenu;
        const element = (document.getElementById(portion)) as HTMLSelectElement;
        const selectedPortion = element.options[element.selectedIndex].text;
        let isDuplicate = false;
        const today = new Date();
        const unitPrice = this.retreiveItemPrice(selectedMenu.portions, selectedPortion);
        const cart = {
            item: '',
            itemId: '',
            ingredients: [],
            qty: 0,
            portion: '',
            price: 0,
            total: 0,
            isEdit: false
        };
        const newObj = {
            ingredients: [''],
            orderDetail: {
                id: '',
                isCustom: false,
                itemId: '',
                orderId: '',
                price: 0,
                qty: 0,
                setmenuId: '',
                total: 0
            }
        };
        if (this.finalOrder[0].orderDetailDTO.length === 0) {
            newObj.orderDetail.itemId = item['id'];
            newObj.orderDetail.price = unitPrice;
            newObj.orderDetail.total = unitPrice * quantity;
            newObj.orderDetail.qty = quantity;
            this.finalOrder[0].orderDetailDTO.push(newObj);
            this.finalOrder[0].order.grossTotal = item['newPrice'];
            this.finalOrder[0].order.nettTotal = item['newPrice'];
            cart.item = item['name'] + " (" + selectedPortion + ")";
            cart.itemId = item['id'];
            cart.qty = quantity;
            cart.price = unitPrice;
            cart.total = unitPrice * quantity;
            this.cartInfo[0].cart.push(cart);
        } else {
            for (let key of Object.keys(this.finalOrder[0].orderDetailDTO)) {
                if(this.finalOrder[0].orderDetailDTO[key].orderDetail.itemId === item['id']){
                    this.finalOrder[0].order.grossTotal -= this.finalOrder[0].orderDetailDTO[key].orderDetail.total;
                    this.finalOrder[0].order.nettTotal  -= this.finalOrder[0].orderDetailDTO[key].orderDetail.total;
                    this.finalOrder[0].orderDetailDTO[key].orderDetail.qty += quantity;
                    this.finalOrder[0].orderDetailDTO[key].orderDetail.total = unitPrice * this.finalOrder[0].orderDetailDTO[key].orderDetail.qty;
                    this.finalOrder[0].order.grossTotal += this.finalOrder[0].orderDetailDTO[key].orderDetail.total;
                    this.finalOrder[0].order.nettTotal  += this.finalOrder[0].orderDetailDTO[key].orderDetail.total;
                    for (let index of Object.keys(this.cartInfo[0].cart)) {
                        if(this.cartInfo[0].cart[index].itemId === item['id']){
                            this.cartInfo[0].cart[index].qty += quantity;
                            this.cartInfo[0].cart[index].total = unitPrice * this.cartInfo[0].cart[index].qty;
                            break;
                        }
                    }
                    isDuplicate = true;
                    break;
                }
            }
            if(!isDuplicate) {
                newObj.orderDetail.itemId = item['id'];
                newObj.orderDetail.price = unitPrice;
                newObj.orderDetail.total = unitPrice * quantity;
                newObj.orderDetail.isCustom = false;
                newObj.orderDetail.qty = quantity;
                this.finalOrder[0].orderDetailDTO.push(newObj);
                this.finalOrder[0].order.grossTotal += unitPrice * quantity;
                this.finalOrder[0].order.nettTotal += unitPrice * quantity;
                cart.item = item['name'] + " (" + selectedPortion + ")";
                cart.itemId = item['id'];
                cart.qty = quantity;
                cart.price = unitPrice;
                cart.total = unitPrice * quantity;
                this.cartInfo[0].cart.push(cart);
            }

        }
        this.finalOrder[0].order.orderDate = today.toJSON();
        this.menuService.pushCart(this.cartInfo).subscribe(result => {this.cartInfo = result; this.menuService.hideUiBlocker()});
        this.menuService.pushOrder(this.finalOrder).subscribe(result => {this.finalOrder = result; this.menuService.hideUiBlocker()});
    }
}

