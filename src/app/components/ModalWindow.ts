import {Component, Input} from '@angular/core';

@Component({
  selector: 'kottu-lab-modal-window',
  template: require('./ModalWindow.html')
})
export class ModalWindowComponent {
    @Input()
    public modalid: any = '';

    @Input()
    public urls: any = [];
}
