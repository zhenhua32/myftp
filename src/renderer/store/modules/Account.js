// 定义需要存储的数据
const state = {
  host: '192.168.2.102',
  port: 2121,
  user: 'hello',
  password: '1234',
  ftp: null
}

const mutations = {
  SAVE_FTP_ACCOUNT (state, payload) {
    state.host = payload.host
    state.port = payload.port
    state.user = payload.user
    state.password = payload.password
  },
  SAVE_FTP (state, ftp) {
    state.ftp = ftp
  }
}

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
