import request from 'supertest'
import faker from 'faker'
import httpStatus from 'http-status'
import app from 'base/app'
import setupTestDB from '../utils/setupTestDB'
import insertWords, { wordOne, wordTwo } from '../fixtures/word.fixture'
import { WordType } from 'types/words'
import Word from 'base/models/word.model'

setupTestDB()

describe('Words routes', () => {
    describe('POST /v1/words', () => {
        let newWord: WordType

        beforeEach(() => {
            newWord = {
                word: faker.random.word(),
                reading: faker.random.word(),
                meaning: faker.random.word(),
                userId: faker.random.word(),
            }
        })

        test('should return 201 and successfully create new word if data is ok', async () => {
            const res = await request(app)
                .post('/v1/words')
                .send(newWord)
                .expect(httpStatus.CREATED)

            // check body return results
            expect(res.body).toEqual({
                id: expect.anything(),
                word: newWord.word,
                reading: newWord.reading,
                meaning: newWord.meaning,
            })

            // check database entry
            const dbWord = await Word.findById(res.body.id)
            expect(dbWord).toBeDefined()
            expect(dbWord).toMatchObject({
                word: newWord.word,
                reading: newWord.reading,
                meaning: newWord.meaning,
            })
        })

        // test('should return 401 error if access token is missing', async () => {
        //     await request(app)
        //         .post('/v1/words')
        //         .send(newWord)
        //         .expect(httpStatus.UNAUTHORIZED)
        // })
    })

    describe('GET /v1/words', () => {
        test('should return 200 and apply the default query options', async () => {
            await insertWords([wordOne, wordTwo])

            const res = await request(app)
                .get('/v1/words')
                .send()
                .expect(httpStatus.OK)

            expect(res.body).toEqual({
                results: expect.any(Array),
            })
            expect(res.body.results).toHaveLength(2)
            expect(res.body.results[0]).toEqual({
                id: wordOne._id.toHexString(),
                word: wordOne.word,
                reading: wordOne.reading,
                meaning: wordOne.meaning,
            })
        })

        // test('should return 401 if access token is missing', async () => {
        //     await insertWords([wordOne, wordTwo])

        //     await request(app)
        //         .get('/v1/words')
        //         .send()
        //         .expect(httpStatus.UNAUTHORIZED)
        // })

        // test('should return 403 if a non-authorized is trying to access all words', async () => {
        //     await insertWords([wordOne, wordTwo])

        //     await request(app)
        //         .get('/v1/words')
        //         // .set('Authorization', `Bearer ${wordOneAccessToken}`)
        //         .send()
        //         .expect(httpStatus.FORBIDDEN)
        // })

        test('should correctly apply filter on word field', async () => {
            await insertWords([wordOne, wordTwo])

            const res = await request(app)
                .get('/v1/words')
                .query({ word: wordOne.word })
                .send()
                .expect(httpStatus.OK)

            expect(res.body).toEqual({
                results: expect.any(Array),
            })
            expect(res.body.results).toHaveLength(1)
            expect(res.body.results[0].id).toBe(wordOne._id.toHexString())
        })
    })

    describe('GET /v1/words/:wordId', () => {
        test('should return 200 and the word object if data is ok', async () => {
            await insertWords([wordOne])

            const res = await request(app)
                .get(`/v1/words/${wordOne._id}`)
                .send()
                .expect(httpStatus.OK)

            expect(res.body).toEqual({
                id: wordOne._id.toHexString(),
                word: wordOne.word,
                reading: wordOne.reading,
                meaning: wordOne.meaning,
            })
        })

        // only get own words

        // test('should return 401 error if access token is missing', async () => {
        //     await insertWords([wordOne])

        //     await request(app)
        //         .get(`/v1/words/${wordOne._id}`)
        //         .send()
        //         .expect(httpStatus.UNAUTHORIZED)
        // })

        test('should return 400 error if wordId is not a valid mongo id', async () => {
            await request(app)
                .get('/v1/words/invalidId')
                .send()
                .expect(httpStatus.BAD_REQUEST)
        })

        test('should return 404 error if word is not found', async () => {
            await request(app)
                .get(`/v1/words/${wordOne._id}`)
                .send()
                .expect(httpStatus.NOT_FOUND)
        })
    })

    describe('DELETE /v1/words/:wordId', () => {
        test('should return 204 if data is ok', async () => {
            await insertWords([wordOne])

            await request(app)
                .delete(`/v1/words/${wordOne._id}`)
                .send()
                .expect(httpStatus.NO_CONTENT)

            const dbWord = await Word.findById(wordOne._id)
            expect(dbWord).toBeNull()
        })

        // test('should return 401 error if access token is missing', async () => {
        //     await insertWords([wordOne])

        //     await request(app)
        //         .delete(`/v1/words/${wordOne._id}`)
        //         .send()
        //         .expect(httpStatus.UNAUTHORIZED)
        // })

        test('should return 204 if user is trying to delete another word', async () => {
            await insertWords([wordOne])

            await request(app)
                .delete(`/v1/words/${wordOne._id}`)
                .send()
                .expect(httpStatus.NO_CONTENT)
        })

        test('should return 400 error if wordId is not a valid mongo id', async () => {
            await request(app)
                .delete('/v1/words/invalidId')

                .send()
                .expect(httpStatus.BAD_REQUEST)
        })

        test('should return 404 error if word already is not found', async () => {
            await request(app)
                .delete(`/v1/words/${wordOne._id}`)
                .send()
                .expect(httpStatus.NOT_FOUND)
        })
    })

    describe('PATCH /v1/words/:wordId', () => {
        test('should return 200 and successfully update word if data is ok', async () => {
            await insertWords([wordOne])
            const updateBody = {
                word: faker.random.word(),
                reading: faker.random.word(),
                meaning: faker.random.word(),
            }

            const res = await request(app)
                .patch(`/v1/words/${wordOne._id}`)
                .send(updateBody)
                .expect(httpStatus.OK)

            expect(res.body).toEqual({
                id: wordOne._id.toHexString(),
                word: updateBody.word,
                reading: updateBody.reading,
                meaning: updateBody.meaning,
            })

            const dbWord = await Word.findById(wordOne._id)
            expect(dbWord).toBeDefined()
            expect(dbWord).toMatchObject({
                word: updateBody.word,
                reading: updateBody.reading,
                meaning: updateBody.meaning,
            })
        })

        // test('should return 401 error if access token is missing', async () => {
        //     await insertWords([wordOne])
        //     const updateBody = { name: faker.name.findName() }

        //     await request(app)
        //         .patch(`/v1/words/${wordOne._id}`)
        //         .send(updateBody)
        //         .expect(httpStatus.UNAUTHORIZED)
        // })

        test('should return 404 if user is updating another word that is not found', async () => {
            const updateBody = { word: faker.random.word() }

            await request(app)
                .patch(`/v1/words/${wordOne._id}`)
                .send(updateBody)
                .expect(httpStatus.NOT_FOUND)
        })

        test('should return 400 error if wordId is not a valid mongo id', async () => {
            const updateBody = { name: faker.name.findName() }

            await request(app)
                .patch(`/v1/words/invalidId`)
                .send(updateBody)
                .expect(httpStatus.BAD_REQUEST)
        })
    })
})
