import {Directive} from 'annotations/directive-decorator';
import Utils from '../../../core/utils/app-utils'


@Directive({
    selector: 'cmToInch'
})
//
class CmToInch {
    constructor($rootScope, localStorageService) {
        this.restrict = "A";
        this.$rootScope = $rootScope;
        this.localStorageService = localStorageService;
        this.scope = {
            cmToInch: "="
        };
    }

    link(scope, element, attrs) {
        let _this = this;
        //scope.changeValue = scope.changeValue || true;
        scope.$watch('cmToInch', function (newVal, oldVal) {
            if (newVal) {
                element.html(CmToInch.getHtmlVal(scope));
            }
        });

        element.html(CmToInch.getHtmlVal(scope));
    }

    static getHtmlVal(scope, val) {

        if (!scope.cmToInch || scope.cmToInch == 0) {
            return scope.cmToInch;
        }

        if (Utils.isUserInInch()) {
            return Utils.toInch(scope.cmToInch);
        }

        return Math.round(scope.cmToInch * 10) / 10;
    }


}

export default CmToInch