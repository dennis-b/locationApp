import template from './location-edit.html';
import {RouteConfig} from 'annotations/route-decorator';
import {Inject, Service} from 'annotations/ng-decorator';
import BasePage from "../../../common/base/base-page";

@RouteConfig('tab.location-edit', {
    url: '/location-edit:lid',
    views: {
        'tab-location': {
            template: template
        }
    }
})

@Inject('localStorageService', '$stateParams')
//
class LocationEditState extends BasePage {
    constructor(localStorageService, $stateParams) {
        super(localStorageService, $stateParams);
        this.location = this.localStorageService.get("locations")[$stateParams.lid];
        this.categories = this.localStorageService.get("categories");
    }

    onUpdate() {
        var locations = this.localStorageService.get("locations");
        locations[this.$stateParams.lid] = this.location;
        this.localStorageService.set("locations", locations);
        this.goToLocation();
    }

}
