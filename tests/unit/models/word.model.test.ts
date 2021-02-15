import faker from 'faker'
import Word from 'models/word.model'

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
