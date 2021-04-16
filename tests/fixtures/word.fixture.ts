import mongoose from 'mongoose'

import faker from 'faker'
import Word from 'base/models/word.model'
import { MongooseWordType, MongooseWordsType } from 'base/types/words'

export const wordOne: MongooseWordType = {
    userId: faker.random.word(),
    _id: mongoose.Types.ObjectId(),
    word: faker.random.word(),
    reading: faker.random.word(),
    meaning: faker.random.word(),
}

export const wordTwo: MongooseWordType = {
    _id: mongoose.Types.ObjectId(),
    userId: faker.random.word(),
    word: faker.random.word(),
    reading: faker.random.word(),
    meaning: faker.random.word(),
}

const insertWords = async (words: MongooseWordsType) => {
    await Word.insertMany(words.map((word) => ({ ...word })))
}

export default insertWords
