<template>
  <section class="container section">
    <h1 class="title">登陆 FTP 服务器</h1>
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
              <input v-model="save" type="checkbox" />
              保存账号
            </label>
          </div>
        </div>

        <div class="field is-grouped">
          <div class="control">
            <button @click="connect" class="button is-link">登陆</button>
          </div>
          <div class="control">
            <button @click="connectTest" class="button is-link is-light">
              测试连接
            </button>
          </div>
        </div>
      </div>
    </main>

    <progress v-if="process" class="progress is-danger" max="100"></progress>
    <div v-if="error === ''"></div>
    <!-- 连接错误提示 -->
    <div v-else-if="error" class="message is-danger">
      <div class="message-header">
        <p>连接失败</p>
        <button @click="clear" class="delete" aria-label="delete"></button>
      </div>
      <div
        class="message-body"
        v-html="error"
        style="white-space: pre-wrap;"
      ></div>
    </div>
    <!-- 连接成功提示 -->
    <div v-else class="notification is-success">
      <button @click="clear" class="delete"></button>
      测试连接成功
    </div>
  </section>
</template>

<script>
const JSFTP = require('jsftp')
console.log(JSFTP)

export default {
  name: 'login-page',
  data () {
    return {
      host: '192.168.2.102',
      port: 2121,
      user: 'hello',
      password: '1234',
      save: false,

      // 错误信息, '' 时不显示, null 时成功, 有值时失败
      error: '',
      process: false
    }
  },
  methods: {
    connect: function (event) {
      console.log('正在登陆')
    },
    connectTest: function (event) {
      console.log('尝试登陆')
      this.clear()
      this.process = true

      let ftp = new JSFTP({
        host: this.host,
        port: this.port,
        user: this.user,
        pass: this.password
      })
      ftp.ls('/', (err, res) => {
        if (err) {
          console.log(err)
          this.error = err.stack
        } else {
          console.log(res)
          this.error = null
        }
        this.process = false
      })
    },
    clear: function (event) {
      this.error = ''
    }
  }
}
</script>

<style scoped></style>
