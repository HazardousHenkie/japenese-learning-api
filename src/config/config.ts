import dotenv from 'dotenv'
import path from 'path'
import Joi from 'joi'

dotenv.config({
    path: path.join(__dirname, '../../.env'),
})

const envVarsSchema = Joi.object()
    .keys({
        NODE_ENV: Joi.string()
            .valid('production', 'development', 'test')
            .required(),
        PORT: Joi.number().default(3000),
        AUTH0_CLIENT_ORIGIN_URL: Joi.string()
            .required()
            .description('Client origin url'),
        AUTH0_AUDIENCE: Joi.string().required().description('Auth0 Audience'),
        AUTH0_DOMAIN: Joi.string().required().description('Auth0 Domain'),
        AUTH0_TESTING_AUDIENCE: Joi.string()
            .required()
            .description('Auth0 Testing Audience'),
        AUTH0_TESTING_CLIENT_SECRET: Joi.string()
            .required()
            .description('Auth0 Client secret'),

        MONGODB_URL: Joi.string().required().description('Mongo DB url'),
    })
    .unknown()

const { value: envVars, error } = envVarsSchema
    .prefs({ errors: { label: 'key' } })
    .validate(process.env)

if (error) {
    throw new Error(`Config validation error: ${error.message}`)
}

const clientOrigins = ['http://localhost:8080']

export default {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    auth0: {
        audience: envVars.AUTH0_AUDIENCE,
        domain: envVars.AUTH0_DOMAIN,
        clientOriginUrl: envVars.AUTH0_CLIENT_ORIGIN_URL,
        clientOrigins,
        testingAudience: envVars.AUTH0_TESTING_AUDIENCE,
        testingClientId: envVars.AUTH0_TESTING_CLIENT_ID,
        testingClientSecret: envVars.AUTH0_TESTING_CLIENT_SECRET,
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
