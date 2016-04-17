import template from './category.html';
import {RouteConfig} from 'annotations/route-decorator';
import {Inject, Service} from 'annotations/ng-decorator';
import BasePage from "../../../common/base/base-page";
import AppUtils from "../../../core/utils/app-utils";

@RouteConfig('tab.category', {
    url: '/category',
    views: {
        'tab-category': {
            template: template
        }
    }
})

@Inject('localStorageService', '$cordovaFile')
//
class CategoryState extends BasePage {
    constructor(localStorageService, $cordovaFile) {
        super(localStorageService, $cordovaFile);
        this.showDelete = false;
        this.listCanSwipe = true;
        this.categories = localStorageService.get('categories');
    }

    onDelete($index) {
        this.categories.splice($index, 1);
        this.localStorageService.set('categories', this.categories);
    }

    onAdd() {
        this.goToAddCategory();

    }

    onShare() {
        AppUtils.onShareCategories();
    }

    onEdit(id) {
        this.goToEditCategory(id);
    }
}
