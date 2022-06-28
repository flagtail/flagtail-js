class Context {

    static set(key, value) {
        localStorage.setItem(key, value);
    }

    static get(key) {
        return localStorage.getItem(key);
    }

    static update(key, value) {
        if (this.isExist(key)) {
            this.set(key, value);
            return true;
        } else {
            return false;
        }
    }

    static remove(key) {
        if (this.isExist(key)) {
            localStorage.removeItem(key);
            return true;
        } else {
            return false;
        }
    }

    static isExist(key) {
        return this.get(key) !== null;
    }

    static isExistAndSame(key, value) {
        return this.isExist(key) && this.get(key) === value;
    }

    static clear() {
        localStorage.clear();
    }

}

export default Context;