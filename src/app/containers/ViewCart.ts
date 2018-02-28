import {Component} from '@angular/core';

@Component({
  selector: 'kottu-labs-app',
  template: require('./ViewCart.html'),
})
export class ViewCartComponent {
    public pageMenuTitle: string;
    public pageStartersTitle: string;
    public pageBeverageTitle: string;
    public pageDesertTitle: string;

    constructor() {
        this.pageMenuTitle = 'OrderCart';
        this.pageBeverageTitle = 'Beverages';
        this.pageDesertTitle = 'Deserts';
    }
}
