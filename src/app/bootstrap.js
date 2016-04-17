
import adapter from 'ng2adapter';
import angular from 'angular';


export default class IonicBoot {
    static bootstrap(mainModule) {
        if (!window || !window.document) {
            throw new Error('window and document objects required.');
        }

        function onDeviceReady() {
            // bootstrap angular app
            angular.element(window.document).ready(function () {
                angular.bootstrap(window.document, [mainModule.name], {strictDi: true});
            });

            // remove document deviceready listener
            window.document.removeEventListener('deviceready', onDeviceReady, false);
        }

        function onWindowLoad() {
            if (!(!window.cordova)) {
                // when on device add document deviceready listener
                window.document.addEventListener('deviceready', onDeviceReady, false);

            } else {
                // when on browser trigger onDeviceReady
                onDeviceReady();
            }

            // remove window load listener
            window.removeEventListener('load', onWindowLoad, false);
        }

        // add window load listener
        window.addEventListener('load', onWindowLoad, false);
    }
}