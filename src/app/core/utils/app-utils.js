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

    static average(arr) {
        var number = _.reduce(arr, function (memo, num) {
                return memo + num;
            }, 0) / arr.length;

        return isNaN(number) ? arr[0] : Number(parseFloat(number).toFixed(2));
    }

    static calcMacAddress(device) {
        return device.name.split("-")[2];//todo add validation
    }

    static decimalToHex(d, padding) {
        var hex = Number(d).toString(16);
        padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;

        while (hex.length < padding) {
            hex = "0" + hex;
        }

        return hex;
    }

    static localEncodedStringToHex(string) {
        var data = atob(string);
        var bytes = "";
        for (var i = 0; i < data.length; i++) {
            bytes = bytes + AppUtils.decimalToHex(data.charCodeAt(i), 2);
        }
        return bytes;
    }

    static encodedStringToBytes(string) {
        var data = atob(string);
        var bytes = new Uint8Array(data.length);
        for (var i = 0; i < bytes.length; i++) {
            bytes[i] = data.charCodeAt(i);
        }
        return bytes;
    }

    static polinomial(val, adcPoints, minCm, maxCm) {
        if (val < CONST.MEASURE.MIN_VAL || val >= CONST.MEASURE.MAX_VAL) {
            return 0;
        }

        var y = 0;
        var maxPow = adcPoints.length;
        for (var i = 0; i < maxPow; i++) {
            y += adcPoints[i] * Math.pow(val, maxPow - i - 1);
        }
        if (y < minCm) {
            return minCm;
        }
        if (y > maxCm) {
            return maxCm;
        }
        return y;
    }

    static getClosetValInArray(num, arr) {
        var curr = arr[0];
        for (var i = 0; i < arr.length; i++) {
            var val = arr[i];
            if (Math.abs(num - val) < Math.abs(num - curr)) {
                curr = val
            }
        }
        return curr
    }

    static updateLocalStorageMeasureOffset(measureOffset) {
        if (!measureOffset) {
            return null;
        }

        var measureOffsetData = measureOffset.toJSON();
        AppUtils.getService('localStorageService').set('userLastOffsetMeasure', measureOffsetData);
        return measureOffsetData;
    }

    static updateLocalStorageMeasure(measure) {
        if (!measure) {
            return null;
        }

        var measureData = measure.toJSON();
        AppUtils.getService('localStorageService').set('userLastMeasure', measureData);
        return measureData;
    }

    static updateLocalStorageCatalog(catalogItems) {
        let catalogItemsJsonArr = [];
        for (var i = 0; i < catalogItems.length; i++) {
            var catalogItem = catalogItems[i];
            catalogItemsJsonArr.push(catalogItem.toJSON());
        }

        var sorted = catalogItemsJsonArr.sort(function (a, b) {
            return b - a;
        });

        AppUtils.getService('localStorageService').set('userLastCatalog', sorted);
        return sorted;
    }

    static updateLocalStorageAllMeasures(measures) {
        let jsonArr = [];
        for (var i = 0; i < measures.length; i++) {
            var measure = measures[i];
            jsonArr.push(measure.toJSON());
        }
        AppUtils.getService('localStorageService').set('userProgressMeasures', jsonArr);
        return jsonArr;
    }

    static closeAllPopups() {
        let $ionicPopup = AppUtils.getService('$ionicPopup');
        if ($ionicPopup._popupStack.length > 0) {
            $ionicPopup._popupStack.forEach(function (popup, index) {
                if (popup.isShown === true) {
                    return popup.hide();
                }
            });
        }
    }

    //todo dennis refactor for removing the omit - needed only for build catalog
    static getSortedMeasureStatsArray(statisticsData) {
        //calculated value for catalog
        statisticsData = _.omit(statisticsData, [CONST.MEASURE_TYPES.HIPS, CONST.MEASURE_TYPES.WAIST]);
        var values = Object.values(statisticsData);
        return _.sortBy(values, function (val) {
            return val.order;
        });
    }

    static sendParseRequest(caller, operation, args, callbacks, cacheable, localCall) {


        var funcArguments = !args ? [] : angular.isArray(args) ? args : [args];

        if (cacheable) {
            var result = operation.apply(caller, funcArguments);
            let fromCache = result.fromCache();
            if (fromCache) {
                return fromCache;
            } else {
                //caller = result;
                operation = result.operation;
            }
        }

        if (!localCall && !AppUtils.isNetwork()) {
            AppUtils.showConnectionErrorPopup();
            return AppUtils.getService('$q').reject("NO_INTERNET_CONNECTION");
        }

        callbacks = callbacks || {};
        let $ionicLoading = AppUtils.getService('$ionicLoading');
        $ionicLoading.show({template: '<ion-spinner class="light"></ion-spinner>'});

        var restCall = operation.apply(caller, funcArguments);
        restCall.then(
            function (response) {
                if (callbacks.success) {
                    callbacks.success(response);
                }
                $ionicLoading.hide();
                return response;
            },
            function (error) {
                $ionicLoading.hide();
                if (callbacks.error) {
                    callbacks.error(error);
                }
                AppUtils.handleParseError(error);

            });
        return restCall;
    }

    static showConnectionErrorPopup() {
        let params = {title: 'ERROR.CONNECTION_ERROR', text: 'ERROR.CONNECTION_ERROR_TEXT', okText: 'COMMON.CLOSE'};
        AppUtils.getService('modalService').show(params);
    }

    static isNetwork() {
        return AppUtils.getService('$cordovaNetwork').isOnline();
    }

    static handleParseError(error) {

        AppUtils.hideLoader();

        let Parse = AppUtils.getService('Parse');

        if (error && error.code === Parse.Error.INVALID_SESSION_TOKEN) {
            AppUtils.getService('authService').logout();
            AppUtils.getService('navigationService').goToLogin();
        }

        console.log("REST error: code = " + error.code + " message = " + error.message)
    }

    static showAppErrorMessage() {
        AppUtils.getService('$ionicLoading').show({
            template: '<ion-spinner class="light"></ion-spinner>',
            hideOnStateChange: true
        })
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

    static getRestCacheObject(fromCache, operation) {
        return {
            fromCache: fromCache,
            operation: operation
        }
    }

    static kgToLb(val) {
        var number = parseFloat(val) / 0.45359237;
        return Math.round(number * 10) / 10;
    }

    static lbToKg(val) {
        var number = parseFloat(val) * 0.45359237;
        return Math.round(number * 10) / 10;
    }

    static isTypeInKg(type) {
        return CONST.UNITS.isKG(type);

    }

    static isTypeInLb(type) {
        return CONST.UNITS.isLB(type);

    }

    static toInch(val) {
        var number = parseFloat(val) / 2.54;
        return Math.round(number * 10) / 10;
    }

    static inchToCm(val) {
        var number = parseFloat(val) * 2.54;
        return Math.round(number * 10) / 10;
    }

    static isUserInInch() {
        var user = AppUtils.getService('localStorageService').get('user');
        if (!user) {
            return false;
        }
        return CONST.UNITS.isINCH(user.heightUnits);

    }

    static isTypeInInch(type) {
        return CONST.UNITS.isINCH(type);

    }

    static isTypeInCm(type) {
        return CONST.UNITS.isCM(type);

    }

    static getMeasureOffsetByType(type, measureOffset) {
        if (!measureOffset) {
            return 0;
        }

        var length = measureOffset.data.length;
        for (var i = 0; i < length; i++) {
            var obj = measureOffset.data[i];
            if (type == obj.type) {
                return obj.offset;
            }
        }
        return 0;
    }

    static setDataWithOffset(data, measureOffset) {
        angular.forEach(data, function (item, key) {
            if (measureOffset) {
                item.originVal = Number(item.average);
                item.value = item.originVal + AppUtils.getOffset(item, measureOffset);
            } else {
                item.offset = 0;
            }
        })
    }

    static getOffset(item, measureOffset) {
        let offset = item.offset = AppUtils.getMeasureOffsetByType(item.type, measureOffset);
        if (AppUtils.isUserInInch()) {
            offset = AppUtils.inchToCm(offset);
        }
        return offset;
    }
}

export default  AppUtils;