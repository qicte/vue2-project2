import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter, asyncRoutes, constantRoutes, anyRoutes } from '@/router'
import router from '@/router'
const getDefaultState = () => {
  return {
    // 获取token
    token: getToken(),
    // // 存储用户名称
    name: '',
    // 存储用户头像
    avatar: '',
    // 返回可操作的菜单信息
    routes: [],
    buttons: [],
    roles: [],
    // 对比  ：项目中已经有的异步路由，与服务器返回的标记信息rotes对比最终要展示的菜单
    asyncRoutes: [],
    // 最终全部的展示路由：
    resultAllRoutes: []

  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USERINFO: (state, userInfo) => {
    state.name = userInfo.name;
    state.avatar = userInfo.avatar;
    // 菜单权限
    state.routes = userInfo.routes;//['attr','product']
    // 按钮权限
    state.buttons = userInfo.buttons;
    // 角色
    state.roles = userInfo.roles;
  },
  // 最终计算出来的异步路由
  SET_RESULTSYNCROUTES(state, asyncRoutes) {
    console.log('结果', asyncRoutes)
    // 保存当前用户异步路由
    state.asyncRoutes = asyncRoutes;
    // 整合所有路由
    state.resultAllRoutes = constantRoutes.concat(state.asyncRoutes, anyRoutes)
    //  给路由器添加新的路由
    router.addRoutes(state.resultAllRoutes)
  }
}

const actions = {
  // user login
  // 登录业务
  async login({ commit }, userInfo) {
    // 解构除用户名与密码
    const { username, password } = userInfo
    // trim()去除字符串头尾的空白字符，不影响原字符串
    let result = await login({ username: username.trim(), password })
    if (result.code === 20000) {
      const { data } = result;
      commit('SET_TOKEN', data.token);
      setToken(data.token);
      return 'ok'
    } else {
      return Promise.reject(new Error('faile'))
    }
    // return new Promise((resolve, reject) => {
    //   login({ username: username.trim(), password: password }).then(response => {
    //     const { data } = response
    //     commit('SET_TOKEN', data.token)
    //     setToken(data.token)
    //     resolve()
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }
        // 获取用户信息：返回数据包括：name，avator，routes【返回标志，不同用户应该展示什么菜单】
        // roles：9（用户角色信息） buttons:按钮权限信息
        commit('SET_USERINFO', data)
        commit('SET_RESULTSYNCROUTES', computedASYNCROUTES(asyncRoutes, data.routes))
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}
// 对比：对比出当前到底显示什么异步路由
const computedASYNCROUTES = (asyncRoutes, routes) => {
  // 过滤出当前用户需要展示的路由
  return asyncRoutes.filter(item => {
    if (routes.indexOf(item.name) !== -1) {
      // 递归
      if (item.children && item.children.length) {
        item.children = computedASYNCROUTES(item.children, routes)
      }
      return true;
    }
  })
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}

