import {Component} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'kottu-lab-footer',
  template: require('./Footer.html')
})
export class FooterComponent {
    private router: any;
    constructor(private _router: Router) {
        this.router = _router;
    }

    scollToElement(element: any) {
        if(this.router.url === '/'){
            document.querySelector('#' + element).scrollIntoView({ behavior: 'smooth' });
        }
    }
}
