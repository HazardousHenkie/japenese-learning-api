import { Response } from 'express'
import httpStatus from 'http-status'
import wordService from '../services/word.service'
import ApiError from '../utils/ApiError'
import catchAsync from '../utils/catchAsync'
import pick from '../utils/pick'
import { UserRequest } from '../types/words'

const createWord = catchAsync(async (req: UserRequest, res: Response) => {
    const newWord = { userId: req.user?.sub, ...req.body }
    const word = await wordService.createWord(newWord)
    res.status(httpStatus.CREATED).send(word)
})

const getWords = catchAsync(async (req: UserRequest, res: Response) => {
    const filter = pick(req.query, ['word'])
    const words = await wordService.queryWords({
        ...filter,
        userId: req.user?.sub,
    })

    res.send({
        results: words,
    })
})

const getWord = catchAsync(async (req: UserRequest, res: Response) => {
    const word = await wordService.getWordById(req.params.wordId)
    if (!word) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Word not found')
    } else if (req.user?.sub !== word.userId) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized')
    }

    res.send(word)
})

const updateWord = catchAsync(async (req: UserRequest, res: Response) => {
    const word = await wordService.updateWordById(
        req.params.wordId,
        req.body,
        req.user?.sub
    )

    if (req.user?.sub !== word.userId) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized')
    }

    res.send(word)
})

const deleteWord = catchAsync(async (req: UserRequest, res: Response) => {
    await wordService.deleteWordById(req.params.wordId, req.user?.sub)
    res.status(httpStatus.NO_CONTENT).send()
})

export default {
    createWord,
    getWords,
    getWord,
    updateWord,
    deleteWord,
}
