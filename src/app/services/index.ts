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

import { ORDERS } from '../constants/OrderData';
import { CART } from '../constants/CartData';

@Injectable()
export class HttpService {
  private headers = new Headers({'Content-Type': 'application/json'});
  private getSigMenusUrl = apiCalls.SIGATURE_MENUS;
  private getCustomMenusUrl = apiCalls.CUSTOM_MENUS;
  private getOtherMenusUrl = apiCalls.OTHER_MENUS;
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
    return this.http.get(this.getOtherMenusUrl, {headers: this.headers})
      .toPromise()
      .then(response => response.json() as OtherMenuInterface[])
      .catch(this.handleError);
  }

    // post the order
    // placeOrder(): Promise<OrderInterface[]> {
    //     return this.http.post(this.placeOrderUrl, {headers: this.headers})
    //         .toPromise()
    //         .then(response => response.json() as OrderInterface[])
    //         .catch(this.handleError);
    // }

    getOrders(): Observable<OrderInterface[]> {
        if (localStorage.finalOrder) {
            return of(JSON.parse(localStorage.finalOrder));
        } else {
            return of(ORDERS);
        }
    }

    getCart(): Observable<CartInterface[]> {
        if (localStorage.myCart) {
            return of(JSON.parse(localStorage.myCart));
        } else {
            return of(CART);
        }
    }

    pushCart(cart: any): Observable<CartInterface[]> {
        this.showUiBlocker();
        if (cart.length === 0 && localStorage.myCart) {
            localStorage.removeItem("myCart");
        } else if(cart.length > 0 && localStorage.myCart) {
            localStorage.myCart = JSON.stringify(cart);
        } else {
            localStorage.setItem("myCart", JSON.stringify(cart));
        }
        return of(CART);
    }

    pushOrder(order: any): Observable<OrderInterface[]> {
        this.showUiBlocker();
        if (order.length === 0 && localStorage.finalOrder) {
            localStorage.removeItem("finalOrder");
        } else if(order.length > 0 && localStorage.finalOrder) {
            localStorage.setItem("finalOrder", JSON.stringify(order));
        } else {
            localStorage.setItem("finalOrder", JSON.stringify(order));
        }
        return of(ORDERS);
    }

      showUiBlocker() {
        document.getElementById('uiBlockerLoader').style.display = 'block';
      }

      hideUiBlocker() {
        document.getElementById('uiBlockerLoader').style.display = 'none';
      }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
  //
  // getAllSignatureMenus(url){
  //   return this.http.prototype.get(url).map((res) => res.json());
  // }
}
