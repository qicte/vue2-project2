import mockRequest from '@/utils/mockRequest'
export default {
    namespaced: true,
    state: {
        list: {}
    },
    actions: {
        // 发请求获取首页的mock数据
        async getData({ commit }) {
            let result = await mockRequest.get('/home/list');
            commit('GETDATA', result.data)

        }
    },
    mutations: {
        GETDATA(state, list) {
            state.list = list
        }
    },
    getters: {

    }
}