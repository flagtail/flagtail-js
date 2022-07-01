import API from "../utils/API.js"
import ElementHandler from "../utils/ElementHandler.js"

class Publisher {

    #id; // identifier, current work
    #data; // data collection to handle produced data and consumed data
    #reqReady;
    #filterReady;
    #isDone; // ISSUE POINT: Do We Need Block calling the `getData()` function???


    constructor(id) {
        this.#id = id;
        this.#data = new Map();
        this.#reqReady = [];
    }

    getId() {
        return this.#id;
    }

    setData(key, value) {
        if (!(typeof key === "string")) throw TypeError(`the key must be string`);
        this.#data.set(key, value);
        return this;
    }

    setDataFrom(pub) {
        if (!(pub instanceof Publisher)) throw TypeError(`the argument must be <Publisher>`);
        for (const data of pub.getData().entries()) {
            this.#data[data[0]] = data[1]
        }
        return this;
    }

    getData() {
        const obj = {}

        for (const entry of this.#data.entries()) {
            obj[entry[0]] = entry[1]
        }

        return obj;
    }

    api(dataIdKey, options) {
        if (!(dataIdKey && typeof dataIdKey === "string")) {
            throw new SyntaxError(`api-id[${dataIdKey}]: please input the string of data-id-key`);
        }

        if (dataIdKey.startsWith(".") || dataIdKey.startsWith("#")) {
            throw new SyntaxError(`api-id[${dataIdKey}]: Do not use "." or "#" at the beginning of a string`);
        }

        this.#reqReady.push({
            dataIdKey,
            options,
            resDataFunc: async function () {
                const res = await API.requester(options);
                return res.json();
            }
        });

        return this;
    }

    /* { selected, $ } 
        all of returned data from elem() must be <HTMLElement> or <DocumentFragment>
    */
    elem(...selectors) {
        ElementHandler.pull(...selectors).forEach(elemInfo => {
            if (!ElementHandler.shouldElementOrTemplate(elemInfo.$)) {
                throw new SyntaxError(`the $(element)[${elemInfo.selected}] must be instance of <HTMLElement> of <DocumentFragment>`);
            }
            this.#data.set(elemInfo.selected, elemInfo.$)
        });

        return this;
    }

    /* { target: "id-key", callback: function(data)-> data }[] */
    filter(filteringList) {

        if (!(filteringList instanceof Array)) {
            throw new SyntaxError(`filter args is not Array`)
        }

        this.#filterReady = filteringList;

        return this;
    }

    async #doFiltering(filterTargetItem){
        // check string type
        if (typeof filterTargetItem.target !== "string") {
            throw new SyntaxError(`target must be string type`);
        }

        // check whether target exists or not
        const filterTarget = this.#data.get(filterTargetItem.target)
        if (filterTarget === undefined) throw new ReferenceError(`there is no ${filterTarget} in Publisher's data`);

        // check the returned data from callback
        const callbackResult = filterTargetItem.callback(filterTarget);
        if (callbackResult === undefined) throw new ReferenceError(`no returned any data : ${callbackResult}`);

        // check element mapping
        if (ElementHandler.checkSelectorString(filterTargetItem.target)) {
            if (!(ElementHandler.shouldElementOrTemplate(callbackResult))) {
                throw new TypeError(`the result of ${filterTargetItem.target} must be elements of templates: (result) ${callbackResult}`);
            }
        }

        // put filtered data into data collection
        this.#data.set(filterTargetItem.target, callbackResult);
    }

    async done() {
        // do filtering 
        this.#filterReady.forEach(async (filterTargetItem) => {

            // common section
            if (!(typeof filterTargetItem.callback === "function" && filterTargetItem.callback.toString().startsWith("function"))) {
                throw new SyntaxError(`callback must be function type`);
            }

            if (filterTargetItem.target instanceof Array) {
                filterTargetItem.target.forEach(async pickedTarget=>await this.#doFiltering({
                    target:pickedTarget, callback: filterTargetItem.callback
                }))
            } else {
                await this.#doFiltering(filterTargetItem)
            }

        });

        // request to API server
        const reqResult = await Promise.all(this.#reqReady.map(body => body.resDataFunc()));

        for (let i = 0; i < this.#reqReady.length; i++) {
            this.#data.set(this.#reqReady[i].dataIdKey, reqResult[i])
        }

        return this;
    }

}

class Subscriber {
    // value, textContent, getAttribute, Event(on, off)


    constructor(...pubs) {

    }


}

export { Publisher, Subscriber };