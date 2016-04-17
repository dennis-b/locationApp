import {Inject,Service} from 'annotations/ng-decorator';

@Service({
    serviceName: 'cordovaScreenshot'
})
@Inject('$q')
class CordovaScreenshot {

    constructor($q) {
        this.$q = $q
    }

    capture(filename, extension, quality) {

        if (!navigator || !navigator.screenshot) {
            return this.$q.reject("screenshot not supported");
        }
        extension = extension || 'jpg';
        quality = quality || '100';
        let defer = this.$q.defer();
        navigator.screenshot.save(function (error, res) {
            if (error) {
                defer.reject(error);
            } else {
                defer.resolve(res);
            }
        }, extension, quality, filename);

        return defer.promise;
    }


    toURI() {
        if (!navigator || !navigator.screenshot) {
            return this.$q.reject("screenshot not supported");
        }

        let defer = this.$q.defer();
        navigator.screenshot.URI(function (error, res) {
            if (error) {
                defer.reject(error);
            } else {
                defer.resolve(res);
            }
        }, 50);

        return defer.promise;
    }
}



