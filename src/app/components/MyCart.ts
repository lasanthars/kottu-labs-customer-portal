import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpService } from '../services';

import { CartInterface } from '../interface/CartInterface';
import {OrderInterface} from "../interface/OrderInterface";

@Component({
  selector: 'kottu-lab-cart',
  template: require('./MyCart.html')
})
export class MyCartComponent implements OnInit{
    cartInfo: CartInterface[];
    finalOrder: OrderInterface[];
    public itemToDelete: any;
    public newGrossTotal: number;
    public cartGrandTotal: number;
    public customerFormModel: string;
    constructor(private cartService: HttpService) {
        this.itemToDelete = '';
        this.cartGrandTotal = 0;
        this.customerFormModel = 'customerFormModel'
    }

    ngOnInit(): void {
        this.cartService.showUiBlocker('Preparing your cart...');
        this.getCartDetails();
        this.getFinalOrder();
        this.newGrossTotal = 0;
        this.calculateSum();
    }

    getCartDetails(): void {
        this.cartService.getCart()
            .subscribe(list => {
                this.cartInfo = list;
                this.cartService.hideUiBlocker();
            });
    }

    getFinalOrder(): void {
        this.cartService.getOrders()
            .subscribe(orders => {this.finalOrder = orders;this.cartService.hideUiBlocker();});

    }


    calculateSum() {
        for (let k = 0; k < this.cartInfo[0].cart.length; k++) {
            this.cartGrandTotal += this.cartInfo[0].cart[k].total;
        }
        this.newGrossTotal = this.cartGrandTotal;
        return this.cartGrandTotal;
    }


    assignToConfirm(item: any, index: number) {
        this.itemToDelete = [index, item];
    }
    setReadOnly(element: string) {
        document.getElementById(element).removeAttribute("readonly");
    }

    toggleValue(item: any, value:number, index:number){
        if (value) {
            this.cartGrandTotal = (this.cartGrandTotal - item.total) + item.price * value;
            this.cartInfo[0].cart[index].total = item.price * value;
            this.finalOrder[0].orderDetailDTO[index].orderDetail.qty = value;
            this.finalOrder[0].orderDetailDTO[index].orderDetail.total = item.price * value;
            this.finalOrder[0].order.grossTotal = this.cartGrandTotal;
            this.finalOrder[0].order.nettTotal = this.cartGrandTotal;
        } else {
            item.qty = 1;
        }
    }

    checkout() {
        this.cartService.pushCart(this.cartInfo).subscribe(result => {this.cartInfo = result; this.cartService.hideUiBlocker()});
        this.cartService.pushOrder(this.finalOrder).subscribe(result => {this.finalOrder = result; this.cartService.hideUiBlocker()});
    }


    blockCharacters(event: any) {
        if (event.keyCode === 48 || event.keyCode === 43 || event.keyCode === 45) {
            event.preventDefault();
        }
    }
}
