import {Inject, Filter} from 'annotations/ng-decorator';
class CategoryFilter {

    @Filter({
        filterName: 'categoryf'
    })
    static categoryf() {
        return (items, query) => {

            if (!query || query == "") {
                return items;
            }

            var filtered = [];
            angular.forEach(items, function (item) {

                if (item.category.name.toLowerCase().includes(query.name.toLowerCase())) {
                    filtered.push(item);
                }
            });
            return filtered;
        };
    }
}
