import {Component, Input} from '@angular/core';
import { HttpService } from '../services';
import {Customer} from '../interface/CustomerInterface';
import {OrderInterface} from "../interface/OrderInterface";
import { CartInterface } from '../interface/CartInterface';
import {location} from "@angular/platform-browser/src/facade/browser";

@Component({
  selector: 'kottu-lab-customer-form-window',
  template: require('./CustomerForm.html')
})
export class CustomerFormWindowComponent {
    customer = new Customer('','','','','','','','');
    finalOrder: OrderInterface[];
    cartInfo: CartInterface[];
    public isExistingCustomer: boolean;
    public orderError: boolean;
    public payment: number;
    constructor(private customerService: HttpService) {
        this.getCustomerInfo();
        this.getFinalOrder();
        this.isExistingCustomer = false;
        this.orderError = false;
        this.payment = 0;
    }
    @Input()
    public modalid: any = '';

    @Input()
    public modalinfo: any = [];

    submitted = false;

    onSubmit() {
        this.submitted = true;
        const today = new Date();
        this.finalOrder[0].order.notes = this.customer.notes;
        this.finalOrder[0].order.orderDate = today.toJSON();
        if (!this.isExistingCustomer) {
            this.customerService
                .saveCustomer(this.customer)
                .then(customer => {
                    this.finalOrder[0].order.customerId = customer['id'];
                    this.placeFinalOrder();
                    this.orderError = false;
                }).catch(e => {
                    this.customerService.hideUiBlocker();
                    this.orderError = true;
            });
        } else {
            this.finalOrder[0].order.customerId = this.customer.id;
            this.placeFinalOrder();
        }
    }

    placeFinalOrder(){
        this.customerService
            .placeOrder(this.finalOrder[0])
            .then(order => {
                if(order){
                    this.customerService.hideUiBlocker();
                    if(localStorage.finalOrder) {
                        localStorage.removeItem("finalOrder");
                    }
                    if(localStorage.myCart) {
                        localStorage.removeItem("myCart");
                    }
                    this.customerService.showUiBlocker('Your order has been placed successfully.');
                    setTimeout(() => {
                        location.reload()
                    },1000);
                }
            }).catch(e => {
            this.customerService.hideUiBlocker();
            this.orderError = true;
        });
    }

    getFinalOrder(): void {
        this.customerService.getOrders()
            .subscribe(orders => {this.finalOrder = orders;});

    }

    getCustomerInfo() : void {
        this.customer = new Customer('','','','','','','');
    }

    setExistingCustomer(customer: any) : void {
        this.customer = new Customer(customer.addressLine1, customer.city, customer.contactNo1, customer.email, customer.id, customer.name, '', customer.contactNo2 );
    }

    checkIfExisting(email: any, validity: any) : void {
        if(validity) {
            this.customerService
                .checkCustomerAvailability(email)
                .then(customer => {
                    this.isExistingCustomer = true;
                    this.setExistingCustomer(customer);
                    this.customerService.hideUiBlocker();
                }).catch(e => {
                    this.isExistingCustomer = false;
                    console.log('You are not an existing user');
                    this.customerService.hideUiBlocker();
                });
        }
    }
    changePaymentType(event: any){
        this.payment = event.target.value;
        this.finalOrder[0].order.paymentType = event.target.value;
    }
}
