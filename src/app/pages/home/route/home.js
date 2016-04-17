import template from './home.html';
import {RouteConfig} from 'annotations/route-decorator';
import {Inject, Service} from 'annotations/ng-decorator';
import BasePage from "../../../common/base/base-page";


@RouteConfig('tab', {
    url: '/tab',
    template: template
})

@Inject()
//
class HomeState extends BasePage {
    constructor() {
        super();
    }
}
