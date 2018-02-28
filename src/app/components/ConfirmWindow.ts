import {Component, Input} from '@angular/core';
import { HttpService } from '../services';

import { CartInterface } from '../interface/CartInterface';
import {OrderInterface} from "../interface/OrderInterface";

@Component({
  selector: 'kottu-lab-confirm-window',
  template: require('./ConfirmWindow.html')
})
export class ConfirmWindowComponent {
    finalOrder: OrderInterface[];
    cartInfo: CartInterface[];
    @Input()
    public item: any = '';

    @Input()
    public total: number = 0;

    constructor(private cartService: HttpService) {};

    getCartDetails(): void {
        this.cartService.getCart()
            .subscribe(list => {this.cartInfo = list; this.cartService.hideUiBlocker();});
    }

    getFinalOrder(): void {
        this.cartService.getOrders()
            .subscribe(orders => {this.finalOrder = orders;});

    }

    removeItem(item: any, total: number) {
        this.getFinalOrder();
        this.getCartDetails();
        this.finalOrder[0].order.grossTotal = total - item.total;
        this.finalOrder[0].order.nettTotal = total - item.total;
        const newCart = this.cartInfo[0].cart.filter(list => {
            return list.itemId !== item.itemId
        });
        this.cartInfo[0].cart = newCart;
        const newFinalOrder = this.finalOrder[0].orderDetailDTO.filter(thing => thing.orderDetail.itemId !== item.itemId);
        this.finalOrder[0].orderDetailDTO = newFinalOrder;
        this.cartService.pushCart(this.cartInfo).subscribe(result => {
            this.cartInfo = result;
            this.cartService.hideUiBlocker();
        });
        this.cartService.pushOrder(this.finalOrder).subscribe(result => {
            this.finalOrder = result;
            this.cartService.hideUiBlocker();
            setTimeout(()=>{
                location.reload();
            },250)

        });
    }


}
