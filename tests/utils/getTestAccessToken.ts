import axios from 'axios'
import config from 'base/config/config'

const getTestAccessToken = async () => {
    try {
        const response = await axios.post(
            `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
            {
                grant_type: 'client_credentials',
                client_id: config.auth0.testingClientId,
                client_secret: config.auth0.testingClientSecret,
                audience: config.auth0.testingAudience,
            }
        )

        return response.data.access_token
    } catch (error) {
        console.error(error)
    }
}

export default getTestAccessToken
