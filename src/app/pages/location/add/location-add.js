import template from './location-add.html';
import {RouteConfig} from 'annotations/route-decorator';
import {Inject, Service} from 'annotations/ng-decorator';
import BasePage from "../../../common/base/base-page";
import Location from "../../../entity/Location";

@RouteConfig('tab.location-add', {
    url: '/location-add',
    views: {
        'tab-location': {
            template: template
        }
    }
})

@Inject('localStorageService', 'modalService')
//
class LocationAddState extends BasePage {
    constructor(localStorageService, modalService) {
        super(localStorageService, modalService);
        this.location = new Location();
        this.categories = this.localStorageService.get("categories");
    }

    onShowCoord() {
        let _this = this;
        let params = {title: 'Set coordinates'};

        _this.modalService.show(params).then(function (obj) {
            if (obj.ok) {
                _this.location.coordinates.longitude = $('#lon').val();
                _this.location.coordinates.latitude = $('#lat').val();
                _this.location.address = $('#address').val();
            }
        });

    }

    onAdd() {
        var locations = this.localStorageService.get("locations");
        if (!locations) {
            locations = [];
        }
        this.location.id = locations.length;
        locations.push(this.location);
        this.localStorageService.set("locations", locations);
        this.goToLocation();
    }

}
