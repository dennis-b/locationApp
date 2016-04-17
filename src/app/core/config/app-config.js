import {Config, Inject, Run} from 'annotations/ng-decorator';
import AppPolyfills from "./polyfill";

class Configuration {
    @Config()
    @Inject('$compileProvider', '$urlRouterProvider', '$ionicConfigProvider', 'localStorageServiceProvider')
    static configFactory($compileProvider, $urlRouterProvider, $ionicConfigProvider, localStorageServiceProvider) {

        $urlRouterProvider.otherwise('/tab/category');
        $urlRouterProvider.when('/', '/tab/category');

        $ionicConfigProvider.views.forwardCache(true);
        $ionicConfigProvider.views.maxCache(0);
        $ionicConfigProvider.views.transition('ios');
        $ionicConfigProvider.scrolling.jsScrolling(true);
        $ionicConfigProvider.views.swipeBackEnabled(false);
        $ionicConfigProvider.tabs.style('standard');
        $ionicConfigProvider.tabs.position('bottom'); // other values: top
        $ionicConfigProvider.navBar.alignTitle('center');
        
        localStorageServiceProvider.setPrefix('loc');

        angular.autoValidate.errorMessages.default.max = "Maximum value is {0}";
        angular.autoValidate.errorMessages.default.min = "Minimum value is {0}";
        angular.autoValidate.errorMessages.default.maxlength = "Maximum is {0} characters";
        angular.autoValidate.errorMessages.default.minlength = "Minimum is {0} characters";
        angular.autoValidate.errorMessages.default.email = "Not valid email address";

        AppPolyfills.addPolyfills();

    }

    @Run()
    @Inject('$ionicPlatform', 'validator', 'validationDomModifier','localStorageService')
    static runFactory($ionicPlatform, validator, validationDomModifier,localStorageService) {
        validator.registerDomModifier(validationDomModifier.key, validationDomModifier);
        validator.setDefaultElementModifier(validationDomModifier.key);
        validator.defaultFormValidationOptions.validateOnFormSubmit = true;


        // localStorageService.set("categories",[]);
        // localStorageService.set("locations",[]);

        $ionicPlatform.ready(function () {
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);
            }

            if (window.StatusBar) {
                window.StatusBar.styleDefault();
            }
        });
    }
}
