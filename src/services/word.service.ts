import httpStatus from 'http-status'
import Word from '../models/word.model'
import { FilterQuery } from 'mongoose'
import ApiError from '../utils/ApiError'

const createWord = async (wordBody: Body) => {
    const word = await Word.create(wordBody)
    return word
}

const queryWords = async (filter: FilterQuery<string>) => {
    const words = await Word.find(filter)

    return words
}

const getWordById = async (id: string) => {
    return Word.findById(id)
}

const updateWordById = async (
    wordId: string,
    updateBody: Body,
    userId: string | undefined
) => {
    const word = await getWordById(wordId)
    if (!word) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Word not found')
    } else if (userId !== word.userId) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized')
    }

    Object.assign(word, updateBody)
    await word.save()
    return word
}

const deleteWordById = async (wordId: string, userId: string | undefined) => {
    const word = await getWordById(wordId)
    if (!word) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Word not found')
    } else if (userId !== word.userId) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized')
    }
    await word.remove()
    return word
}

export default {
    createWord,
    queryWords,
    getWordById,
    updateWordById,
    deleteWordById,
}
