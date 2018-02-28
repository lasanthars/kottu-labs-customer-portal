import { Component, OnInit } from '@angular/core';
import { OtherMenuInterface } from '../interface/OtherMenuInterface';
import { OrderInterface } from '../interface/OrderInterface';
import { CartInterface } from '../interface/CartInterface';
import { HttpService } from '../services';

const k1 = require( '../../images/sea_food_kottu.jpg');

@Component({
  selector: 'kottu-lab-beverages',
  template: require('./Beverages.html')
})
export class BeveragesComponent {
  otherMenus: OtherMenuInterface[];
  finalOrder: OrderInterface[];
  cartInfo: CartInterface[];
  public kImg1: any;
  public modalId: string;
  public addonUrl: string;
  public kottuUrl: string;


  constructor(private starterService: HttpService) {
    this.kImg1 = k1;
    this.modalId = 'beveragesModalDialog';
    this.addonUrl = '/Menu';
    this.kottuUrl = '/SignatureKottu';
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

  ngOnInit(): void {
    this.getAllOtherMenus();
  }

  toggleQuantity(value: number, index: number, price: number) {
    const newPrice = price * value;
    this.otherMenus[index].newPrice = newPrice;
  }

  addOrderToCart(item: object, quantity: number) {
      this.getCartDetails();
      this.getFinalOrder();
      let isDuplicate = false;
      const today = new Date();
      const cart = {
          item: '',
          itemId: '',
          ingredients: [],
          qty: 0,
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
      this.starterService.pushCart(this.cartInfo).subscribe(result => {this.cartInfo = result; this.starterService.hideUiBlocker();});
      this.starterService.pushOrder(this.finalOrder).subscribe(result => {this.finalOrder = result; this.starterService.hideUiBlocker();});
  }
}
