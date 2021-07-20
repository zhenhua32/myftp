<template>
  <section class="container section">
    <!-- 定义操作栏 -->
    <div class="columns">
      <div class="column is-8">
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
      <div class="column">
        <router-link to="/">
          <span class="icon" title="退出">
            <!-- https://fontawesome.com/icons 去这边搜免费版的 icon, 注意使用时加 fa- 前缀 -->
            <i class="fas fa-sign-out-alt"></i>
          </span>
          登录页面
        </router-link>
      </div>
      <div class="column">
        <router-link to="/download">
          <span class="icon" title="下载">
            <!-- https://fontawesome.com/icons 去这边搜免费版的 icon, 注意使用时加 fa- 前缀 -->
            <i class="fas fa-download"></i>
          </span>
          下载列表
        </router-link>
      </div>
    </div>

    <!-- 搜索框 -->
    <div class="columns">
      <div class="column">
        <input
          v-model="searchText"
          class="input"
          type="text"
          placeholder="搜索当前目录"
        />
      </div>
    </div>

    <!-- 定义文件列表展示区 -->
    <div class="table-container">
      <table class="table is-striped is-hoverable is-fullwidth">
        <thead>
          <tr>
            <th>index</th>
            <th>文件名</th>
            <th>时间</th>
            <th>大小</th>
            <th>type</th>
            <th>操作</th>
          </tr>
        </thead>
        <tfoot>
          <tr>
            <th>index</th>
            <th>文件名</th>
            <th>时间</th>
            <th>大小</th>
            <th>type</th>
            <th>操作</th>
          </tr>
        </tfoot>

        <tbody>
          <!-- TODO: 需要研究下 FTP 协议, 才能知道每个字段的意思 -->
          <tr
            v-for="(item, index) in filterNames"
            :key="index"
            @dblclick="
              item.type === 1 ? getPaths(curPath + item.name + '/') : {}
            "
          >
            <th>{{ index }}</th>
            <td v-if="item.type === 1">
              <a>{{ item.name }}</a>
            </td>
            <td v-else>
              {{ item.name }}
            </td>
            <td>{{ new Date(item.time) }}</td>
            <td>{{ formatBytes(item.size) }}</td>
            <td>{{ item.type === 1 ? '目录' : '文件' }}</td>
            <td>
              <button
                v-if="item.type === 0"
                class="button is-small"
                @click="saveFile(item.name, curPath + item.name)"
              >
                直接下载
              </button>
              <button
                v-if="item.type === 0"
                class="button is-small"
                @click="addDownloadItem(item.name, curPath + item.name, item.size)"
              >
                加入列表
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
const { dialog } = require('electron').remote
const fs = require('fs')
const { formatBytes } = require('../../tools/helper')
console.log(JSFTP)
console.log(fs)
export default {
  name: 'main-page',
  data () {
    return {
      ftp: null,
      names: [],
      curPath: '/',
      searchText: ''
    }
  },
  computed: {
    filterNames: function () {
      let searchText = this.searchText.toLowerCase()
      return this.names.filter(info =>
        info.name.toLowerCase().includes(searchText)
      )
    }
  },
  methods: {
    // 获取路径
    getPaths: function (filePath) {
      this.ftp.ls(filePath, (err, res) => {
        if (err) {
          console.log(err)
          alert(err.text)
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
    formatBytes: formatBytes,
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
    saveFile: function (fileName, ftpPath) {
      // fileName 是保存的文件的名字, ftpPath 是文件在 ftp 上的路径
      var options = {
        title: '保存文件',
        defaultPath: fileName,
        buttonLabel: '保存',
        filters: [{ name: 'All Files', extensions: ['*'] }]
      }

      dialog.showSaveDialog(options).then(res => {
        console.log(res.canceled)
        console.log(res.filePath)
        console.log(ftpPath)
        if (!res.canceled) {
          var buf = Buffer.from([])
          this.ftp.get(ftpPath, (err, socket) => {
            if (err) {
              return
            }
            socket.on('data', d => {
              buf = Buffer.concat([buf, d])
            })
            socket.on('close', err => {
              if (err) {
                console.error('There was an error retrieving the file.')
              } else {
                fs.writeFileSync(res.filePath, buf)
              }
            })
            socket.resume()
          })
        }
      })
    },
    // 添加到下载列表
    addDownloadItem: function (fileName, ftpPath, fileSize) {
      var item = {
        name: fileName,
        path: ftpPath,
        size: fileSize,
        status: null
      }
      this.$store.dispatch('DownloadList/addItem', {
        item: item
      })
      alert('添加成功')
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
