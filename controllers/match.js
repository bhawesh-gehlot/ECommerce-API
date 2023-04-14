const matchElements = (arr, itm) => {
    for (const sub of arr) {
        if(sub.productID === itm){
            return true
        }
        else{
            continue;
        }
        
    }
    return false;
}

module.exports = {matchElements}