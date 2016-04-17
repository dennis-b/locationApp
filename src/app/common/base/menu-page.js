/**
 * Created by Dennis on 17/03/2016.
 */
import {Config, Inject, Run} from 'annotations/ng-decorator';
import menuTemplate from './menu.html';
import Utils from '../../core/utils/app-utils';
import BasePage from './base-page';

class MenuPage extends BasePage {
    constructor() {
        super(arguments);
        this.subMenu = {personal: false, howto: false}

        this.$ionicPopover = Utils.getService('$ionicPopover');
        this.initPopoverMenu();
    }

    initPopoverMenu() {
        this.popover = this.$ionicPopover.fromTemplate(menuTemplate, {
            scope: this.$scope,
            animation: 'am-slide-left'
        });
    }

    showMenu($event) {
        this.popover.show($event);

    }

    onSubMenuClick(val) {
        let _this = this
        angular.forEach(this.subMenu, function (value, key) {
            if (key === val) {
                _this.subMenu[key] = !_this.subMenu[key];
            } else {
                _this.subMenu[key] = false;
            }
        });

    }

    hideMenu() {
        if (this.popover) {
            this.popover.hide();
        }
    }

    fromSignIn() {
        return false;
    }


}

export default MenuPage

