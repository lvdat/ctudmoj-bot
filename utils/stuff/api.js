import axios from 'axios'
import https from 'https'

const API_HOST = 'https://dmoj.ctu.edu.vn/api/v2'

const config = {
    'Content-Type': 'application/json',
    Accept: 'application/json'
}

const agent = https.Agent({
    rejectUnauthorized: false
})

export default () => {
    return axios.create({
        baseURL: API_HOST,
        headers: config,
        httpsAgent: agent
    })
}
