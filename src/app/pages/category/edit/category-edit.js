import template from './category-edit.html';
import {RouteConfig} from 'annotations/route-decorator';
import {Inject, Service} from 'annotations/ng-decorator';
import BasePage from "../../../common/base/base-page";

@RouteConfig('tab.category-edit', {
    url: '/category-edit:cid',
    views: {
        'tab-category': {
            template: template
        }
    }
})

@Inject('localStorageService', '$stateParams')
//
class CategoryEditState extends BasePage {
    constructor(localStorageService, $stateParams) {
        super(localStorageService, $stateParams);
        var categories = this.localStorageService.get("categories");
        this.category = categories[$stateParams.cid];
    }

    onUpdate() {
        var categories = this.localStorageService.get("categories");
        categories[this.$stateParams.cid] = this.category;
        this.localStorageService.set("categories", categories);
        this.goToCategory();
    }

}
