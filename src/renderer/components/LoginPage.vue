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
          <div class="control">
            <button @click="loadAccount" class="button is-link is-success">
              加载账号
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
const BasicFTP = require('basic-ftp')

export default {
  name: 'login-page',
  data () {
    return {
      host: '',
      port: 21,
      user: '',
      password: '',
      save: false,
      ftp: null,
      client: null,

      // 错误信息, '' 时不显示, null 时成功, 有值时失败
      error: '',
      process: false
    }
  },
  methods: {
    // 登录 ftp 并跳转到新页面
    connect: async function (event) {
      console.log('正在登陆')

      this.client = new BasicFTP.Client()
      try {
        await this.client.access({
          host: this.host,
          port: this.port,
          user: this.user,
          password: this.password,
          secure: false
        })
      } catch (err) {
        this.error = err
        this.process = false
        return
      }

      this.saveAccount()
      // 跳转到新页面
      this.$router.push({ path: 'main' })
    },
    connectTest: async function (event) {
      console.log('尝试登陆')
      this.clear()
      this.process = true

      this.client = new BasicFTP.Client()
      // 测试时用, 控制台输出更多信息
      if (process.env.NODE_ENV === 'development') {
        this.client.ftp.verbose = true
      }

      try {
        await this.client.access({
          host: this.host,
          port: this.port,
          user: this.user,
          password: this.password,
          secure: false
        })
        console.log(await this.client.list())
      } catch (err) {
        this.error = err
        this.process = false
        return
      }
      this.error = null
      this.process = false

      // 保存账号数据
      this.saveAccount()
    },
    clear: function () {
      this.error = ''
    },
    loadAccount: function () {
      this.host = this.$store.state.Account.host
      this.port = this.$store.state.Account.port
      this.user = this.$store.state.Account.user
      this.password = this.$store.state.Account.password
    },
    saveAccount: function () {
      if (!this.save) return
      this.$store.dispatch('Account/saveAccount', {
        host: this.host,
        port: this.port,
        user: this.user,
        password: this.password
      })
      this.$store.dispatch('Account/saveFTP', {
        client: this.client
      })
    }
  }
}
</script>

<style scoped></style>
