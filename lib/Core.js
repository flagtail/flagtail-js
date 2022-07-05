import { Publisher, Subscriber } from "./module/PubSub.js";
import * as handler from "./utils/Handlers.js"

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

    static #instance; // Singleton Instance
    static handler = handler;
    

    constructor() {
        if (Core.#instance) return Core.#instance;
        Core.#instance = this;
    }

    produce(id) {
        if (!(typeof id === 'string')) throw new TypeError("the id must be string type");
        return new Publisher(id);
    }

    consume(...pubs) {
        pubs.forEach(pub=>{
            if (!(pub instanceof Publisher)) throw new TypeError("the arg must be <Publisher> instance");
        })
        return new Subscriber(...pubs);
    }
}

export { Core };