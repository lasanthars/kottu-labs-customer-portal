import {Component, Input} from '@angular/core';

@Component({
  selector: 'kottu-lab-hotline',
  template: require('./Hotline.html')
})
export class HotlineComponent {
  @Input()
  public title: string = '';
}
