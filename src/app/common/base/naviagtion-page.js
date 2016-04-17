import {Config, Inject, Run} from 'annotations/ng-decorator';
import Utils from '../../core/utils/app-utils';

export default  class NavigationPage {
    constructor() {
        this.navigationService = Utils.getService('navigationService');
    }

    goToAddCategory() {
        this.navigationService.goToAddCategory();
    }

    goToCategory() {
        this.navigationService.goToCategory();
    }

    goToEditCategory(id) {
        this.navigationService.goToEditCategory({cid: id});
    }

    goToAddLocation() {
        this.navigationService.goToAddLocation();
    }

    goToLocation() {
        this.navigationService.goToLocation();
    }

    goToEditLocation(id) {
        this.navigationService.goToEditLocation({lid: id});
    }


    goBack() {
        this.navigationService.goBack();
    }

}
