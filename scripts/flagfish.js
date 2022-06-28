/*  
    ---index.js---
    import {Rockfish} from "./rockfish.js"
    const rf = new Rockfish()
    rf.produce("price update")
      .elem(Rockfish.import("./elem/price-input-section"))
      .api({method: "GET", route: "/api/v2/price"})
      .done()
      .consume("price update")
      .elem()
    
    rf.consume(data).
    
    ---elem---
    export default [
        {
            select: "T#myId",
            want: "HTML" || "VALUE" || "TEXT"
            // template: true
            ($:) OR ($$:)
        },
        {
            select: ".member-list",
            want: "HTML" || "VALUE" || "TEXT"
        }
    ]
*/

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

class API {
    /*
        The `req()` method is based on Fetch API.
        Parameters:
            options {
                method: [String] HTTP Methods (Default: "GET") 
                    Ex) "GET", "POST", "PUT", "DELETE"
                route: [String] Route to Request (Default: "/")
                    Ex) "/api/v1/example"
                body: (Optional) [Object] Body To Send (Default: undefined)
                type: (Optional) [String] Body Form (Default: "application/json")
                    Ex) "application/json", "application/x-www-form-urlencoded", "multipart/form-data", "text/plain"
                origin: (Optional) [String] Domain (Default is same origin)
                    Ex) "https://example.com"
                mode: (Optional) [String] Allow Access-Control-Allow-Origin Header (Default: "cors")
                    Ex) "no-cors", "cors", "same-origin"
            }
        Returns: Promise<Fetch>
    */
    static req(options) {

        const host = options?.origin ?? '';
        const route = options?.route ?? '/';

        return fetch(host + route, {

            method: options?.method ?? 'GET',
            mode: options?.mode ?? 'cors',
            headers: {
                'Content-Type': options?.type ?? "application/json"
            },
            body: options?.body ? null : JSON.stringify(options.body)

        })

    }

    /* Deprecated - (reason) not support cors*/
    // function req(options) {
    //     return new Promise((resolve) => {
    //         const xhr = new XMLHttpRequest();
    //         xhr.open(options?.method ?? 'GET', options?.route ?? '/');
    //         xhr.onreadystatechange = async function () {
    //             if (xhr.readyState === xhr.DONE) {
    //                 if (xhr.status === 200) {
    //                     resolve(xhr.responseText);
    //                 }
    //             }
    //         }
    //         const sendBody = options?.body;
    //         if (sendBody) {
    //             xhr.setRequestHeader("Content-Type", options?.type ?? "application/json");
    //         }
    //         xhr.send(sendBody === undefined ? null : JSON.stringify(sendBody));
    //     })
    // }
}

class ElementHandler {

    static ifTemplateThenElement(elem){
        if(elem.tagName !== "TEMPLATE") return elem;
        else return elem.content.cloneNode(true)
    }

    /* All Templates will be cloned as elements */
    static pull(...selectors) {
        const list = []
        for (const selector of selectors) {
            if(typeof selector === 'object'){ // Custom Element
                if(!(selector["selected"] && selector["$"])) {
                    throw new SyntaxError(`custom elements must be set "selected" and "$"`); 
                }
                selector["$"] = ifTemplateThenElement(selector["$"])
                list.push(selector);
            }else if (selector.startsWith(".")) { // get elements by class name
                list.push({
                    selected: selector,
                    $: [...document.getElementsByClassName(selector.substr(1))].map(ElementHandler.ifTemplateThenElement)
                })
            } else if (selector.startsWith("#")) { // get an element by id
                list.push({
                    selected: selector,
                    $: ElementHandler.ifTemplateThenElement(document.getElementById(selector.substr(1)))
                })
            } else {
                throw new SyntaxError(`pull elements: please start with "."(by class) or "#"(by id)`);
            }
        }
        return list;
    }
}

class Publisher {

    #id; // identifier, current work
    #data; // data collection to handle produced data and consumed data

    constructor(id) {
        this.#id = id;
        this.#data = new Map();
    }

    getId() {
        return this.#id;
    }

    setData(key, value){
        if(!(typeof key === "string")) throw TypeError(`the key must be string`);
        this.#data.set(key, value);
    }

    getData() {
        const obj = {}

        for (const entry of this.#data.entries()) {
            obj[entry[0]] = entry[1]
        }

        return obj;
    }

    api(dataIdKey) {
        if(!(dataIdKey && typeof dataIdKey === "string")) {
            throw new SyntaxError(`api-id[${dataIdKey}]: please input the string of data-id-key`);
        }

        if(dataIdKey.startsWith(".") || dataIdKey.startsWith("#")){
            throw new SyntaxError(`api-id[${dataIdKey}]: Do not use "." or "#" at the beginning of a string`);
        }
        return async function (options) {
            const res = await API.req(options);
            this.#data.set(dataIdKey, await res.json());
            return this;
        }.bind(this);
    }

    /* { selected, $ } */
    elem(...selectors) {
        ElementHandler.pull(...selectors).forEach(elemInfo => {
            if(elemInfo.$ instanceof Array){
                elemInfo.$.forEach(elem=>{
                    if(!(elem instanceof HTMLElement)){
                        throw new SyntaxError(`the $(element)[${elemInfo.selected}] must be instance of <HTMLElement>`);        
                    }
                })
            } else if(!(elemInfo.$ instanceof HTMLElement)) {
                throw new SyntaxError(`the $(element)[${elemInfo.selected}] must be instance of <HTMLElement>`);
            }
            this.#data.set(elemInfo.selected, elemInfo.$)
        });
        return this;
    }

    /* { target: "id-key", callback: function(data)-> data }[] */
    filter(filteringList){
        if(!(filteringList instanceof Array)) {
            throw new SyntaxError(`filter args is not Array`)
        }
        filteringList.forEach((filterTargetItem)=>{
            if(typeof filterTargetItem.target !== "string"){
                throw new SyntaxError(`target must be string type`)
            }
            if(!(typeof filterTargetItem.callback === "function" && filterTargetItem.callback.toString().startsWith("function"))){
                throw new SyntaxError(`callback must be function type`)
            }
            const dataValue = this.#data.get(filterTargetItem.target)
            if(dataValue === undefined) throw new ReferenceError(`there is no ${dataValue} in Publisher's data`);
            const callbackResult = filterTargetItem.callback(dataValue);
            if(callbackResult === undefined) throw new ReferenceError(`no returned any data : ${callbackResult}`);
            this.#data.set(filterTargetItem.target, callbackResult);
        })
        return this;
    }

}

class Subscriber {
    // value, textContent, getAttribute, Event(on, off)
}

/*  
    @author rhie-coder
    @desc 
      Singleton Class
      Publisher - Subscriber
    
    Issue:
     - Sync Problem
     - Memory Handling
*/
class Core {

    static #instance; // singleton instance
    static ctx = Context; // class<Context>

    constructor() {
        if (Core.#instance) return Core.#instance;
        Core.#instance = this;
    }

    produce(id) {
        if (!(typeof id === 'string')) throw new TypeError("the id must be string type");
        return new Publisher(id);
    }

    consume(id) {

    }



}

export { Core as flagfish };