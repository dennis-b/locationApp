/**
 * Created by Dennis on 11/04/2016.
 */


export default class AppPolyfills {
    static addPolyfills() {
        AppPolyfills.objectValues();
        AppPolyfills.stringInclude();

    }

    static objectValues() {
        if (!Object.values) {
            Object.values = function (obj) {
                return Object.keys(obj).map(key => obj[key]);
            }
        }
    }

    static stringInclude() {
        if (!String.prototype.includes) {
            String.prototype.includes = function (search, start) {
                'use strict';
                if (typeof start !== 'number') {
                    start = 0;
                }

                if (start + search.length > this.length) {
                    return false;
                } else {
                    return this.indexOf(search, start) !== -1;
                }
            };
        }
    }
}
