import { Component } from '@angular/core';
import { OtherMenuInterface } from '../interface/OtherMenuInterface';
import { HttpService } from '../services';
import { OrderInterface } from '../interface/OrderInterface';
import { CartInterface } from '../interface/CartInterface';
const apptImages = {
    
    0: require( '../../images/Pineapple-Fries.jpg'),
    1: require( '../../images/Cheesy-Mashed-Potatoes.jpg'),
    2: require( '../../images/Chicken-Kebab.jpg'),
    3: require('../../images/Chrispy-Chicken-Wrap.png'),
    4: require('../../images/Egg_Wrap.jpg')
    
   //2: require( '../../images/Chicken-Kebab.jpg'),
};

@Component({
  selector: 'kottu-lab-starters',
  template: require('./Starters.html')
})
export class StartersComponent {
  otherMenus: OtherMenuInterface[];
  finalOrder: OrderInterface[];
  cartInfo: CartInterface[];
  public modalInfo: any[];
  public modalId: string;
  public kImges: any[];
  public isKottuAvailable: boolean;

  constructor(private starterService: HttpService) {
    this.getAllOtherMenus();
    this.getCartDetails();
    this.starterService.showUiBlocker('Preparing menu(s)');
    this.isKottuAvailable = false;
    this.kImges = [];
    this.modalId = 'starterModalDialog';
    this.modalInfo =['/Menu', '/SignatureKottu', 'Add another Kottu'];
  }

  getAllOtherMenus(): void {
    this.starterService
      .getAllOtherMenus()
      .then(menus => {
        this.otherMenus = menus;
        this.assignImages(this.otherMenus);
        this.starterService.hideUiBlocker();
      });
  }

  toggleQuantity(value: number, index: number, price: number) {
    const newPrice = price * value;
    this.otherMenus[index].newPrice = newPrice;
  }

  assignImages(allMenus: Array<any>){
      let l = 0;
    for(let j = 0; j < allMenus.length; j++){
        if(allMenus[j].type === '2') {
            this.kImges.push(apptImages[l]);
            l++
        } else {
            this.kImges.push('');
        }

    }
  }

  getFinalOrder(): void {
    this.starterService.getOrders()
        .subscribe(orders => {this.finalOrder = orders; this.starterService.hideUiBlocker();});

  }

    getCartDetails(): void {
        this.starterService.getCart()
            .subscribe(list => {this.cartInfo = list; this.starterService.hideUiBlocker();});

    }

    blockCharacters(event: any) {
        if (event.keyCode === 48 || event.keyCode === 43 || event.keyCode === 45) {
            event.preventDefault();
        }
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
     this.starterService.pushCart(this.cartInfo).subscribe(result => {
         this.cartInfo = result;
         if(this.isKottuAvailable) {
            document.getElementById(tooltip).innerHTML = quantity + ' item(s) added.';
            document.getElementById(tooltip).style.display = 'block';
             setTimeout(() => {
                 document.getElementById(tooltip).style.display = 'none';
             },1500);
         }
         this.starterService.hideUiBlocker();
     });
     this.starterService.pushOrder(this.finalOrder).subscribe(result => {this.finalOrder = result; this.starterService.hideUiBlocker()});
  }
}
