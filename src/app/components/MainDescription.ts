import {Component} from '@angular/core';

const k1 = require('../../images/sea_food_kottu.jpg');
const k2 = require('../../images/vegetable_kottu.jpg');
const k3 = require('../../images/burgers.jpg');
const k4 = require('../../images/kebab.jpg');

@Component({
  selector: 'kottu-lab-home-desc',
  template: require('./MainDescription.html')
})
export class MainDescriptionComponent {
  public kImg1: any;
  public kImg2: any;
  public kImg3: any;
  public kImg4: any;

  constructor() {
    this.kImg1 = k1;
    this.kImg2 = k3;
    this.kImg3 = k2;
    this.kImg4 = k4;
  }
}
