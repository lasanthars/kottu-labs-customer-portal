import { Component, OnInit } from '@angular/core';
import { OtherMenuInterface } from '../interface/OtherMenuInterface';
import { OrderInterface } from '../interface/OrderInterface';
import { CartInterface } from '../interface/CartInterface';

import { HttpService } from '../services';

const k1 = require( '../../images/sea_food_kottu.jpg');

@Component({
  selector: 'kottu-lab-deserts',
  template: require('./Deserts.html')
})
export class DesertsComponent {
  otherMenus: OtherMenuInterface[];
  finalOrder: OrderInterface[];
  cartInfo: CartInterface[];
  public modalInfo: any[];
  public kImg1: any;
  public modalId: string;
  public isKottuAvailable: boolean;

  constructor(private starterService: HttpService) {
    this.getAllOtherMenus();
    this.getCartDetails();
    this.kImg1 = k1;
    this.modalId = 'desertsModalDialog';
    this.modalInfo =['/Menu', '/SignatureKottu', 'Add another Kottu'];
    this.isKottuAvailable = false;
  }

    checkKottu() {
        this.isKottuAvailable = false;
        if(this.cartInfo){
            for (let key of Object.keys(this.cartInfo[0].cart)) {
                if(this.cartInfo[0].cart[key].isKottu){
                    this.isKottuAvailable = true;
                    break;
                }
            }
        }
        return this.isKottuAvailable;
    }

  getAllOtherMenus(): void {
    this.starterService
      .getAllOtherMenus()
      .then(menus => {
        this.otherMenus = menus;
        this.starterService.hideUiBlocker();
      });
  }

  getFinalOrder(): void {
      this.starterService.getOrders()
          .subscribe(orders => {this.finalOrder = orders; this.starterService.hideUiBlocker();});
  }

  getCartDetails(): void {
      this.starterService.getCart()
          .subscribe(list => {this.cartInfo = list; this.starterService.hideUiBlocker();});
  }

  toggleQuantity(value: number, index: number, price: number) {
    const newPrice = price * value;
    this.otherMenus[index].newPrice = newPrice;
  }

    blockCharacters(event: any) {
        let inputChar = event.charCode;
        if (event.keyCode === 48 || event.keyCode === 43 || event.keyCode === 45) {
            event.preventDefault();
        }
    }

    addOrderToCart(item: object, quantity: number, tooltip: string) {
        this.getCartDetails();
        this.getFinalOrder();
        let isDuplicate = false;
        const today = new Date();
        const cart = {
            item: '',
            itemId: '',
            ingredients: [],
            qty: 0,
            portion: '',
            price: 0,
            total: 0,
            isEdit: false,
            isKottu: false
        };
        const newObj = {
            ingredients: [''],
            orderDetail: {
                carbId: '',
                id: '',
                isCustom: false,
                itemId: '',
                orderId: '',
                portionId: '',
                price: 0,
                qty: 0,
                setmenuId: '',
                total: 0
            }
        };
        if (this.finalOrder[0].orderDetailDTO.length === 0) {
            newObj.orderDetail.itemId = item['id'];
            newObj.orderDetail.price = item['price'];
            newObj.orderDetail.total = item['price'] * quantity;
            newObj.orderDetail.qty = quantity;
            this.finalOrder[0].orderDetailDTO.push(newObj);
            this.finalOrder[0].order.grossTotal = item['price'] * quantity;
            this.finalOrder[0].order.nettTotal = item['price'] * quantity;
            cart.item = item['name'];
            cart.itemId = item['id'];
            cart.qty = quantity;
            cart.price = item['price'];
            cart.total = item['price'] * quantity;
            this.cartInfo[0].cart.push(cart);
        } else {
            for (let key of Object.keys(this.finalOrder[0].orderDetailDTO)) {
                if(this.finalOrder[0].orderDetailDTO[key].orderDetail.itemId === item['id']){
                    this.finalOrder[0].order.grossTotal -= this.finalOrder[0].orderDetailDTO[key].orderDetail.total;
                    this.finalOrder[0].order.nettTotal  -= this.finalOrder[0].orderDetailDTO[key].orderDetail.total;
                    this.finalOrder[0].orderDetailDTO[key].orderDetail.qty += quantity;
                    this.finalOrder[0].orderDetailDTO[key].orderDetail.total = item['price'] * this.finalOrder[0].orderDetailDTO[key].orderDetail.qty;
                    this.finalOrder[0].order.grossTotal += this.finalOrder[0].orderDetailDTO[key].orderDetail.total;
                    this.finalOrder[0].order.nettTotal  += this.finalOrder[0].orderDetailDTO[key].orderDetail.total;
                    for (let index of Object.keys(this.cartInfo[0].cart)) {
                        if(this.cartInfo[0].cart[index].itemId === item['id']){
                            this.cartInfo[0].cart[index].qty += quantity;
                            this.cartInfo[0].cart[index].total = item['price'] * this.cartInfo[0].cart[index].qty;
                            break;
                        }
                    }
                    isDuplicate = true;
                    break;
                }
            }
            if(!isDuplicate) {
                newObj.orderDetail.itemId = item['id'];
                newObj.orderDetail.price = item['price'];
                newObj.orderDetail.total = item['price'] * quantity;
                newObj.orderDetail.isCustom = false;
                newObj.orderDetail.qty = quantity;
                this.finalOrder[0].orderDetailDTO.push(newObj);
                this.finalOrder[0].order.grossTotal += item['price'] * quantity;
                this.finalOrder[0].order.nettTotal += item['price'] * quantity;
                cart.item = item['name'];
                cart.itemId = item['id'];
                cart.qty = quantity;
                cart.price = item['price'];
                cart.total = item['price'] * quantity;
                this.cartInfo[0].cart.push(cart);
            }

        }
        this.finalOrder[0].order.orderDate = today.toJSON();
        this.starterService.pushCart(this.cartInfo).subscribe(result => {this.cartInfo = result;
            if(this.isKottuAvailable) {
                document.getElementById(tooltip).innerHTML = quantity + ' item(s) added.';
                document.getElementById(tooltip).style.display = 'block';
                setTimeout(() => {
                    document.getElementById(tooltip).style.display = 'none';
                },1500);
            }
            this.starterService.hideUiBlocker();});
        this.starterService.pushOrder(this.finalOrder).subscribe(result => {this.finalOrder = result; this.starterService.hideUiBlocker();});
    }
}
