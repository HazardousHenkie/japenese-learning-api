const httpStatus = require('http-status')
const { Word } = require('../models')
const ApiError = require('../utils/ApiError')

/**
 * Create a word
 * @param {Object} wordBody
 * @returns {Promise<Word>}
 */
const createWord = async (wordBody) => {
    const word = await Word.create(wordBody)
    return word
}

/**
 * Query for words
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryWords = async (filter, options) => {
    const words = await Word.find(filter, options)
    return words
}

/**
 * Get word by id
 * @param {ObjectId} id
 * @returns {Promise<Word>}
 */
const getWordById = async (id) => {
    return Word.findById(id)
}

/**
 * Update word by id
 * @param {ObjectId} wordId
 * @param {Object} updateBody
 * @returns {Promise<Word>}
 */
const updateWordById = async (wordId, updateBody) => {
    const word = await getWordById(wordId)
    if (!word) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Word not found')
    }

    Object.assign(word, updateBody)
    await word.save()
    return word
}

/**
 * Delete word by id
 * @param {ObjectId} wordId
 * @returns {Promise<Word>}
 */
const deleteWordById = async (wordId) => {
    const word = await getWordById(wordId)
    if (!word) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Word not found')
    }
    await word.remove()
    return word
}

module.exports = {
    createWord,
    queryWords,
    getWordById,
    updateWordById,
    deleteWordById,
}
