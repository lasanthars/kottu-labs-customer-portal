import {Component, Input} from '@angular/core';

@Component({
  selector: 'kottu-lab-inner-header',
  template: require('./InnerHeader.html')
})
export class InnerHeaderComponent {
  @Input()
  public title: string = '';

    checkforMainTitle(heading) {
      if(heading === 'Kottu Mains' || heading === 'OrderCart'){
        return true;
      } else {
          return false;
      }
    }
}
