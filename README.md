# myftp

## 技术栈

- [Electron](https://www.electronjs.org/docs) 桌面客户端
- [electron-vue](https://legacy.gitbook.com/book/simulatedgreg/electron-vue) 整合 electron 和 vue
- [Vue](https://cn.vuejs.org/v2/guide/routing.html) 前端框架
- [Vue Router](https://router.vuejs.org/zh/guide/#html) Vue 的路由组件
- [Vuex](https://vuex.vuejs.org/zh/) Vue 的全局状态管理
- [Vuex Electron](https://github.com/vue-electron/vuex-electron#installation) 整合 electron 和 vuex
- [jsftp](https://github.com/sergi/jsftp) FTP 客户端库, bug 太多, 弃用
- [bulma](https://bulma.io/documentation/) CSS 框架
- [Basic FTP](https://github.com/patrickjuchli/basic-ftp#readme) FTP 客户端库

## 构建

默认使用 yarn 吧.

```bash
# 添加库
yarn add @fortawesome/fontawesome-free
```

```bash
# install dependencies
npm install

# serve with hot reload at localhost:9080
npm run dev

# build electron application for production
npm run build

# run unit & end-to-end tests
npm test


# lint all JS/Vue component files in `src/`
npm run lint

```

---

This project was generated with [electron-vue](https://github.com/SimulatedGREG/electron-vue)@[45a3e22](https://github.com/SimulatedGREG/electron-vue/tree/45a3e224e7bb8fc71909021ccfdcfec0f461f634) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).
