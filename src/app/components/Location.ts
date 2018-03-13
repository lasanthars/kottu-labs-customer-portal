import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
const ico1 = require( '../../images/phone.png');
const ico2 = require( '../../images/location.png');
const ico3 = require( '../../images/time.png');

@Component({
  selector: 'kottu-lab-location',
  template: require('./Location.html')
})
export class LocationComponent {
    private fragment: string;
    private scroll: any;
    public ico1: any;
    public ico2: any;
    public ico3: any;

    constructor(private route: ActivatedRoute) {
        this.ico1 = ico1;
        this.ico2 = ico2;
        this.ico3 = ico3;
    }

    ngOnInit() {
        this.scroll = this.route.fragment.subscribe(fragment => { this.fragment = fragment; });
    }

    ngAfterViewInit(): void {
        try {
            document.querySelector('#' + this.fragment).scrollIntoView({ behavior: 'smooth' });
        } catch (e) { }
    }

    ngOnDestroy() {
        this.scroll.unsubscribe();
    }

}
