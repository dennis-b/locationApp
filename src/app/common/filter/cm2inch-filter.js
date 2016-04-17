import {Inject,Filter} from 'annotations/ng-decorator';

class CmToInchFilter {
    @Filter({
        filterName: 'cm2inch'
    })
    @Inject('localStorageService', '$rootScope')
    static cm2inch(localStorageService, $rootScope) {
        return (cms) => {
            var user = localStorageService.get('user');
            if (user && user.heightUnits !== 'cm') {
                if (!cms || cms == 0) {
                    return 0;
                }
                var number = parseFloat(cms) / 2.54;
                return Math.round(number * 10) / 10;
            }
            return cms;
        };
    }

    @Filter({
        filterName: 'cm2inchText'
    })
    @Inject('localStorageService')
    static cm2inchText(localStorageService) {
        return (val) => {
            var user = localStorageService.get('user');
            if (user && user.heightUnits !== 'cm') {
                return "in";
            }
            return "cm";
        };
    }
}
