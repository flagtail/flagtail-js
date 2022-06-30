class ElementHandler {

    static ifTemplateThenElement(elem){
        // if(elem.tagName !== "TEMPLATE") return elem;
        // else return elem.content.cloneNode(true)
        if(elem.tagName !== "TEMPLATE") {
            return elem;
        }else {
            return elem.content.cloneNode(true)
        }
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

export default ElementHandler;