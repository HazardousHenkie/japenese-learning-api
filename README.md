# RESTful API Node Server Boilerplate

[![Build Status](https://travis-ci.org/hagopj13/node-express-boilerplate.svg?branch=master)](https://travis-ci.org/hagopj13/node-express-boilerplate)
[![Coverage Status](https://coveralls.io/repos/github/hagopj13/node-express-boilerplate/badge.svg?branch=master)](https://coveralls.io/github/hagopj13/node-express-boilerplate?branch=master)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/2ab03f5d62a1404f87a659afe8d6d5de)](https://www.codacy.com/manual/hagopj13/node-express-mongoose-boilerplate?utm_source=github.com&utm_medium=referral&utm_content=hagopj13/node-express-boilerplate&utm_campaign=Badge_Grade)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

## Table of Contents

-   [Features](#features)
-   [Commands](#commands)
-   [Environment Variables](#environment-variables)
-   [Project Structure](#project-structure)
-   [API Documentation](#api-documentation)
-   [Error Handling](#error-handling)
-   [Validation](#validation)
-   [Authentication](#authentication)
-   [Authorization](#authorization)
-   [Logging](#logging)
-   [Custom Mongoose Plugins](#custom-mongoose-plugins)
-   [Linting](#linting)
-   [Contributing](#contributing)

## Features

-   **ES9**: latest ECMAScript features
-   **NoSQL database**: [MongoDB](https://www.mongodb.com) object data modeling using [Mongoose](https://mongoosejs.com)
-   **Validation**: request data validation using [Joi](https://github.com/hapijs/joi)
-   **Logging**: using [winston](https://github.com/winstonjs/winston) and [morgan](https://github.com/expressjs/morgan)
-   **Testing**: unit and integration tests using [Jest](https://jestjs.io)
-   **Error handling**: centralized error handling mechanism
-   **API documentation**: with [swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc) and [swagger-ui-express](https://github.com/scottie1984/swagger-ui-express)
-   **Process management**: advanced production process management using [PM2](https://pm2.keymetrics.io)
-   **Dependency management**: with [Yarn](https://yarnpkg.com)
-   **Environment variables**: using [dotenv](https://github.com/motdotla/dotenv) and [cross-env](https://github.com/kentcdodds/cross-env#readme)
-   **Security**: set security HTTP headers using [helmet](https://helmetjs.github.io)
-   **Santizing**: sanitize request data against xss and query injection
-   **CORS**: Cross-Origin Resource-Sharing enabled using [cors](https://github.com/expressjs/cors)
-   **Compression**: gzip compression with [compression](https://github.com/expressjs/compression)
-   **CI**: continuous integration with [Travis CI](https://travis-ci.org)
-   **Docker support**
-   **Code coverage**: using [coveralls](https://coveralls.io)
-   **Code quality**: with [Codacy](https://www.codacy.com)
-   **Git hooks**: with [husky](https://github.com/typicode/husky) and [lint-staged](https://github.com/okonet/lint-staged)
-   **Linting**: with [ESLint](https://eslint.org) and [Prettier](https://prettier.io)
-   **Editor config**: consistent editor configuration using [EditorConfig](https://editorconfig.org)

## Commands

Running locally:

```bash
yarn dev
```

Running in production:

```bash
yarn start
```

Testing:

```bash
# run all tests
yarn test

# run all tests in watch mode
yarn test:watch

# run test coverage
yarn coverage
```

Docker:

```bash
# run docker container in development mode
yarn docker:dev

# run docker container in production mode
yarn docker:prod

# run all tests in a docker container
yarn docker:test
```

Linting:

```bash
# run ESLint
yarn lint

# fix ESLint errors
yarn lint:fix

# run prettier
yarn prettier

# fix prettier errors
yarn prettier:fix
```

## Project Structure

```
src\
 |--config\         # Environment variables and configuration related things
 |--controllers\    # Route controllers (controller layer)
 |--docs\           # Swagger files
 |--middlewares\    # Custom express middlewares
 |--models\         # Mongoose models (data layer)
 |--routes\         # Routes
 |--services\       # Business logic (service layer)
 |--utils\          # Utility classes and functions
 |--validations\    # Request data validation schemas
 |--app.js          # Express app
 |--index.ts        # App entry point
```

## API Documentation

To view the list of available APIs and their specifications, run the server and go to `http://localhost:3000/v1/docs` in your browser. This documentation page is automatically generated using the [swagger](https://swagger.io/) definitions written as comments in the route files.

### API Endpoints

List of available routes:

**Word routes**:\
`POST /v1/words` - create a word\
`GET /v1/words` - get all words\
`GET /v1/words/:wordId` - get word\
`PATCH /v1/words/:wordId` - update word\
`DELETE /v1/words/:wordId` - delete word

## Error Handling

The app has a centralized error handling mechanism.

Controllers should try to catch the errors and forward them to the error handling middleware (by calling `next(error)`). For convenience, you can also wrap the controller inside the catchAsync utility wrapper, which forwards the error.

```javascript
const catchAsync from '../utils/catchAsync')

const controller = catchAsync(async (req, res) => {
    // this error will be forwarded to the error handling middleware
    throw new Error('Something wrong happened')
})
```

The error handling middleware sends an error response, which has the following format:

```json
{
    "code": 404,
    "message": "Not found"
}
```

When running in development mode, the error response also contains the error stack.

The app has a utility ApiError class to which you can attach a response code and a message, and then throw it from anywhere (catchAsync will catch it).

For example, if you are trying to get a word from the DB who is not found, and you want to send a 404 error, the code should look something like:

```javascript
const httpStatus from 'http-status')
const ApiError from '../utils/ApiError')
const Word from '../models/Word')

const getWord = async (wordId) => {
    const word = await Word.findById(wordId)
    if (!word) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Word not found')
    }
}
```

## Validation

Request data is validated using [Joi](https://joi.dev/). Check the [documentation](https://joi.dev/api/) for more details on how to write Joi validation schemas.

The validation schemas are defined in the `src/validations` directory and are used in the routes by providing them as parameters to the `validate` middleware.

```javascript
const express from 'express')
const validate from '../../middlewares/validate')
const wordValidation from '../../validations/word.validation')
const wordController from '../../controllers/word.controller')

const router = express.Router()

router.post(
    '/words',
    validate(wordValidation.createWord),
    wordController.createWord
)
```

## Logging

Import the logger from `src/config/logger.js`. It is using the [Winston](https://github.com/winstonjs/winston) logging library.

Logging should be done according to the following severity levels (ascending order from most important to least important):

```javascript
const logger from '<path to src>/config/logger')

logger.error('message') // level 0
logger.warn('message') // level 1
logger.info('message') // level 2
logger.http('message') // level 3
logger.verbose('message') // level 4
logger.debug('message') // level 5
```

In development mode, log messages of all severity levels will be printed to the console.

In production mode, only `info`, `warn`, and `error` logs will be printed to the console.\
It is up to the server (or process manager) to actually read them from the console and store them in log files.\
This app uses pm2 in production mode, which is already configured to store the logs in log files.

Note: API request information (request url, response code, timestamp, etc.) are also automatically logged (using [morgan](https://github.com/expressjs/morgan)).

## Custom Mongoose Plugins

The app also contains 1 custom mongoose plugins that you can attach to any mongoose model schema. You can find the plugins in `src/models/plugins`.

```javascript
const mongoose from 'mongoose')
const { toJSON } from './plugins')

const wordSchema = mongoose.Schema(
    {
        /* schema definition here */
    },
    { timestamps: true }
)

wordSchema.plugin(toJSON)

const Word = mongoose.model('Word', wordSchema)
```

### toJSON

The toJSON plugin applies the following changes in the toJSON transform call:

-   removes \_\_v, createdAt, updatedAt, and any schema path that has private: true
-   replaces \_id with id

## Linting

Linting is done using [ESLint](https://eslint.org/) and [Prettier](https://prettier.io).

In this app, ESLint is configured to follow the [Airbnb JavaScript style guide](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb-base) with some modifications. It also extends [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier) to turn off all rules that are unnecessary or might conflict with Prettier.

To modify the ESLint configuration, update the `.eslintrc.json` file. To modify the Prettier configuration, update the `.prettierrc.json` file.

To prevent a certain file or directory from being linted, add it to `.eslintignore` and `.prettierignore`.

To maintain a consistent coding style across different IDEs, the project contains `.editorconfig`
