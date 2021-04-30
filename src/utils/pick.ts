// different types of objects are used so use any here
const pick = (object: any, keys: string[]) => {
    return keys.reduce((obj: Record<string, string>, key) => {
        if (object && Object.prototype.hasOwnProperty.call(object, key)) {
            obj[key] = object[key]
        }
        return obj
    }, {})
}

export default pick
