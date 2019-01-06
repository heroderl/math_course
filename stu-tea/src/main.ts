// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import router from './router/'

Vue.config.productionTip = false

// 全局注册
Vue.component('app', App)

// tslint:disable-next-line:no-unused-expression
new Vue({
    el: '#app',
    router,
    render: (createElement) => createElement(App)
})
