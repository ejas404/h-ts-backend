export const isNumber = (value : unknown) : boolean =>{
    if(typeof(value) !== 'number'){
        return false
    }

    return true
}