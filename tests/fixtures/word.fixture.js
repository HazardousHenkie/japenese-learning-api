const mongoose = require('mongoose')

const faker = require('faker')
const Word = require('../../src/models/word.model')

const wordOne = {
    _id: mongoose.Types.ObjectId(),
    word: faker.random.word(),
    reading: faker.random.word(),
    meaning: faker.random.word(),
}

const wordTwo = {
    _id: mongoose.Types.ObjectId(),
    word: faker.random.word(),
    reading: faker.random.word(),
    meaning: faker.random.word(),
}

const insertWords = async (words) => {
    await Word.insertMany(words.map((word) => ({ ...word })))
}

module.exports = {
    wordOne,
    wordTwo,
    insertWords,
}
