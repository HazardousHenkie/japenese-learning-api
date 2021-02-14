const httpStatus = require('http-status')
const pick = require('../utils/pick')
const ApiError = require('../utils/ApiError')
const catchAsync = require('../utils/catchAsync')
const { wordService } = require('../services')

const createWord = catchAsync(async (req, res) => {
    const word = await wordService.createWord(req.body)
    res.status(httpStatus.CREATED).send(word)
})

const getWords = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['word'])
    const options = pick(req.query, ['sortBy', 'limit', 'page'])
    const result = await wordService.queryWords(filter, options)
    res.send(result)
})

const getWord = catchAsync(async (req, res) => {
    const word = await wordService.getWordById(req.params.wordId)
    if (!word) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Word not found')
    }
    res.send(word)
})

const updateWord = catchAsync(async (req, res) => {
    const word = await wordService.updateWordById(req.params.wordId, req.body)
    res.send(word)
})

const deleteWord = catchAsync(async (req, res) => {
    await wordService.deleteWordById(req.params.wordId)
    res.status(httpStatus.NO_CONTENT).send()
})

module.exports = {
    createWord,
    getWords,
    getWord,
    updateWord,
    deleteWord,
}
