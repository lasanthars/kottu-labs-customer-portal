import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule }    from '@angular/http';
import {routing, RootComponent} from './routes';

import {AgmCoreModule} from 'angular2-google-maps/core';

import {AppComponent} from './containers/App';
import {HeaderComponent} from './components/Header';
import {NavigationComponent} from './components/Navigation';
import {HotlineComponent} from './components/Hotline';
import {MainBannerComponent} from './components/MainBanner';
import {MainDescriptionComponent} from './components/MainDescription';
import {LocationComponent} from './components/Location';
import {LocationMapComponent} from './components/LocationMap';
import {FooterComponent} from './components/Footer';
import {SignatureKottuComponent} from './containers/SignatureKottu';
import {SignatureKottuMenuComponent} from './components/SignatureKottuMenu';
import {CustomKottuComponent} from './containers/CustomKottu';
import {CustomKottuMenuComponent} from './components/CustomKottuMenu';
import {MenusComponent} from './containers/Menus';
import {InnerHeaderComponent} from './components/InnerHeader';
import {MainMenusComponent} from './components/MainMenus';
import {StartersComponent} from './components/Starters';
import {BeveragesComponent} from './components/Beverages';
import {DesertsComponent} from './components/Deserts';
import {ModalWindowComponent} from './components/ModalWindow';
import {ViewCartComponent} from './containers/ViewCart';
import {MyCartComponent} from './components/MyCart';
import {ConfirmWindowComponent} from './components/ConfirmWindow';


import {HttpService} from './services';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    AgmCoreModule.forRoot({apiKey: 'AIzaSyCPayHIwppZWiBbsZoB0-KGVV9l6ylMVk0'})
  ],
  declarations: [
    RootComponent,
    AppComponent,
    HeaderComponent,
    NavigationComponent,
    HotlineComponent,
    MainBannerComponent,
    MainDescriptionComponent,
    LocationComponent,
    LocationMapComponent,
    FooterComponent,
    SignatureKottuComponent,
    SignatureKottuMenuComponent,
    CustomKottuComponent,
    CustomKottuMenuComponent,
    MenusComponent,
    InnerHeaderComponent,
    MainMenusComponent,
    StartersComponent,
    BeveragesComponent,
    DesertsComponent,
    ModalWindowComponent,
    ViewCartComponent,
    MyCartComponent,
    ConfirmWindowComponent
  ],
  providers: [HttpService],
  bootstrap: [RootComponent]
})
export class AppModule {}
