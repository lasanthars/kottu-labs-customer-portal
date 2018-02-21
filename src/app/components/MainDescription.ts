import {Component} from '@angular/core';

const k1 = require('../../images/sea_food_kottu.jpg');
const k2 = require('../../images/sea_food_kottu_01.jpg');
const k3 = require('../../images/vegetable_kottu.jpg');
const k4 = require('../../images/vegetable_kottu_top.jpg');

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
    this.kImg2 = k2;
    this.kImg3 = k3;
    this.kImg4 = k4;
  }
}
