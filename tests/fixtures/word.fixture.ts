import mongoose from 'mongoose'

import faker from 'faker'
import { MongooseWordsType, MongooseWordType } from '../../src/types/words'
import Word from '../../src/models/word.model'

export const wordOne: MongooseWordType = {
    _id: mongoose.Types.ObjectId(),
    word: faker.random.word(),
    reading: faker.random.word(),
    meaning: faker.random.word(),
}

export const wordTwo: MongooseWordType = {
    _id: mongoose.Types.ObjectId(),
    word: faker.random.word(),
    reading: faker.random.word(),
    meaning: faker.random.word(),
}

const insertWords = async (words: MongooseWordsType, userId: string) => {
    await Word.insertMany(words.map((word) => ({ ...word, userId })))
}

export default insertWords
