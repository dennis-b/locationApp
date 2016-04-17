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

    onShareEmail() {
        AppUtils.showLoader();
        var fileArr = [this.shareDataImage];
        var $cordovaSocialSharing = AppUtils.getService('$cordovaSocialSharing');
        this.$cordovaSocialSharing.shareViaEmail("", "Locations", [], null, null, fileArr).then(function (res) {
            AppUtils.hideLoader();
        }, function (err) {
            AppUtils.hideLoader();
            console.log("share error onShareEmail " + err)
        });
    }

}

export default  AppUtils;