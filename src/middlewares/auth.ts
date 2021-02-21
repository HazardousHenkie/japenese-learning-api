import jwt from 'express-jwt'
import jwksRsa from 'jwks-rsa'
import config from 'base/config/config'

const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${config.auth0.domain}/.well-known/jwks.json`,
    }),
    audience: config.auth0.audience,
    issuer: `https://${config.auth0.domain}/`,
    algorithms: ['RS256'],
})

export default checkJwt
