const mongoose = require('mongoose')

const faker = require('faker')
const Word = require('../../src/models/word.model')

const wordOne = {
    _id: mongoose.Types.ObjectId(),
    word: faker.word.findWord(),
    reading: faker.word.findWord(),
    meaning: faker.word.findWord(),
}

const wordTwo = {
    _id: mongoose.Types.ObjectId(),
    word: faker.word.findWord(),
    reading: faker.word.findWord(),
    meaning: faker.word.findWord(),
}

const insertWords = async (words) => {
    await Word.insertMany(words.map((word) => ({ ...word })))
}

module.exports = {
    wordOne,
    wordTwo,
    insertWords,
}
