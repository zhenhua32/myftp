<template>
  <section class="container section">
    <span @click="save">测试</span>
    <div>
      <span class="icon" title="主页" @click="getPaths('/')">
        <i class="fas fa-home"></i>
      </span>
      当前路径: <a title="/" @click="getPaths('/')">/</a>
      <template v-if="curPath !== '/'">
        <span
          v-for="(item, index) in curPath.slice(1, -1).split('/')"
          :key="index"
        >
          <a :title="buildPath(index)" @click="getPaths(buildPath(index))">{{
            item
          }}</a>
          /
        </span>
      </template>
    </div>
    <table class="table is-striped is-hoverable">
      <thead>
        <tr>
          <th>index</th>
          <th>文件名</th>
          <th>时间</th>
          <th>大小</th>
          <th>type</th>
        </tr>
      </thead>
      <tfoot>
        <tr>
          <th>index</th>
          <th>文件名</th>
          <th>时间</th>
          <th>大小</th>
          <th>type</th>
        </tr>
      </tfoot>

      <tbody>
        <!-- 需要研究下 FTP 协议, 才能知道每个字段的意思 -->
        <tr
          v-for="(item, index) in names"
          :key="index"
          @dblclick="item.type === 1 ? getPaths(curPath + item.name + '/') : {}"
        >
          <th>{{ index }}</th>
          <td>{{ item.name }}</td>
          <td>{{ new Date(item.time) }}</td>
          <td>{{ formatBytes(item.size) }}</td>
          <td>{{ item.type === 1 ? '目录' : '文件' }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script>
const JSFTP = require('jsftp')
const { dialog } = require('electron').remote
const fs = require('fs')
console.log(JSFTP)
export default {
  name: 'main-page',
  data () {
    return {
      ftp: null,
      names: [],
      curPath: '/'
    }
  },
  methods: {
    // 获取路径
    getPaths: function (filePath) {
      this.ftp.ls(filePath, (err, res) => {
        if (err) {
          console.log(err)
        } else {
          console.log(res)
          console.log(filePath)
          // 更新当前路径
          this.curPath = filePath
          // 更新文件列表
          this.names = res
          // 按字母排序
          this.names.sort(function (a, b) {
            if (a.name < b.name) {
              return -1
            } else if (a.name > b.name) {
              return 1
            }
            return 0
          })
        }
      })
    },
    // 连接 ftp 服务器
    connect: function () {
      this.ftp = new JSFTP({
        host: this.$store.state.Account.host,
        port: this.$store.state.Account.port,
        user: this.$store.state.Account.user,
        pass: this.$store.state.Account.password
      })
    },
    // 转换字节
    formatBytes: function formatBytes (bytes, decimals = 2) {
      if (bytes === 0) return '0 Bytes'

      const k = 1024
      const dm = decimals < 0 ? 0 : decimals
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

      const i = Math.floor(Math.log(bytes) / Math.log(k))

      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
    },
    // 构建部分路径
    buildPath: function (index) {
      return (
        '/' +
        this.curPath
          .slice(1, -1)
          .split('/')
          .slice(0, index + 1)
          .join('/') +
        '/'
      )
    },
    // 下载文件
    save: function () {
      var options = {
        title: '保存文件',
        defaultPath: 'my_filename',
        buttonLabel: '保存',
        filters: [
          { name: 'txt', extensions: ['txt'] },
          { name: 'All Files', extensions: ['*'] }
        ]
      }

      dialog.showSaveDialog(options, filename => {
        console.log(filename)
        if (filename) {
          fs.writeFileSync(filename, 'hello world', 'utf-8')
        }
      })
    }
  },
  mounted: function () {
    // TODO: 直接取出 ftp 没有用, 只能重新连接
    this.connect()
    if (!this.ftp) {
      console.log('无效的 ftp, 回到首页')
      this.$router.replace({ path: '/' })
    }
    this.getPaths('/')
  }
}
</script>

<style scoped></style>
