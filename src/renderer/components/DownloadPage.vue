<template>
  <section class="container section">
    <!-- 定义操作栏 -->
    <div class="columns">
      <div class="column">
        <button class="button is-small" @click="clearItems">
          清空列表
        </button>
      </div>
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
          <tr v-for="(item, index) in items" :key="index">
            <th>{{ index }}</th>
            <td>{{ item.name }}</td>
            <td>{{ formatBytes(item.size) }}</td>
            <td>{{}}</td>
            <td>
              <button class="button is-small" @click="saveFile(item)">
                开始下载
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script>
const fs = require('fs')
const BasicFTP = require('basic-ftp')
const { dialog } = require('electron').remote
const { formatBytes } = require('../../tools/helper')

console.log(BasicFTP)
console.log(fs)

export default {
  name: 'download-page',
  data () {
    return {
      client: null,
      items: []
    }
  },
  methods: {
    formatBytes: formatBytes,
    // 连接 ftp 服务器
    connect: async function (event) {
      console.log('正在登录')

      this.client = new BasicFTP.Client()
      try {
        await this.client.access({
          host: this.$store.state.Account.host,
          port: this.$store.state.Account.port,
          user: this.$store.state.Account.user,
          password: this.$store.state.Account.password,
          secure: false
        })
      } catch (err) {
        console.log(err)
        alert('连接 ftp 失败')
      }
    },
    clearItems: function () {
      this.$store.dispatch('DownloadList/clear', {})
      this.items = []
      alert('清空成功')
    },
    saveFile: function (item) {
      let fileName = item.name
      let ftpPath = item.path
      // fileName 是保存的文件的名字, ftpPath 是文件在 ftp 上的路径
      var options = {
        title: '保存文件',
        defaultPath: fileName,
        buttonLabel: '保存',
        filters: [{ name: 'All Files', extensions: ['*'] }]
      }

      dialog.showSaveDialog(options).then(res => {
        console.log(res)
        console.log(ftpPath)
        if (!res.canceled) {
          this.client.downloadTo(res.filePath, ftpPath)
        }
      })
    }
  },
  mounted: async function () {
    // 只能重新连接
    await this.connect()
    if (!this.client) {
      console.log('无效的 ftp, 回到首页')
      this.$router.replace({ path: '/' })
    }
    this.items = this.$store.state.DownloadList.data
  }
}
</script>

<style></style>
