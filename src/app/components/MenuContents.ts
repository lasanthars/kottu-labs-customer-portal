import {Component} from '@angular/core';

@Component({
  selector: 'kottu-lab-menu-contents',
  template: require('./MenuContents.html')
})
export class MenuContentsComponent {

    checkforMainTitle(heading) {
      if(heading === 'Kottu Mains' || heading === 'OrderCart'){
        return true;
      } else {
          return false;
      }
    }
}
