const faker = require('faker')
const { Word } = require('../../../src/models')

describe('Word model', () => {
    describe('Word validation', () => {
        let newWord
        beforeEach(() => {
            newWord = {
                name: faker.name.findName(),
                email: faker.internet.email().toLowerCase(),
                password: 'password1',
                role: 'word',
            }
        })

        test('should correctly validate a valid word', async () => {
            await expect(new Word(newWord).validate()).resolves.toBeUndefined()
        })

        test('should throw a validation error if email is invalid', async () => {
            newWord.email = 'invalidEmail'
            await expect(new Word(newWord).validate()).rejects.toThrow()
        })

        test('should throw a validation error if password length is less than 8 characters', async () => {
            newWord.password = 'passwo1'
            await expect(new Word(newWord).validate()).rejects.toThrow()
        })

        test('should throw a validation error if password does not contain numbers', async () => {
            newWord.password = 'password'
            await expect(new Word(newWord).validate()).rejects.toThrow()
        })

        test('should throw a validation error if password does not contain letters', async () => {
            newWord.password = '11111111'
            await expect(new Word(newWord).validate()).rejects.toThrow()
        })

        test('should throw a validation error if role is unknown', async () => {
            newWord.role = 'invalid'
            await expect(new Word(newWord).validate()).rejects.toThrow()
        })
    })

    describe('Word toJSON()', () => {
        test('should not return word password when toJSON is called', () => {
            const newWord = {
                name: faker.name.findName(),
                email: faker.internet.email().toLowerCase(),
                password: 'password1',
                role: 'word',
            }
            expect(new Word(newWord).toJSON()).not.toHaveProperty('password')
        })
    })
})
