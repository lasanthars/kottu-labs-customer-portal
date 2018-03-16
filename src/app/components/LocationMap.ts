import {Component} from '@angular/core';

@Component({
  selector: 'kottu-lab-location-map',
  template: require('./LocationMap.html')
})
export class LocationMapComponent {
  public lat: Number;
  public lng: Number;

  constructor() {
    this.lat = 6.8824139;
    this.lng = 79.8845207;
  }
}
