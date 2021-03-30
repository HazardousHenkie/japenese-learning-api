import mongoose from 'mongoose'

import faker from 'faker'
import Word from '../../src/models/word.model'

export const wordOne = {
    _id: mongoose.Types.ObjectId(),
    word: faker.random.word(),
    reading: faker.random.word(),
    meaning: faker.random.word(),
}

export const wordTwo = {
    _id: mongoose.Types.ObjectId(),
    word: faker.random.word(),
    reading: faker.random.word(),
    meaning: faker.random.word(),
}

const insertWords = async (words) => {
    await Word.insertMany(words.map((word) => ({ ...word })))
}

export default insertWords
