import {Inject,Filter} from 'annotations/ng-decorator';


class DataTextFilter {
    @Filter({
        filterName: 'datatext'
    })
    static dataTextFilter() {
        return (string) => {
            if (!string) {
                return '';
            }
            var replace = string.replace(/_([a-z])/ig, function (all, letter) {
                return " " + letter.toUpperCase();
            });
            return replace.charAt(0).toUpperCase() + replace.substring(1);
        };
    }
}
