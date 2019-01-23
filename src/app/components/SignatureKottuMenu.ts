import { Component, OnInit } from '@angular/core';
import { SignatureMenuInterface } from '../interface/SignatureMenuInterface';

import { HttpService } from '../services';
import {OrderInterface} from "../interface/OrderInterface";
import { CartInterface } from '../interface/CartInterface';

const k1 = require( '../../images/Kadala-Invasion.jpg');
const k2 = require( '../../images/Fish_n_Strings.jpg');
const k3 = require( '../../images/Crabbin_with_Pittu.jpg');
const k4 = require( '../../images/Beef-it-up.jpg');
const k5 = require( '../../images/Devilled_Dalla.jpg');
const k6 = require( '../../images/Cheese_n_Chicken-Liver.jpg');
const k7 = require( '../../images/Chicken_Kottu_Sawan.jpg');
const k8 = require( '../../images/Seafood_Kottu_Sawan.jpg');
const k9 = require( '../../images/Turkey_Parata_Meal.jpg');
const k10 = require( '../../images/Mini_Cheese_n_Chicken.jpg');
const k11 = require( '../../images/Beef_Parata_Meal.jpg')
const k12 = require( '../../images/Seafood_Parata_Meal.jpg')
const k13 = require( '../../images/Chicken_Parata_Meal.jpg')
const k14 = require( '../../images/Mini-Sausage-Noodles-Kottu.png')
const k15 = require( '../../images/Mini-Prawn-Noodle-Kottu.png')
const k16 = require( '../../images/Mini-Beef-Kottu.png')

@Component({
  selector: 'kottu-lab-signature-kottu-menu',
  template: require('./SignatureKottuMenu.html')
})
export class SignatureKottuMenuComponent {
  menus: SignatureMenuInterface[];
  finalOrder: OrderInterface[];
  cartInfo: CartInterface[];
  public modalId: string;
  public kImages: any[];
  public modalInfo: any[];

  constructor(private menuService: HttpService) {
    this.kImages = [k1,k2,k3,k4,k5,k6,k7,k8,k9,k10,k11,k12,k13,k14,k15,k16];
    this.modalId = 'signatureModalDialog';
    this.modalInfo =['/Menu', '/SignatureKottu', 'Add another Kottu'];
  }

  getAllSignatureMenus(): void {
      this.menuService.showUiBlocker('Preparing the signature kottu list...');
    this.menuService
      .getAllSignatureMenus()
      .then(menus => {
        this.menus = menus;
        this.menuService.hideUiBlocker();
      });
  }

  ngOnInit(): void {
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

  convertToTotalQuantity(price: any, index: number, quantity: number) {
      this.menus[index].setmenu.newPrice = price*quantity;
  }

    blockCharacters(event: any) {
        if (event.keyCode === 48 || event.keyCode === 43 || event.keyCode === 45) {
            event.preventDefault();
        }
    }

    addOrderToCart(selectedMenu: any, quantity: number, index: number, portion: string){
        this.getCartDetails();
        this.getFinalOrder();
        const item = selectedMenu.setmenu;
        const element = (document.getElementById(portion)) as HTMLSelectElement;
        const selectedPortion = element.options[element.selectedIndex].text;
        const selectedPortionId = element.options[element.selectedIndex].value;
        let isDuplicate = false;
        const today = new Date();
        //const unitPrice = this.retreiveItemPrice(selectedMenu.portions, selectedPortion);
        const cart = {
            item: '',
            itemId: '',
            ingredients: [],
            qty: 0,
            portion: '',
            price: 0,
            total: 0,
            isEdit: false,
            isKottu: true
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
            newObj.orderDetail.portionId = selectedPortionId;
            this.finalOrder[0].orderDetailDTO.push(newObj);
            this.finalOrder[0].order.grossTotal = item['newPrice'];
            this.finalOrder[0].order.nettTotal = item['newPrice'];
            cart.item = item['name'] + " (" + selectedPortion + ")";
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
                cart.item = item['name'] + " (" + selectedPortion + ")";
                cart.itemId = item['id'];
                cart.qty = quantity;
                cart.price = item['price'];
                cart.total = item['price'] * quantity;
                this.cartInfo[0].cart.push(cart);
            }
            newObj.orderDetail.portionId = selectedPortionId;
        }
        this.finalOrder[0].order.orderDate = today.toJSON();
        this.menuService.pushCart(this.cartInfo).subscribe(result => {this.cartInfo = result; this.menuService.hideUiBlocker()});
        this.menuService.pushOrder(this.finalOrder).subscribe(result => {this.finalOrder = result; this.menuService.hideUiBlocker()});
    }
}

