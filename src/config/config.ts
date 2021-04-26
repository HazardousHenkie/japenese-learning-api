import dotenv from 'dotenv'
import path from 'path'
import Joi from 'joi'

dotenv.config({ path: path.join(__dirname, '../../.env') })

const envVarsSchema = Joi.object()
    .keys({
        NODE_ENV: Joi.string()
            .valid('production', 'development', 'test')
            .required(),
        PORT: Joi.number().default(3000),
        MONGODB_URL: Joi.string().required().description('Mongo DB url'),
    })
    .unknown()

const { value: envVars, error } = envVarsSchema
    .prefs({ errors: { label: 'key' } })
    .validate(process.env)

const audience = process.env.AUTH0_AUDIENCE
const domain = process.env.AUTH0_DOMAIN
const clientOriginUrl = process.env.CLIENT_ORIGIN_URL
const testingAudience = process.env.AUTH0_TESTING_AUDIENCE
const testingClientId = process.env.AUTH0_TESTING_CLIENT_ID
const testingClientSecret = process.env.AUTH0_TESTING_CLIENT_SECRET

if (error) {
    throw new Error(`Config validation error: ${error.message}`)
}

if (!audience) {
    throw new Error(
        '.env is missing the definition of an AUTH0_AUDIENCE environmental variable'
    )
}

if (!domain) {
    throw new Error(
        '.env is missing the definition of an AUTH0_DOMAIN environmental variable'
    )
}

if (!clientOriginUrl) {
    throw new Error(
        '.env is missing the definition of a APP_ORIGIN environmental variable'
    )
}

const clientOrigins = ['http://localhost:8080']

export default {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    auth0: {
        audience,
        domain,
        clientOriginUrl,
        clientOrigins,
        testingAudience,
        testingClientId,
        testingClientSecret,
    },
    mongoose: {
        url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
        options: {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
    },
}
