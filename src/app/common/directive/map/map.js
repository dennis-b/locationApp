import {Directive, View} from 'annotations/directive-decorator';
import app from '../../../main-module';

//todo fix this
var directiveFactory = function ($cordovaGeolocation) {
    return {
        restrict: 'EA',
        scope: {
            conf: "="
        },
        template: require('./map.html'),
        link: function (scope, element, attr) {
            var options = {timeout: 10000, enableHighAccuracy: true};

            if (scope.conf) {
                initMap(element, scope.conf.location.coordinates.latitude, scope.conf.location.coordinates.longitude);
            } else {
                $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
                    initMap(element, position.coords.latitude, position.coords.longitude);
                });
            }

            function initMap(element, latitude, longitude) {
                element.find('#map').locationpicker({
                    location: {latitude: latitude, longitude: longitude},
                    radius: 100,
                    enableAutocomplete: true,
                    inputBinding: {
                        latitudeInput: element.find('#lat'),
                        longitudeInput: element.find('#lon'),
                        locationNameInput: element.find('#address')
                    },
                    onchanged: function (currentLocation, radius, isMarkerDropped) {
                        console.log(currentLocation)
                    }
                });
            }


            // element.locationpicker('autosize');
        }
    };
};
directiveFactory.$inject = ['$cordovaGeolocation'];
app.directive('lmap', directiveFactory);

