import flagfish from "../../index.js";

(async () => {
    const ff = new flagfish();

    const filters = [
        {
            target: "#my-template", callback: function (data) {
                console.log("filter ON");
                console.log(data.children[0]);
                return data.children[0]
            }
        }
    ]


    const test = await ff.produce("test")
        .api("test-json", { origin: "https://jsonplaceholder.typicode.com/todos" })
        .api("test-json2", { origin: "https://jsonplaceholder.typicode.com/todos/1" })
        .elem("#id-input", "#send-btn", "#result", ".my-class", "#clone-part", "#my-template")
        .filter(filters)
        .done()

    console.log(test)
    console.log(test.getData())
})()