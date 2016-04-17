/**
 * Created by dennis on 28/07/2015.
 */

import app from '../../main-module';

function RouteConfig(stateName, options) {
    return function decorator(target) {
        app.config(['$stateProvider', ($stateProvider) => {
            //todo fix this
            if (options.views) {
                angular.forEach(options.views, function (value, key) {
                    options.views[key].controller = target;
                    options.views[key].controllerAs = 'vm';
                });
            } else {
                options.controller = target;
                options.controllerAs = 'vm';
            }
            $stateProvider.state(stateName, options);
        }]);
        app.controller(target.name, target);
    };
}


export {RouteConfig};