import {Inject,Filter} from 'annotations/ng-decorator';

class MomentFilter {
    @Filter({
        filterName: 'moment'
    })
    static momentFilter() {
        return (value, format) => {
            return moment(value).format(format);
        };
    }
}
