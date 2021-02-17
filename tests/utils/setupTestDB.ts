import config from 'base/config/config'
import mongoose from 'mongoose'

const setupTestDB = () => {
    beforeAll(async () => {
        await mongoose.connect(config.mongoose.url, config.mongoose.options)
    })

    beforeEach(async () => {
        await Promise.all(
            Object.values(
                mongoose.connection.collections
            ).map(async (collection) => collection.deleteMany({}))
        )
    })

    afterAll(async () => {
        await mongoose.disconnect()
    })
}

export default setupTestDB
