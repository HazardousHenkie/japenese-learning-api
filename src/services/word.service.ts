import httpStatus from 'http-status'
import Word from 'base/models/word.model'
import { FilterQuery } from 'mongoose'
import ApiError from 'base/utils/ApiError'

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

const updateWordById = async (wordId: string, updateBody: Body) => {
    const word = await getWordById(wordId)
    if (!word) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Word not found')
    }

    Object.assign(word, updateBody)
    await word.save()
    return word
}

const deleteWordById = async (wordId: string) => {
    const word = await getWordById(wordId)
    if (!word) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Word not found')
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
