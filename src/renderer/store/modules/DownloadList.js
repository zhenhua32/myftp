// 定义需要存储的数据
const state = {
  data: []
}

// 定义变更状态的方法
const mutations = {
  ADD_ITEM (state, payload) {
    state.data.push(payload.item)
  },
  REMOVE_ITEM (state, payload) {
    state.data.pop()
  },
  CLEAR (state, payload) {
    state.data = []
  }
}

// 定义动作, 内部调用 mutations, 可以使用异步操作
const actions = {
  addItem ({ commit }, payload) {
    commit('ADD_ITEM', payload)
  },
  removeItem ({ commit }, payload) {
    commit('REMOVE_ITEM', payload)
  },
  clear ({ commit }, payload) {
    commit('CLEAR', payload)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
