import {Injectable} from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
// import { catchError, map, tap } from 'rxjs/operators';

import * as apiCalls from '../constants/ApiCalls';

import { SignatureMenuInterface } from '../interface/SignatureMenuInterface';
import { CustomMenuInterface } from '../interface/CustomMenuInterface';
import { OtherMenuInterface } from '../interface/OtherMenuInterface';
import { OrderInterface } from '../interface/OrderInterface';
import { CartInterface } from '../interface/CartInterface';
import { Customer } from '../interface/CustomerInterface';

import { ORDERS } from '../constants/OrderData';
import { CART } from '../constants/CartData';

@Injectable()
export class HttpService {
  private headers = new Headers({'Content-Type': 'application/json'});
  private getSigMenusUrl = apiCalls.SIGATURE_MENUS;
  private getCustomMenusUrl = apiCalls.CUSTOM_MENUS;
  private getOtherMenusUrl = apiCalls.OTHER_MENUS;
  private getCustomer = apiCalls.GET_CUSTOMER;
  private saveCusomer = apiCalls.SET_CUSTOMER;
  private placeOrderUrl = apiCalls.POST_ORDER;

  constructor(private http: Http) { }

  // get all signature kottu
  getAllSignatureMenus(): Promise<SignatureMenuInterface[]> {
    return this.http.get(this.getSigMenusUrl, {headers: this.headers})
      .toPromise()
      .then(response => response.json() as SignatureMenuInterface[])
      .catch(this.handleError);
  }

  // get all custom kottu
  getAllCustomMenus(): Promise<CustomMenuInterface[]> {
    return this.http.get(this.getCustomMenusUrl, {headers: this.headers})
      .toPromise()
      .then(response => [response.json()] as CustomMenuInterface[])
      .catch(this.handleError);
  }

  // get all custom items
  getAllOtherMenus(): Promise<OtherMenuInterface[]> {
      this.showUiBlocker('Fetching all menus');
    return this.http.get(this.getOtherMenusUrl, {headers: this.headers})
      .toPromise()
      .then(response => response.json() as OtherMenuInterface[])
      .catch(this.handleError);
  }

    // post the order
    placeOrder(order: any): Promise<OrderInterface[]> {
        return this.http.post(this.placeOrderUrl, JSON.stringify(order), {headers: this.headers})
            .toPromise()
            .then(response => response.text() ? response.json() : {success: true, message: 'order completed successfully.'});
    }

    // post customer

    saveCustomer(customer: any): Promise<Customer[]> {
        this.showUiBlocker('Saving Customer Information');
        return this.http.post(this.saveCusomer, JSON.stringify(customer), {headers: this.headers})
            .toPromise()
            .then(response => response.json() as Customer[])
            .catch(this.handleError);
    }

    checkCustomerAvailability(email: any): Promise<Customer[]> {
        this.showUiBlocker('Checking your availability');
        return this.http.get(this.getCustomer + email, {headers: this.headers})
            .toPromise()
            .then(response => response.json() as Customer[]);
    }

    getOrders(): Observable<OrderInterface[]> {
        this.showUiBlocker('');
        if (localStorage.finalOrder) {
            return of(JSON.parse(localStorage.finalOrder));
        } else {
            return of(ORDERS);
        }
    }

    getCart(): Observable<CartInterface[]> {
        this.showUiBlocker('');
        if (localStorage.myCart) {
            return of(JSON.parse(localStorage.myCart));
        } else {
            return of(CART);
        }
    }

    pushCart(cart: any): Observable<CartInterface[]> {
        this.showUiBlocker('');
        if (cart[0].cart.length === 0 && localStorage.myCart) {
            localStorage.removeItem("myCart");
        } else if(cart[0].cart.length > 0 && localStorage.myCart) {
            localStorage.myCart = JSON.stringify(cart);
        } else {
            localStorage.setItem("myCart", JSON.stringify(cart));
        }
        return of(cart);
    }

    pushOrder(order: any): Observable<OrderInterface[]> {
        this.showUiBlocker('');
        if (order[0].orderDetailDTO.length === 0 && localStorage.finalOrder) {
            localStorage.removeItem("finalOrder");
        } else if(order[0].orderDetailDTO.length > 0 && localStorage.finalOrder) {
            localStorage.setItem("finalOrder", JSON.stringify(order));
        } else {
            localStorage.setItem("finalOrder", JSON.stringify(order));
        }
        return of(order);
    }

      showUiBlocker(text: string) {
          const element = document.getElementById('uiBlockerLoader');
          if (text && text !== '') {
              element.getElementsByTagName('span')[0].innerHTML = text;
          } else {
              element.getElementsByTagName('span')[0].innerHTML = 'Preparing your Kottu...';
          }
        element.style.display = 'block';
      }

      hideUiBlocker() {
        document.getElementById('uiBlockerLoader').style.display = 'none';
      }

  private handleError(error: any): Promise<any> {
    this.hideUiBlocker();
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
  //
  // getAllSignatureMenus(url){
  //   return this.http.prototype.get(url).map((res) => res.json());
  // }
}
