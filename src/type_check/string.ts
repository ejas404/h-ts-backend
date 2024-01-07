export const isString = (value : unknown) : boolean =>{
    if(typeof(value) !== 'string'){
        return false
    }

    return true
}