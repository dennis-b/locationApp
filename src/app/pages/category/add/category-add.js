import template from './category-add.html';
import {RouteConfig} from 'annotations/route-decorator';
import {Inject, Service} from 'annotations/ng-decorator';
import BasePage from "../../../common/base/base-page";
import Category from "../../../entity/Category";

@RouteConfig('tab.category-add', {
    url: '/category-add',
    views: {
        'tab-category': {
            template: template
        }
    }
})

@Inject('localStorageService')
//
class CategoryAddState extends BasePage {
    constructor(localStorageService) {
        super(localStorageService);
        this.category = new Category();
    }

    onAdd() {
        var categories = this.localStorageService.get("categories");
        if (!categories) {
            categories = [];
        }
        this.category.id = categories.length;
        categories.push(this.category);
        this.localStorageService.set("categories", categories);
        this.goToCategory();
    }

}
