import {Component} from '@angular/core';

@Component({
  selector: 'kottu-labs-app',
  template: require('./SignatureKottu.html'),
})
export class SignatureKottuComponent {
  public pageSubTitle: string;

  constructor() {
    this.pageSubTitle = 'CHOOSE YOUR SIGNATURE KOTTU ORDER';
  }
}
