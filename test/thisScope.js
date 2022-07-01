async function wait(n) {
    const waitResult = await new Promise((resolve) => {
        setTimeout(() => {
            console.log("wait...")
            resolve(n);
        }, 2000)
    });

    return waitResult
}

async function a1() {
    return await wait(11);
}

async function a2() {
    return await wait(12);
}
async function a3() {
    return await wait(13);
}
async function a4() {
    return await wait(14);
}
async function a5() {
    return await wait(15);
}

async function main() {
    const list = await Promise.all([a1(), a2(), a3(), a4(), a5()])

    console.log(list);
}

main();