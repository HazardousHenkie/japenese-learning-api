import { WordDoc } from '../types/words'
import mongoose from 'mongoose'
import toJSON from './plugins/toJSON.plugin'

const wordSchema = new mongoose.Schema(
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
        userId: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

wordSchema.plugin(toJSON)

const Word = mongoose.model<WordDoc>('Word', wordSchema)

export default Word
