import Vue from "vue"
import App from "./App.vue"
import VueMeta from "vue-meta"
import router from "./router/router"
import store from "./store"

Vue.config.productionTip = false

Vue.use(
  VueMeta, {
    refreshOnceOnNavigation: true
  }
)

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
