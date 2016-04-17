import {Animation} from 'annotations/ng-decorator';

class SlideLeftAnim {
    @Animation({
        name: '.an-slide-left'
    })
    static FadeIn() {
        return {
            enter: function (element, doneFn) {
                TweenMax.set(element, {x: element.parent().width()});
                TweenMax.to(element, 0.5, {x: 0, onComplete: doneFn});
            },
            leave: function (element, doneFn) {
                element.css('display', 'none');
                doneFn();
                // TweenMax.to(element, 10, {x: element.parent().width(), onComplete: doneFn});
            }
        }
    }
}