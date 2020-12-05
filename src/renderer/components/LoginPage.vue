<template>
  <div class="container section">
    <h1>登陆 FTP 服务器</h1>
    <main>
      <div>
        <div class="field">
          <label class="label">Host</label>
          <div class="control">
            <input
              v-model.trim="host"
              class="input"
              type="text"
              placeholder="输入 IP 地址或域名"
            />
          </div>
        </div>

        <div class="field">
          <label class="label">Port</label>
          <div class="control">
            <input
              v-model.number="port"
              class="input"
              type="number"
              placeholder="输入端口号"
            />
          </div>
        </div>

        <div class="field">
          <label class="label">User</label>
          <div class="control">
            <input
              v-model.trim="user"
              class="input"
              type="text"
              placeholder="如果需要验证, 请填写用户名和密码"
            />
          </div>
        </div>

        <div class="field">
          <label class="label">Password</label>
          <div class="control">
            <input
              v-model.trim="password"
              class="input"
              type="text"
              placeholder="如果需要验证, 请填写用户名和密码"
            />
          </div>
        </div>

        <div class="field">
          <div class="control">
            <label class="checkbox">
              <input v-model="save_data" type="checkbox" />
              保存账号
            </label>
          </div>
        </div>

        <div class="field is-grouped">
          <div class="control">
            <button @click="connect" class="button is-link">登陆</button>
          </div>
          <div class="control">
            <button class="button is-link is-light">取消</button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'login-page',
  data () {
    return {
      host: '192.168.1.1',
      port: 21,
      user: '',
      password: '',
      save_data: false
    }
  },
  methods: {
    connect: function (event) {
      console.log('尝试登陆')
    }
  }
}
</script>

<style scoped></style>
