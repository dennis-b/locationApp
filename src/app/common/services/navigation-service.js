/**
 * Created by Dennis on 13/01/2016.
 */
import {Inject, Service} from 'annotations/ng-decorator';

@Service({
    serviceName: 'navigationService'
})
@Inject('$state', '$ionicLoading', '$ionicHistory', '$ionicViewSwitcher')
class NavigationService {
    constructor($state, $ionicLoading, $ionicHistory, $ionicViewSwitcher) {
        this.$state = $state;
        this.$ionicHistory = $ionicHistory;
        this.$ionicLoading = $ionicLoading;
        this.$ionicViewSwitcher = $ionicViewSwitcher;
    }

    goToState(state, params, reload) {
        // this.showLoader(state);
        // var reload = reload ? reload : false;
        this.$ionicViewSwitcher.nextDirection('forward');
        return this.$state.go(state, params);
    }

    goToAddCategory(params, reload) {
        return this.goToState("tab.category-add", params, true);
    }

    goToEditCategory(params, reload) {
        return this.goToState("tab.category-edit", params, true);
    }

    goToCategory(params, reload) {
        return this.goToState("tab.category", params, true);
    }

    goToAddLocation(params, reload) {
        return this.goToState("tab.location-add", params, true);
    }

    goToEditLocation(params, reload) {
        return this.goToState("tab.location-edit", params, true);
    }

    goToLocation(params, reload) {
        return this.goToState("tab.location", params, true);
    }

    goBack() {
        this.$ionicViewSwitcher.nextDirection('back');
        return this.$ionicHistory.goBack(-1);
    }

    showLoader(state) {
        var currentView = this.$ionicHistory.currentView();
        if (!currentView) {
            this.$ionicLoading.show({
                template: '<ion-spinner class="light"></ion-spinner>',
                hideOnStateChange: true,
                showDelay: 0
            })
        }
        else if (currentView && currentView.stateName != state) {
            this.$ionicLoading.show({
                template: '<ion-spinner class="light"></ion-spinner>',
                showDelay: 0,
                hideOnStateChange: true
            });
        }
    }

    hideLoader() {
        this.$ionicLoading.hide();
    }

}



