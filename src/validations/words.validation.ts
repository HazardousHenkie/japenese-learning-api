import Joi from 'joi'
import { objectId } from './custom.validation'

const createWord = {
    body: Joi.object().keys({
        word: Joi.string().required(),
        reading: Joi.string().required(),
        meaning: Joi.string().required(),
    }),
}

const getWords = {
    query: Joi.object().keys({
        word: Joi.string(),
    }),
}

const getWord = {
    params: Joi.object().keys({
        wordId: Joi.string().custom(objectId),
    }),
}

const updateWord = {
    params: Joi.object().keys({
        wordId: Joi.required().custom(objectId),
    }),
    body: Joi.object()
        .keys({
            word: Joi.string(),
            reading: Joi.string(),
            meaning: Joi.string(),
        })
        .min(1),
}

const deleteWord = {
    params: Joi.object().keys({
        wordId: Joi.string().custom(objectId),
    }),
}

export default {
    createWord,
    getWords,
    getWord,
    updateWord,
    deleteWord,
}
