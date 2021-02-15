import httpStatus from 'http-status'
import wordService from 'src/services/word.service'
import ApiError from 'src/utils/ApiError'
import catchAsync from 'src/utils/catchAsync'
import pick from 'src/utils/pick'

const createWord = catchAsync(async (req, res) => {
    const word = await wordService.createWord(req.body)
    res.status(httpStatus.CREATED).send(word)
})

const getWords = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['word'])
    const result = await wordService.queryWords(filter)
    res.send({ results: result })
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

export default {
    createWord,
    getWords,
    getWord,
    updateWord,
    deleteWord,
}
