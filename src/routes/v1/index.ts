import express from 'express'

import wordRoute from './words.route'
import docsRoute from './docs.route'
import config from 'base/config/config'
import auth from 'base/middlewares/validate'

const router = express.Router()

router.use(auth)

const defaultRoutes = [
    {
        path: '/words',
        route: wordRoute,
    },
]

const devRoutes = [
    // routes available only in development mode
    {
        path: '/docs',
        route: docsRoute,
    },
]

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route)
})

/* istanbul ignore next */
if (config.env === 'development') {
    devRoutes.forEach((route) => {
        router.use(route.path, route.route)
    })
}

export default router
