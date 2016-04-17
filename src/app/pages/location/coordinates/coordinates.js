import template from './location.html';
import {RouteConfig} from 'annotations/route-decorator';
import {Inject, Service} from 'annotations/ng-decorator';
import BasePage from "../../../common/base/base-page";


@RouteConfig('tab.location', {
    url: '/location',
    views: {
        'tab-location': {
            template: template
        }
    }
})

@Inject('localStorageService')
//
class LocationState extends BasePage {
    constructor(localStorageService) {
        super(localStorageService);
        super(localStorageService);
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
        this.goToEditLocation(id);
    }
}
