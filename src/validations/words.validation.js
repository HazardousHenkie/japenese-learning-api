const Joi = require('joi')
const { objectId } = require('./custom.validation')

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
        sortBy: Joi.string(),
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

module.exports = {
    createWord,
    getWords,
    getWord,
    updateWord,
    deleteWord,
}
