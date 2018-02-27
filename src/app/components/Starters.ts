import { Component, OnInit } from '@angular/core';
import { OtherMenuInterface } from '../interface/OtherMenuInterface';
import { HttpService } from '../services';
import { OrderInterface } from '../interface/OrderInterface';
import { CartInterface } from '../interface/CartInterface';
const k1 = require( '../../images/sea_food_kottu.jpg');

@Component({
  selector: 'kottu-lab-starters',
  template: require('./Starters.html')
})
export class StartersComponent {
  otherMenus: OtherMenuInterface[];
  finalOrder: OrderInterface[];
  cartInfo: CartInterface[];
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

  getFinalOrder(): void {
    this.starterService.getOrders()
        .subscribe(orders => {this.finalOrder = orders;});

  }

    getCartDetails(): void {
        this.starterService.getCart()
            .subscribe(list => {this.cartInfo = list;});

    }

  pushFinalOrder() {

  }

  addOrderToCart(item: object, quantity: number) {
      this.getCartDetails();
      this.getFinalOrder();
      const today = new Date();
      const cart = {
          item: '',
          itemId: '',
          ingredients: [],
          qty: 0,
          price: 0,
          isEdit: false
      };
      const newObj = {
          ingredients: [''],
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
     if (this.finalOrder[0].orderDetailDTO.length === 0) {
          newObj.orderDetail.itemId = item['id'];
          newObj.orderDetail.price = item['price'];
          newObj.orderDetail.total = item['price'] * quantity;
          newObj.orderDetail.isCustom = false;
          newObj.orderDetail.qty = quantity;
          this.finalOrder[0].orderDetailDTO.push(newObj);
          this.finalOrder[0].order.grossTotal = item['price'] * quantity;
          this.finalOrder[0].order.nettTotal = item['price'] * quantity;
          cart.item = item['name'];
          cart.itemId = item['id'];
          cart.qty = quantity;
          cart.price = item['price'] * quantity;
          this.cartInfo[0].cart.push(cart);
     } else {
         for (let key of Object.keys(this.finalOrder[0].orderDetailDTO)) {
             if(this.finalOrder[0].orderDetailDTO[key].orderDetail.itemId === item['id']){
                 this.finalOrder[0].order.grossTotal -= this.finalOrder[0].orderDetailDTO[key].orderDetail.total;
                 this.finalOrder[0].order.nettTotal -= this.finalOrder[0].orderDetailDTO[key].orderDetail.total;
                 this.finalOrder[0].orderDetailDTO.splice(Number(key), 1);
                 this.cartInfo[0].cart.splice(Number(key), 1);
                 break;
             }
         }
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
         cart.price = item['price'] * quantity;
         this.cartInfo[0].cart.push(cart);

     }
     this.finalOrder[0].order.orderDate = today.toJSON();
      this.starterService.pushCart(this.cartInfo).subscribe(result => this.cartInfo = result);
     this.starterService.pushOrder(this.finalOrder).subscribe(result => this.finalOrder = result);
  }
}
