import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'kottu-lab-location',
  template: require('./Location.html')
})
export class LocationComponent {
    private fragment: string;
    private scroll: any;

    constructor(private route: ActivatedRoute) { }

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
