import Axios from 'axios'

const BASE_URL = 'https://dataservice.accuweather.com/';

var axios = Axios.create({
    withCredentials: false,
})

export const httpService = {
    get(endpoint, data) {
        return ajax(endpoint, 'GET', data)
    },
    post(endpoint, data, options) {
        return ajax(endpoint, 'POST', data, options)
    },
    put(endpoint, data) {
        return ajax(endpoint, 'PUT', data)
    },
    delete(endpoint, data) {
        return ajax(endpoint, 'DELETE', data)
    }
}

async function ajax(endpoint, method = 'GET', data = null, options = null) {
    try {
        const res = await axios({
            url: `${BASE_URL}${endpoint}`,
            method,
            data,
            params: (method === 'GET') ? data : null,
            ...options
        })
        return res.data
    } catch (err) {
        throw err
    }
}