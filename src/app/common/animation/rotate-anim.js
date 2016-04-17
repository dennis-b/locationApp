import {Animation} from 'annotations/ng-decorator';

class AnRotate {
    @Animation({
        name: '.an-rotate'
    })
    static AnRotate() {
        return {
            enter: function (element, doneFn) {
                var tl = new TimelineLite({delay: 1});
                tl.to(element, 0.25, {rotation: 20})
                    .to(element, 0.2, {
                        rotation: -20,
                        ease: Power1.easeInOut,
                        repeat: 1,
                        yoyo: false,
                        repeatDelay: 0.2
                    }, 0.2)
                    .to(element, 0.25, {rotation: 0}, "+=0.2");
                doneFn();
            }
        }
    }
}