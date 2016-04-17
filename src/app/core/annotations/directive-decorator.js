/**
 * Created by dennis on 28/07/2015.
 */

import app from '../../main-module';
import AppUtils from '../utils/app-utils';
import Module from '../utils/module';
const module = new Module();
import adapter from 'ng2adapter';

function NG2Directive(options) {
    return function decorator(target) {
        options = options || {};
        const directiveName =
            AppUtils.dashCaseToCamelCase(options.selector) || AppUtils.pascalCaseToCamelCase(target.name);
        app.directive(directiveName, adapter.downgradeNg2Component(target));
    };
}


function Directive(options) {
    return function decorator(target) {
        options = options || {};
        const directiveName =
            AppUtils.dashCaseToCamelCase(options.selector) || AppUtils.pascalCaseToCamelCase(target.name);
        app.directive(directiveName, module.directiveFactory(target));
    };
}

function View(viewOptions) {
    let options = viewOptions;
    const defaults = {
        template: viewOptions.template,
        restrict: 'EA',
        scope: {},
        bindToController: true,
        controllerAs: 'vm'
    };
    return function decorator(target) {
        const directiveName =
            AppUtils.dashCaseToCamelCase(viewOptions.selector) || AppUtils.pascalCaseToCamelCase(target.name);
        options = options || (options = {});
        options.bindToController = options.bindToController || options.bind || {};

        app.directive(directiveName, function () {
            return Object.assign(defaults, {controller: module.normalizeConstructor(target)}, options);
        });
    };
}

export {View, Directive,NG2Directive};