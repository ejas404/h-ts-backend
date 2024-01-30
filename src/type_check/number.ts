export const isNumber = (value : unknown) : boolean =>{
    if(typeof(value) !== 'number'){
        return false
    }

    return true
}

export const isBoolean = (value : unknown):boolean =>{
    if(typeof(value) !== 'boolean'){
        return false
    }

    return true
}