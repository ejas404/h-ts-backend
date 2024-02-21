export const isString = (str) => {
    if (typeof (str) !== 'string' || !str.length) {
        return false;
    }
    return true;
};
