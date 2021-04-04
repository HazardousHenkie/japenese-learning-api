import { version } from '../../package.json'
import config from 'base/config/config'

const swaggerDef = {
    openapi: '3.0.0',
    info: {
        title: 'japanese-learning-api API documentation',
        version,
        license: {
            name: 'MIT',
        },
    },
    servers: [
        {
            url: `http://localhost:${config.port}/v1`,
        },
    ],
}

export default swaggerDef
