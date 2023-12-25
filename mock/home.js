const data = require('./data.json')
module.exports = [
    // user logout
    {
        url: '/home/list',
        type: 'get',
        response: config => {
            return {
                code: 20000,
                data,
            }
        }
    }
]
