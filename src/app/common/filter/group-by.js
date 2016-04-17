import {Inject, Filter} from 'annotations/ng-decorator';
class GroupBy {

    @Filter({
        filterName: 'groupBy'
    })
    static groupBy() {
        return function (data, key) {
            if (!(data && key)) return;
            var result;
            if (!this.$id) {
                result = {};
            } else {
                var scopeId = this.$id;
                if (!results[scopeId]) {
                    results[scopeId] = {};
                    this.$on("$destroy", function () {
                        delete results[scopeId];
                    });
                }
                result = results[scopeId];
            }

            for (var groupKey in result)
                result[groupKey].splice(0, result[groupKey].length);

            for (var i = 0; i < data.length; i++) {
                if (!result[data[i][key]])
                    result[data[i][key]] = [];
                result[data[i][key]].push(data[i]);
            }

            var keys = Object.keys(result);
            for (var k = 0; k < keys.length; k++) {
                if (result[keys[k]].length === 0)
                    delete result[keys[k]];
            }
            return result;
        };
    }
}
