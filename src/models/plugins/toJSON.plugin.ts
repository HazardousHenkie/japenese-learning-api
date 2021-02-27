import { AnyAaaaRecord } from 'dns'
import { Document, SchemaOptions, ToObjectOptions } from 'mongoose'

const deleteAtPath = (
    obj: Record<string, any>,
    path: string[],
    index: number
) => {
    if (index === path.length - 1) {
        delete obj[path[index]]
        return
    }
    deleteAtPath(obj[path[index]], path, index + 1)
}

// using any here since we have a custom plugin and mongoose doesn't have a proper type
const toJSON = (schema: any) => {
    let transform: ToObjectOptions['transform']
    if (schema.options.toJSON && schema.options.toJSON.transform) {
        transform = schema.options.toJSON.transform
    }

    schema.options.toJSON = Object.assign(schema.options.toJSON || {}, {
        transform(doc: Document, ret: any, options: SchemaOptions) {
            Object.keys(schema.paths).forEach((path) => {
                if (
                    schema.paths[path].options &&
                    schema.paths[path].options.private
                ) {
                    deleteAtPath(ret, path.split('.'), 0)
                }
            })

            ret.id = ret._id.toString()
            delete ret.userId
            delete ret._id
            delete ret.__v
            delete ret.createdAt
            delete ret.updatedAt
            if (transform) {
                return transform(doc, ret, options)
            }
        },
    })
}

export default toJSON
