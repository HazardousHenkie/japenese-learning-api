import request from 'supertest'
import faker from 'faker'
import httpStatus from 'http-status'

import setupTestDB from '../utils/setupTestDB'
import getTestAccessToken from '../utils/getTestAccessToken'
import insertWords, { wordOne, wordTwo } from '../fixtures/word.fixture'
import { WordType } from '../../src/types/words'
import app from '../../src/app'
import Word from '../../src/models/word.model'

setupTestDB()

const testToken =
    'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlN5bEZaRHhvdllKUEVxY1p3WVhLYiJ9.eyJpc3MiOiJodHRwczovL2Rldi1vM3huaTJidy5qcC5hdXRoMC5jb20vIiwic3ViIjoiamRSOE1kbmJ2OEhrMWJvb3prczZvMUlublpEcDdxeWRAY2xpZW50cyIsImF1ZCI6ImphcGFuZXNlLWxlYXJuaW5nLWFwaS5oYXphcmRvdXNoZW5raWUubmwiLCJpYXQiOjE2MTM3ODgzNDUsImV4cCI6MTYxMzg3NDc0NSwiYXpwIjoiamRSOE1kbmJ2OEhrMWJvb3prczZvMUlublpEcDdxeWQiLCJndHkiOiJjbGllbnQtY3JlZGVudGlhbHMifQ.e1W6Oy6-DxX3SIwbOVvehuQLpoGSXd84glLuDMUZlCcdmp0m1ETypxLPn_TBFhBCrgsPsFwxq94jDr01WNfnkzpRMWwrbZc63vN5abDY_z8vJ9UJ_REAYR3_S2BYP4_eBHfkLxdyuM9A_EbNwsFmRg9vTFoVmCWLbi0mkvLwvUITyMWQdICIbHsYB_xcdI0B4GTpwQZlxLEt_nZropcfziuNKvs75QbPrdtaX7I76hy6rFkbj3JJ87L3TiTBbKrLtVfVq-9wGR2EHySxfx-AWSnqf9An6jGljkaIblazwRZvTfo5rIj21yWKj5gEAKt6j61_MjXuNylvrxwRnmFcrgf'
let userId: string | undefined
let authToken: string

beforeAll(async () => {
    authToken = await getTestAccessToken()
})

