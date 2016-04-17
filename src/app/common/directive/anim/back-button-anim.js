import {Directive} from 'annotations/directive-decorator';
import {Inject} from 'annotations/ng-decorator';

@Directive({
    selector: 'backButtonAnim'
})
//
class BackButtonAnim {
    constructor() {
    }

    compile(element, attributes) {
        TweenMax.set(element, {css: {x: 30, opacity: 0}});
    }

    link(scoe, element, attributes, ngModel) {
        TweenMax.to(element, 1, {css: {x: 0, opacity: 1}});
    }
}

export default BackButtonAnim