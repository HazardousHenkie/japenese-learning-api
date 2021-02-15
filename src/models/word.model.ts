import mongoose from 'mongoose'
import { toJSON } from './plugins'

const wordSchema = mongoose.Schema(
    {
        word: {
            type: String,
            required: true,
            trim: true,
        },
        reading: {
            type: String,
            required: true,
            trim: true,
        },
        meaning: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
)

wordSchema.plugin(toJSON)

const Word = mongoose.model('Word', wordSchema)

export default Word