describe('Words routes', () => {
    describe('POST /v1/words', () => {
        let newWord: Omit<WordType, 'userId'>

        beforeEach(() => {
            newWord = {
                word: faker.random.word(),
                reading: faker.random.word(),
                meaning: faker.random.word(),
            }
        })

        test('should return 201 and successfully create new word if data is ok', async () => {
            const res = await request(app)
                .post('/v1/words')
                .send(newWord)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(httpStatus.CREATED)

            expect(res.body).toEqual({
                id: expect.anything(),
                word: newWord.word,
                reading: newWord.reading,
                meaning: newWord.meaning,
            })

            const dbWord = await Word.findById(res.body.id)
            userId = dbWord?.userId
            expect(dbWord).toBeDefined()
            expect(dbWord).toMatchObject({
                word: newWord.word,
                reading: newWord.reading,
                meaning: newWord.meaning,
            })
        })

        test('should return 500 error if access token is missing', async () => {
            await request(app)
                .post('/v1/words')
                .send(newWord)
                .expect(httpStatus.INTERNAL_SERVER_ERROR)
        })

        test('should return 500 error if access token is present but invalid', async () => {
            const res = await request(app)
                .post('/v1/words')
                .set('Authorization', `Bearer ${testToken}`)
                .send(newWord)
                .expect(httpStatus.INTERNAL_SERVER_ERROR)

            expect(res.body.message).toEqual('invalid signature')
        })
    })

    describe('GET /v1/words', () => {
        test('should return 200 and apply the default query options', async () => {
            await insertWords([wordOne, wordTwo], userId as string)

            const res = await request(app)
                .get('/v1/words')
                .set('Authorization', `Bearer ${authToken}`)
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

        test('should return 500 error if access token is missing', async () => {
            await request(app)
                .get('/v1/words')
                .expect(httpStatus.INTERNAL_SERVER_ERROR)
        })

        test('should return 500 error if access token is present but invalid', async () => {
            const res = await request(app)
                .get('/v1/words')
                .set('Authorization', `Bearer ${testToken}`)
                .expect(httpStatus.INTERNAL_SERVER_ERROR)

            expect(res.body.message).toEqual('invalid signature')
        })

        test("shouldn't return words if not for curren't user", async () => {
            await insertWords([wordOne, wordTwo], 'testId')

            const res = await request(app)
                .get('/v1/words')
                .set('Authorization', `Bearer ${authToken}`)
                .send()

            expect(res.body.results).toHaveLength(0)
        })

        test('should correctly apply filter on word field', async () => {
            await insertWords([wordOne, wordTwo], userId as string)

            const res = await request(app)
                .get('/v1/words')
                .set('Authorization', `Bearer ${authToken}`)
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
            await insertWords([wordOne], userId as string)

            const res = await request(app)
                .get(`/v1/words/${wordOne._id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send()
                .expect(httpStatus.OK)

            expect(res.body).toEqual({
                id: wordOne._id.toHexString(),
                word: wordOne.word,
                reading: wordOne.reading,
                meaning: wordOne.meaning,
            })
        })

        test("shouldn't delete word if not from current user", async () => {
            await insertWords([wordOne], userId as string)
            await insertWords([wordTwo], 'testId')

            await request(app)
                .get(`/v1/words/${wordTwo._id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send()
                .expect(httpStatus.UNAUTHORIZED)
        })

        test('should return 500 error if access token is missing', async () => {
            await request(app)
                .get(`/v1/words/${wordOne._id}`)
                .expect(httpStatus.INTERNAL_SERVER_ERROR)
        })

        test('should return 500 error if access token is present but invalid', async () => {
            const res = await request(app)
                .get(`/v1/words/${wordOne._id}`)
                .set('Authorization', `Bearer ${testToken}`)
                .expect(httpStatus.INTERNAL_SERVER_ERROR)

            expect(res.body.message).toEqual('invalid signature')
        })

        test('should return 400 error if wordId is not a valid mongo id', async () => {
            await request(app)
                .get('/v1/words/invalidId')
                .set('Authorization', `Bearer ${authToken}`)
                .send()
                .expect(httpStatus.BAD_REQUEST)
        })

        test('should return 404 error if word is not found', async () => {
            await request(app)
                .get(`/v1/words/${wordOne._id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send()
                .expect(httpStatus.NOT_FOUND)
        })
    })

    describe('DELETE /v1/words/:wordId', () => {
        test('should return 204 if data is ok', async () => {
            await insertWords([wordOne], userId as string)

            await request(app)
                .delete(`/v1/words/${wordOne._id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send()
                .expect(httpStatus.NO_CONTENT)

            const dbWord = await Word.findById(wordOne._id)
            expect(dbWord).toBeNull()
        })

        test('should return 500 error if access token is missing', async () => {
            await request(app)
                .delete(`/v1/words/${wordOne._id}`)
                .expect(httpStatus.INTERNAL_SERVER_ERROR)
        })

        test('should return 500 error if access token is present but invalid', async () => {
            const res = await request(app)
                .delete(`/v1/words/${wordOne._id}`)
                .set('Authorization', `Bearer ${testToken}`)
                .expect(httpStatus.INTERNAL_SERVER_ERROR)

            expect(res.body.message).toEqual('invalid signature')
        })

        test('should return 204 if user is trying to delete another word', async () => {
            await insertWords([wordOne], userId as string)

            await request(app)
                .delete(`/v1/words/${wordOne._id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send()
                .expect(httpStatus.NO_CONTENT)
        })

        test('should return 400 error if wordId is not a valid mongo id', async () => {
            await request(app)
                .delete('/v1/words/invalidId')
                .set('Authorization', `Bearer ${authToken}`)
                .send()
                .expect(httpStatus.BAD_REQUEST)
        })

        test('should return 404 error if word already is not found', async () => {
            await request(app)
                .delete(`/v1/words/${wordOne._id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send()
                .expect(httpStatus.NOT_FOUND)
        })

        test("shouldn't delete word if not from current user", async () => {
            await insertWords([wordOne], userId as string)
            await insertWords([wordTwo], 'testId')

            await request(app)
                .delete(`/v1/words/${wordTwo._id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send()
                .expect(httpStatus.UNAUTHORIZED)
        })
    })

    describe('PATCH /v1/words/:wordId', () => {
        test('should return 200 and successfully update word if data is ok', async () => {
            await insertWords([wordOne], userId as string)
            const updateBody = {
                word: faker.random.word(),
                reading: faker.random.word(),
                meaning: faker.random.word(),
            }

            const res = await request(app)
                .patch(`/v1/words/${wordOne._id}`)
                .set('Authorization', `Bearer ${authToken}`)
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

        test('should return 500 error if access token is missing', async () => {
            await request(app)
                .patch(`/v1/words/${wordOne._id}`)
                .expect(httpStatus.INTERNAL_SERVER_ERROR)
        })

        test('should return 500 error if access token is present but invalid', async () => {
            const res = await request(app)
                .patch(`/v1/words/${wordOne._id}`)
                .set('Authorization', `Bearer ${testToken}`)
                .expect(httpStatus.INTERNAL_SERVER_ERROR)

            expect(res.body.message).toEqual('invalid signature')
        })

        test('should return 404 if user is updating another word that is not found', async () => {
            const updateBody = { word: faker.random.word() }

            await request(app)
                .patch(`/v1/words/${wordOne._id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(updateBody)
                .expect(httpStatus.NOT_FOUND)
        })

        test('should return 400 error if wordId is not a valid mongo id', async () => {
            const updateBody = { name: faker.name.findName() }

            await request(app)
                .patch(`/v1/words/invalidId`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(updateBody)
                .expect(httpStatus.BAD_REQUEST)
        })

        test("shouldn't patch word if not from current user", async () => {
            await insertWords([wordOne], userId as string)
            await insertWords([wordTwo], 'testId')

            const updateBody = {
                word: faker.random.word(),
                reading: faker.random.word(),
                meaning: faker.random.word(),
            }

            await request(app)
                .patch(`/v1/words/${wordTwo._id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(updateBody)
                .expect(httpStatus.UNAUTHORIZED)
        })
    })
})
