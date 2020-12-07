// put advanced Vue/webpack options into this file
// see https://cli.vuejs.org/config/#vue-config-js

module.exports = {
    // in production we load the Vue subsite under /newvue
    // see also the Vue.Router init in main.js (which sets its base: from here)
    publicPath: process.env.NODE_ENV === 'production'
      ? '/newvue'
      : '/'
}
