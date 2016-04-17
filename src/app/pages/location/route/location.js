import template from './location.html';
import {RouteConfig} from 'annotations/route-decorator';
import {Inject, Service} from 'annotations/ng-decorator';
import BasePage from "../../../common/base/base-page";
import CacheManager from "../../../core/utils/CacheManager";


@RouteConfig('tab.location', {
    url: '/location',
    views: {
        'tab-location': {
            template: template
        }
    }
})

@Inject('localStorageService', '$cordovaVibration', '$ionicPopup', 'modalService')
//
class LocationState extends BasePage {
    constructor(localStorageService, $cordovaVibration, $ionicPopup, modalService) {
        super(localStorageService, $cordovaVibration, $ionicPopup, modalService);
        this.showDelete = false;
        this.listCanSwipe = true;
        this.categories = localStorageService.get('categories');
        this.locations = localStorageService.get('locations');
    }

    onDelete($index) {
        this.locations.splice($index, 1);
        this.localStorageService.set('locations', this.locations);
    }

    onAdd() {
        this.goToAddLocation();
    }

    onEdit(id) {
        if (navigator && navigator.notification && navigator.notification.vibrate) {
            this.$cordovaVibration.vibrate(100);
        }

        let _this = this;
        var confirmPopup = this.$ionicPopup.confirm({
            title: 'Display On Map',
            template: 'Are you to see this location on map'
        });

        confirmPopup.then(function (res) {
            if (res) {
                _this.onShowCoord(id);
            } else {
                _this.goToEditLocation(id);
            }
        });
    }

    onShowCoord(id) {
        let _this = this;
        var locations = this.localStorageService.get("locations");
        var location = locations[id];
        let params = {
            title: 'Set coordinates',
            bind: {location: location}
        };

        _this.modalService.show(params).then(function (obj) {
            if (obj.ok) {
                location.coordinates.longitude = $('#lon').val();
                location.coordinates.latitude = $('#lat').val();
                location.address = $('#address').val();
                locations[id] = location;
                _this.locations = locations;
                _this.localStorageService.set("locations", _this.locations);
            }
        });
    }

    onSort() {
        if (this.isSort) {
            CacheManager.set('locations', angular.copy(this.locations));
            this.locations = this.locations.sort(function (a, b) {
                if (a.name < b.name) return -1;
                if (a.name > b.name) return 1;
                return 0;
            })
        } else {
            this.locations = CacheManager.get('locations');
        }
    }

    onGroup() {
        if (this.isGroup) {
            CacheManager.set('locations', angular.copy(this.locations));
            this.locations = this.locations.sort(function (a, b) {
                if (a.category.name < b.category.name) return -1;
                if (a.category.name > b.category.name) return 1;
                return 0;
            });
        } else {
            this.categoryName = "";
            this.locations = CacheManager.get('locations');
        }
    }

    showGroup(item) {

        if (this.isGroup && item.category.name != this.categoryName) {
            this.categoryName = item.category.name;
            return true;
        }
    }

}
