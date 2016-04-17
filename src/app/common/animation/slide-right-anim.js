import {Animation} from 'annotations/ng-decorator';

class SlideRightAnim {
    @Animation({
        name: '.an-slide-right'
    })
    static FadeIn() {
        return {
            enter: function (element, doneFn) {
                var x = element.parent().width();
                TweenMax.set(element, {x: -x});
                TweenMax.to(element, 0.5, {x: 0, onComplete: doneFn});
            },
            leave: function (element, doneFn) {
                element.css('display', 'none');
                doneFn();
                // var x = element.parent().width();
                // TweenMax.to(element, 1, {x: -x, onComplete: doneFn});
            }
        }
    }
}