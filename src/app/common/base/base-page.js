import {Config, Inject, Run} from 'annotations/ng-decorator';
import Utils from '../../core/utils/app-utils';
import NaviagtionPage from './naviagtion-page';

class BasePage extends NaviagtionPage {
    constructor() {
        super();
        BasePage.injectMembers(this, this.constructor, arguments);
    }

    static injectMembers(obj, func, args) {

        // if (args
        //     && angular.isArray(Array.prototype.slice.call(args))
        //     && args.length == 1
        //     && angular.isArray(Array.prototype.slice.call(args[0]))) {
        //
        //     args = Array.prototype.slice.call(args[0]);
        // }

        // inject constructor arguments to this instance
        var fields = Utils.$injector.annotate(func);
        for (var i = 0; i < fields.length; i++) {
            obj[fields[i]] = args[i];
        }
    }
}

export default BasePage