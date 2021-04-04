import mongoose from 'mongoose'

export type MongooseWordType = {
    _id: mongoose.Types.ObjectId
    word: string
    reading: string
    meaning: string
}

export type WordType = {
    word: string
    reading: string
    meaning: string
}

export type MongooseWordsType = MongooseWordType[]

export type WordsType = WordType[]
