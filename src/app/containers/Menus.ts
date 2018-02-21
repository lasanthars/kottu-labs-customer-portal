import {Component} from '@angular/core';

@Component({
  selector: 'kottu-labs-app',
  template: require('./Menus.html'),
})
export class MenusComponent {
  public pageMenuTitle: string;
  public pageStartersTitle: string;
  public pageBeverageTitle: string;
  public pageDesertTitle: string;

  constructor() {
    this.pageMenuTitle = 'Kottu Mains';
    this.pageStartersTitle = 'Starters';
    this.pageBeverageTitle = 'Beverages';
    this.pageDesertTitle = 'Deserts';
  }
}
