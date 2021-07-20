// 定义需要存储的数据
const state = {
  host: '192.168.0.105',
  port: 2121,
  user: 'hello',
  password: '1234',
  client: null
}

// 定义变更状态的方法
const mutations = {
  SAVE_FTP_ACCOUNT (state, payload) {
    state.host = payload.host
    state.port = payload.port
    state.user = payload.user
    state.password = payload.password
  },
  SAVE_FTP (state, client) {
    state.client = client
  }
}

// 定义动作, 内部调用 mutations, 可以使用异步操作
const actions = {
  saveAccount ({ commit }, payload) {
    commit('SAVE_FTP_ACCOUNT', payload)
  },
  saveFTP ({ commit }, payload) {
    commit('SAVE_FTP', payload)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
