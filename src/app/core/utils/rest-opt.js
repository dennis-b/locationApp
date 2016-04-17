import AppUtils from './app-utils';

export default class RestBuilder {
    constructor() {
        this.localCall = false;
        this.cacheable = false;
        this.args = [];
        this.callbacks = {};
    }

    setCaller(caller) {
        this.caller = caller;
        return this;
    }

    setOperation(operation) {
        this.operation = operation;
        return this;
    }

    setArgs(args) {
        this.args = args;
        return this;
    }

    setCallbacks(callbacks) {
        this.callbacks = callbacks;
        return this;
    }

    setCacheable(cacheable) {
        this.cacheable = cacheable;
        return this;
    }

    setLocalCall(localCall) {
        this.localCall = localCall;
        return this;
    }

    sendRest() {
        return AppUtils.sendParseRequest(this.caller,
            this.operation,
            this.args,
            this.callbacks,
            this.cacheable,
            this.localCall);

    }
}

