import {Component} from '@angular/core';

@Component({
  selector: 'kottu-labs-app',
  template: require('./SignatureKottu.html'),
})
export class SignatureKottuComponent {
  public pageMenuTitle: string;

  constructor() {
    this.pageMenuTitle = 'Choose a Signature Kottu';
  }
}
