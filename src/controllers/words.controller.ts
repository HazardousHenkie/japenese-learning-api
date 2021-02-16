import { Request, Response } from 'express'
import httpStatus from 'http-status'
import wordService from 'base/services/word.service'
import ApiError from 'base/utils/ApiError'
import catchAsync from 'base/utils/catchAsync'
import pick from 'base/utils/pick'

const createWord = catchAsync(async (req: Request, res: Response) => {
    const word = await wordService.createWord(req.body)
    res.status(httpStatus.CREATED).send(word)
})

const getWords = catchAsync(async (req: Request, res: Response) => {
    const filter = pick(req.query, ['word'])
    const result = await wordService.queryWords(filter)
    res.send({ results: result })
})

const getWord = catchAsync(async (req: Request, res: Response) => {
    const word = await wordService.getWordById(req.params.wordId)
    if (!word) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Word not found')
    }
    res.send(word)
})

const updateWord = catchAsync(async (req: Request, res: Response) => {
    const word = await wordService.updateWordById(req.params.wordId, req.body)
    res.send(word)
})

const deleteWord = catchAsync(async (req: Request, res: Response) => {
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
