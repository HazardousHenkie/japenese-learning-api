const faker = require('faker')
const { Word } = require('../../../src/models')

describe('Word model', () => {
    describe('Word validation', () => {
        let newWord
        beforeEach(() => {
            newWord = {
                word: faker.random.word(),
                reading: faker.random.word(),
                meaning: faker.random.word(),
            }
        })

        test('should correctly validate a valid word', async () => {
            await expect(new Word(newWord).validate()).resolves.toBeUndefined()
        })

        test('should throw a validation error if word is invalid', async () => {
            newWord.word = 'invaliWord'
            await expect(new Word(newWord).validate()).rejects.toThrow()
        })

        test('should throw a validation error if reading is invalid', async () => {
            newWord.reading = 'invaliWord'
            await expect(new Word(newWord).validate()).rejects.toThrow()
        })

        test('should throw a validation error if meaning is invalid', async () => {
            newWord.meaning = 'invaliWord'
            await expect(new Word(newWord).validate()).rejects.toThrow()
        })
    })

    describe('Word toJSON()', () => {
        test('should not return word password when toJSON is called', () => {
            const newWord = {
                word: faker.random.word(),
                reading: faker.random.word(),
                meaning: faker.random.word(),
            }
            expect(new Word(newWord).toJSON()).not.toHaveProperty('password')
        })
    })
})
