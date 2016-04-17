var cache = {};
var CacheManager = {

    get: function (id) {
        return cache[id];
    },

    set: function (id, obj) {
        cache[id] = obj;
    },

    remove: function (id) {
        cache[id] = null;
    }
};


export default  CacheManager;