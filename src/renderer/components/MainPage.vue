<template>
  <section class="container section">
    <table class="table">
      <thead>
        <tr>
          <th>index</th>
          <th>文件名</th>
        </tr>
      </thead>
      <tfoot>
        <tr>
          <th>index</th>
          <th>文件名</th>
        </tr>
      </tfoot>
      <tbody>
        <!-- 需要研究下 FTP 协议, 才能知道每个字段的意思 -->
        <tr v-for="(item, index) in paths" :key="index">
          <th>{{ index }}</th>
          <td>{{ item.name }}</td>
        </tr>
        <tr>
          <th>1</th>
          <td>
            <a
              href="https://en.wikipedia.org/wiki/Leicester_City_F.C."
              title="Leicester City F.C."
              >Leicester City</a
            >
            <strong>(C)</strong>
          </td>
          <td>38</td>
          <td>23</td>
          <td>12</td>
          <td>3</td>
          <td>68</td>
          <td>36</td>
          <td>+32</td>
          <td>81</td>
          <td>
            Qualification for the
            <a
              href="https://en.wikipedia.org/wiki/2016%E2%80%9317_UEFA_Champions_League#Group_stage"
              title="2016–17 UEFA Champions League"
              >Champions League group stage</a
            >
          </td>
        </tr>
        <tr>
          <th>2</th>
          <td>
            <a
              href="https://en.wikipedia.org/wiki/Arsenal_F.C."
              title="Arsenal F.C."
              >Arsenal</a
            >
          </td>
          <td>38</td>
          <td>20</td>
          <td>11</td>
          <td>7</td>
          <td>65</td>
          <td>36</td>
          <td>+29</td>
          <td>71</td>
          <td>
            Qualification for the
            <a
              href="https://en.wikipedia.org/wiki/2016%E2%80%9317_UEFA_Champions_League#Group_stage"
              title="2016–17 UEFA Champions League"
              >Champions League group stage</a
            >
          </td>
        </tr>
        <tr>
          <th>3</th>
          <td>
            <a
              href="https://en.wikipedia.org/wiki/Tottenham_Hotspur_F.C."
              title="Tottenham Hotspur F.C."
              >Tottenham Hotspur</a
            >
          </td>
          <td>38</td>
          <td>19</td>
          <td>13</td>
          <td>6</td>
          <td>69</td>
          <td>35</td>
          <td>+34</td>
          <td>70</td>
          <td>
            Qualification for the
            <a
              href="https://en.wikipedia.org/wiki/2016%E2%80%9317_UEFA_Champions_League#Group_stage"
              title="2016–17 UEFA Champions League"
              >Champions League group stage</a
            >
          </td>
        </tr>
        <tr class="is-selected">
          <th>4</th>
          <td>
            <a
              href="https://en.wikipedia.org/wiki/Manchester_City_F.C."
              title="Manchester City F.C."
              >Manchester City</a
            >
          </td>
          <td>38</td>
          <td>19</td>
          <td>9</td>
          <td>10</td>
          <td>71</td>
          <td>41</td>
          <td>+30</td>
          <td>66</td>
          <td>
            Qualification for the
            <a
              href="https://en.wikipedia.org/wiki/2016%E2%80%9317_UEFA_Champions_League#Play-off_round"
              title="2016–17 UEFA Champions League"
              >Champions League play-off round</a
            >
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script>
const JSFTP = require('jsftp')
console.log(JSFTP)
export default {
  name: 'main-page',
  data () {
    return {
      ftp: null,
      paths: []
    }
  },
  methods: {
    getPaths: function (filePath) {
      this.ftp.ls(filePath, (err, res) => {
        if (err) {
          console.log(err)
        } else {
          console.log(res)
          this.paths = res
          // 按字母排序
          this.paths.sort(function (a, b) {
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
