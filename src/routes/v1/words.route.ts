import wordsController from 'base/controllers/words.controller'
import express from 'express'
import validate from 'base/middlewares/validate'
import wordsValidation from 'base/validations/words.validation'
import auth from 'base/middlewares/auth'
const router = express.Router()

router
    .route('/')
    .post(
        auth,
        validate(wordsValidation.createWord),
        wordsController.createWord
    )
    .get(auth, validate(wordsValidation.getWords), wordsController.getWords)

router
    .route('/:wordId')
    .get(auth, validate(wordsValidation.getWord), wordsController.getWord)
    .patch(
        auth,
        validate(wordsValidation.updateWord),
        wordsController.updateWord
    )
    .delete(
        auth,
        validate(wordsValidation.deleteWord),
        wordsController.deleteWord
    )

export default router

/**
 * @swagger
 * tags:
 *   name: Words
 *   description: Words to study
 */

/**
 * @swagger
 * path:
 *  /words:
 *    post:
 *      summary: Create a word
 *      tags: [Words]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - word
 *                - reading
 *                - meaning
 *              properties:
 *                word:
 *                  type: string
 *                reading:
 *                  type: string
 *                meaning:
 *                  type: string
 *              example:
 *                name: 漢字
 *                reading: kanji
 *                meaning: Japanese charcter
 *      responses:
 *        "201":
 *          description: Created
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/Word'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *
 *    get:
 *      summary: Get all words
 *      tags: [Words]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: query
 *          word: word
 *          schema:
 *            type: string
 *          description: Word
 *        - in: query
 *          name: sortBy
 *          schema:
 *            type: string
 *          description: sort by query in the form of field:desc/asc (ex. name:asc)
 *        - in: query
 *          name: limit
 *          schema:
 *            type: integer
 *            minimum: 1
 *          default: 10
 *          description: Maximum number of words
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  results:
 *                    type: array
 *                    items:
 *                      $ref: '#/components/schemas/Word'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * path:
 *  /words/{id}:
 *    get:
 *      summary: Get a word
 *      tags: [Words]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: Word id
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/Word'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 *
 *    patch:
 *      summary: Update a word
 *      tags: [Words]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: Word id
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                word:
 *                  type: string
 *                reading:
 *                  type: string
 *                meaning:
 *                  type: string
 *              example:
 *                word: 漢字
 *                reading: kanji
 *                meaning: Japanese character
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/Word'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 *
 *    delete:
 *      summary: Delete a word
 *      tags: [Words]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: Word id
 *      responses:
 *        "200":
 *          description: No content
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 */
