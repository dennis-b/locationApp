import template from './category.html';
import {RouteConfig} from 'annotations/route-decorator';
import {Inject, Service} from 'annotations/ng-decorator';
import BasePage from "../../../common/base/base-page";

@RouteConfig('tab.category', {
    url: '/category',
    views: {
        'tab-category': {
            template: template
        }
    }
})

@Inject('localStorageService')
//
class CategoryState extends BasePage {
    constructor(localStorageService) {
        super(localStorageService);
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

    onEdit(id) {
        this.goToEditCategory(id);
    }
}
