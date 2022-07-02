import flagtail from "../../index.js";

const select$$ = [
    "#id-input", 
    "#send-btn", 
    "#result", 
    ".my-class", 
    "#clone-part", 
    "#my-template",
    "#my-template-second", 
    "#my-template-third"
];

(async () => {
    const ff = new flagtail();

    const filters = [
        {
            target: ["#my-template", "#my-template-second", "#my-template-third"], callback: function (data) {
                console.log(data.children[0].textContent)
                return data.children[0]
            }
        },
        {
            target: "#id-input", callback: function(data) {
                return data
            }
        }
    ]

    const test = await ff.produce("test")
        .api("test-json", { origin: "https://jsonplaceholder.typicode.com/todos" })
        .api("test-json-1", { origin: "https://jsonplaceholder.typicode.com/todos/1" })
        .api("test-json-2", { origin: "https://jsonplaceholder.typicode.com/todos/2" })
        .api("test-json-3", { origin: "https://jsonplaceholder.typicode.com/todos/3" })
        .elem(...select$$)
        .filter(filters)
        .done()
    
    function AAA(){
        this.data = function(){
            console.log("hello world");
        }
    }

    
    



   /*  const wrapper = {
        val(){
            return this.value;
        },
        text(){
            return this.textContext;
        },
        attr(attrName){
            return this.getAttribute(attrName);
        }
    }
    
    const $idInput = document.getElementById("id-input")
    
    const result = wrapper.val.call($idInput)
    console.log(result); */

})()

