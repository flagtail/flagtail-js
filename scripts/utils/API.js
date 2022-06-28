class API {
    
    /*
        The `requester()` method is based on Fetch API.
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
    static requester(options) {

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

export default API;