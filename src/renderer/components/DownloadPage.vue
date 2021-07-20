<template>
  <section class="container section">
    <!-- 定义操作栏 -->
    <div class="columns">
      <div class="column">
        <router-link to="/main">
          <span class="icon" title="主页" @click="getPaths('/')">
            <i class="fas fa-home"></i>
          </span>
          主页面
        </router-link>
      </div>
    </div>

    <!-- 定义文件列表展示区 -->
    <div class="table-container">
      <table class="table is-striped is-hoverable is-fullwidth">
        <thead>
          <tr>
            <th>index</th>
            <th>文件名</th>
            <th>大小</th>
            <th>预计时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tfoot>
          <tr>
            <th>index</th>
            <th>文件名</th>
            <th>大小</th>
            <th>预计时间</th>
            <th>操作</th>
          </tr>
        </tfoot>

        <tbody>
          <tr v-for="(item, index) in paths" :key="index">
            <th>{{ index }}</th>
            <td>{{ item.name }}</td>
            <td>{{ formatBytes(item.size) }}</td>
            <td>{{ new Date(item.time) }}</td>
            <td>
              <button class="button">
                暂停
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script>
const JSFTP = require('jsftp')
const { formatBytes } = require('../../tools/helper')

export default {
  name: 'download-page',
  data () {
    return {
      ftp: null,
      paths: []
    }
  },
  methods: {
    formatBytes: formatBytes,
    // 连接 ftp 服务器
    connect: function () {
      this.ftp = new JSFTP({
        host: this.$store.state.Account.host,
        port: this.$store.state.Account.port,
        user: this.$store.state.Account.user,
        pass: this.$store.state.Account.password
      })
    }
  },
  mounted: function () {
    // 只能重新连接
    this.connect()
    if (!this.ftp) {
      console.log('无效的 ftp, 回到首页')
      this.$router.replace({ path: '/' })
    }
    this.getPaths('/')
  }
}
</script>

<style></style>
