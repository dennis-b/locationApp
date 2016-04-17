import {Inject, Service} from 'annotations/ng-decorator';

@Service({
    serviceName: 'AppInit'
})
@Inject('$q', '$cordovaSplashscreen', '$ionicPlatform', '$timeout')
class AuthService {
    constructor($q, $cordovaSplashscreen, $ionicPlatform, $timeout) {
        this.$q = $q;
        this.$cordovaSplashscreen = $cordovaSplashscreen;
        this.$ionicPlatform = $ionicPlatform;
        this.$timeout = $timeout;
    }

    splash() {
        var _this = this;
        var deferred = this.$q.defer();

        this.$ionicPlatform.ready(function () {
            _this.$timeout(function () {
                if (window.cordova && navigator && navigator.splashscreen) {
                    _this.$cordovaSplashscreen.hide();
                }
                deferred.resolve();
            }, 500);
        });

        return deferred.promise;
    }
}