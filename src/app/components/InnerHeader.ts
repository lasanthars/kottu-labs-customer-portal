import {Component, Input} from '@angular/core';

@Component({
  selector: 'kottu-lab-inner-header',
  template: require('./InnerHeader.html')
})
export class InnerHeaderComponent {
  @Input()
  public title: string = '';
}
