import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/helloworld/HelloWorld.vue'

// 如果使用模块化机制编程，导入Vue和VueRouter，要调用 Vue.use(VueRouter)
Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'HelloWorld',
            component: HelloWorld
        }
    ]
})

// 1、定义路由，每个路由映射一个组件
// const routes = [
//   {
//     path: '/',
//     name: 'HelloWorld',
//     component: HelloWorld
//   }
// ]

// 2、创建router实例，然后传routes配置
// const router = new Router({
//   routes: routes
// })

// 3、创建和挂载根实例
// 记得要通过 router 配置参数注入路由，
// 从而让整个应用都有路由功能
// new Vue({
//   router: router
// }).$mount('#app')
