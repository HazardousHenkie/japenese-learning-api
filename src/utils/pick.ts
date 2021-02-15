const pick = (object, keys: string[]) => {
    return keys.reduce((obj, key) => {
        if (object && Object.prototype.hasOwnProperty.call(object, key)) {
            obj[key] = object[key]
        }
        return obj
    }, {})
}

export default pick
