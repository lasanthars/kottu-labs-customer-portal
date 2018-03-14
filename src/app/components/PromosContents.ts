import {Component} from '@angular/core';
const promos = require( '../../images/promos.jpg');

@Component({
  selector: 'kottu-lab-promo-contents',
  template: require('./PromosContents.html')
})
export class PromosContentsComponent {
    public promoImage: any;

    constructor() {
        this.promoImage = promos;
    }
}
