import {Component} from '@angular/core';

@Component({
  selector: 'kottu-labs-app',
  template: require('./ViewCart.html'),
})
export class ViewCartComponent {
    public pageMenuTitle: string;

    constructor() {
        this.pageMenuTitle = 'Order Cart';
    }
}
