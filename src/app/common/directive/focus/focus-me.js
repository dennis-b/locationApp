import {Directive} from 'annotations/directive-decorator';
import Utils from '../../../core/utils/app-utils'


@Directive({
    selector: 'focusMe'
})
//
class FocusMe {
    constructor($timeout, $cordovaKeyboard) {
        this.$timeout = $timeout;
        this.$cordovaKeyboard = $cordovaKeyboard;
    }

    link(scope, element, attrs) {
        let _this = this;
        this.$timeout(function () {
            element[0].focus();
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.show(); //open keyboard manually
            }
        }, 350);
    }

}

export default FocusMe
