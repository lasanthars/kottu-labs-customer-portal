import {Component} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AppComponent} from './containers/App';
import {SignatureKottuComponent} from './containers/SignatureKottu';
import {CustomKottuComponent} from './containers/CustomKottu';
import {MenusComponent} from './containers/Menus';
import {ViewCartComponent} from './containers/ViewCart';
import {PromosComponent} from './containers/Promos';
import {AboutUsComponent} from './containers/AboutUs';

@Component({
  selector: 'kottu-labs-root',
  template: '<router-outlet></router-outlet>'
})
export class RootComponent {}

export const routes: Routes = [
  {
    path: '',
    component: AppComponent
  },
  {
      path: 'Home',
      component: AppComponent
  },
    {
        path: 'AboutUs',
        component: AboutUsComponent
    },
  {
    path: 'SignatureKottu',
    component: SignatureKottuComponent
  },
  {
    path: 'CustomKottu',
    component: CustomKottuComponent
  },
  {
    path: 'Menu',
    component: MenusComponent
  },
  {
      path: 'YourCart',
      component: ViewCartComponent
  },
  {
      path: 'Promos',
      component: PromosComponent
  }
];

export const routing = RouterModule.forRoot(routes);
