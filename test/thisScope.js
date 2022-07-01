const arr = [1, 2, 3, 4, 5]

function cb(element, index, array){
    console.log(`${element}, ${index}, ${array}`)
    array[index]= element * index;
}

arr.forEach(cb)

console.log(arr)