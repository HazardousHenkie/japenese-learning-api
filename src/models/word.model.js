const mongoose = require('mongoose')
const { toJSON } = require('./plugins')

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

// add plugin that converts mongoose to json
wordSchema.plugin(toJSON)

/**
 * @typedef Word
 */
const Word = mongoose.model('Word', wordSchema)

module.exports = Word
