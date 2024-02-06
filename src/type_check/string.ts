export const isString = (str : unknown) : boolean =>{
    if(typeof(str) !== 'string' || !str.length){
        return false
    }

    return true
}