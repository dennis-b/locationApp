export default class StringBuilder {
    constructor(value) {
        this.strings = [];
        this.append(value);
    }

    append(value) {
        if (value) {
            this.strings.push(value);
        }
        return this;
    }

    clear() {
        this.strings.length = 1;
    }

    toString() {
        return this.strings.join("");
    }
}
