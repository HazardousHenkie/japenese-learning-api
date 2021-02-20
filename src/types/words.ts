import mongoose, { Document } from 'mongoose'
import { Request } from 'express'

export type MongooseWordType = {
    _id: mongoose.Types.ObjectId
    userId: string
    word: string
    reading: string
    meaning: string
}

export type WordType = {
    word: string
    reading: string
    meaning: string
    userId: string
}

export interface UserRequest extends Request {
    user?: {
        sub: string
    }
}

export type WordDoc = Document & WordType

export type MongooseWordsType = MongooseWordType[]

export type WordsType = WordType[]
