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
    const ft = new flagtail();

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

    const prod_A = ft.produce("A")
        .api("test-json", { origin: "https://jsonplaceholder.typicode.com/todos" })
        .elem(...select$$)
        .filter(filters)

    const prod_B = await ft.produce("B")
        .api("test-json-1", { origin: "https://jsonplaceholder.typicode.com/todos/1" })
        .api("test-json-2", { origin: "https://jsonplaceholder.typicode.com/todos/2" })
        .api("test-json-3", { origin: "https://jsonplaceholder.typicode.com/todos/3" })
        .elem(...select$$)
        .filter(filters)

    await prod_A.done();
    await prod_B.done();

    console.log(prod_A.getData())
        
    ft.consume(prod_A, prod_B)
        .from("test")

    
   /*  
   const wrapper = {
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
    console.log(result); 
    */

})()

