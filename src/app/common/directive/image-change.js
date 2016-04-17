import {Directive} from 'annotations/directive-decorator';

@Directive({
    selector: 'imageChange'
})
//
class ImageChange {
    constructor($timeout) {
        this.restrict = "A";
        this.scope = {
            animation: "="
        };
    }

    link(scope, element, attrs) {
        TweenMax.set(element, {autoAlpha: 0});
        TweenMax.to(element, 3, {autoAlpha: 1});
    }
}

export default ImageChange