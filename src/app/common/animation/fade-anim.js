import {Animation} from 'annotations/ng-decorator';

class FadeIn {
    @Animation({
        name: '.an-fade-in'
    })
    static FadeIn() {
        return {
            enter: function (element, doneFn) {
                TweenMax.set(element, {autoAlpha: 0});
                TweenMax.to(element, 3, {autoAlpha: 1, onComplete: doneFn});
            },
            leave: function (element, doneFn) {
                TweenMax.set(element, {autoAlpha: 1});
                TweenMax.to(element, 1, {autoAlpha: 0, onComplete: doneFn});
            },
            animate: function (element, from, to, done, options) {
                console.log(element);
                done();
            },
            setClass: function (element, from, to, done, options) {
                console.log(element);
                done();
            }
        }
    }
}