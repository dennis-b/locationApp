/**
 * Created by dennis on 28/07/2015.
 */

import {Config, Inject, Run} from 'annotations/ng-decorator';
import * as CONST  from 'const'

class AppUtils {

    @Run()
    @Inject('$injector')
    static setInjector($injector) {
        AppUtils.$injector = $injector;
    }

    static pascalCaseToCamelCase(string) {
        if (!string) {
            return '';
        }
        return string.charAt(0).toLowerCase() + string.substring(1);
    }

    static dashCaseToCamelCase(string) {
        if (!string) {
            return '';
        }
        return string.replace(/-([a-z])/ig, function (all, letter) {
            return letter.toUpperCase();
        });
    }

    static getService(name) {
        return AppUtils.$injector.get(name);
    }


    static isNetwork() {
        return AppUtils.getService('$cordovaNetwork').isOnline();
    }

    static showLoader() {
        AppUtils.getService('$ionicLoading').show({
            template: '<ion-spinner class="light"></ion-spinner>',
            hideOnStateChange: true
        })
    }

    static hideLoader() {
        AppUtils.getService('$ionicLoading').hide();
    }

    static onShareCategories() {

        var localStorageService = AppUtils.getService('localStorageService');
        var $cordovaFile = AppUtils.getService('$cordovaFile');
        var categories = localStorageService.get('categories');

        $cordovaFile.writeFile(cordova.file.externalRootDirectory, "categories.json", JSON.stringify(categories), true)
            .then(function (success) {
                var files = [cordova.file.externalRootDirectory + "categories.json"];
                AppUtils.shareEmail("Categories", files);
            }, function (error) {
                console.log(error)
            });
    }

    static onShareLocations() {
        var localStorageService = AppUtils.getService('localStorageService');
        var $cordovaFile = AppUtils.getService('$cordovaFile');
        var locations = localStorageService.get('locations');

        $cordovaFile.writeFile(cordova.file.externalRootDirectory, "locations.json", JSON.stringify(locations), true)
            .then(function (success) {
                var files = [cordova.file.externalRootDirectory + "locations.json"];
                AppUtils.shareEmail("Locations", files);
            }, function (error) {
                console.log(error)
            });
    }


    static shareEmail(title, files) {
        AppUtils.showLoader();
        var $cordovaSocialSharing = AppUtils.getService('$cordovaSocialSharing');
        $cordovaSocialSharing.shareViaEmail("", title, [], null, null, files).then(function (res) {
            AppUtils.hideLoader();
        }, function (err) {
            AppUtils.hideLoader();
            console.log("share error onShareEmail " + err)
        });
    }

}

export default  AppUtils;