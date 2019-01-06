import Vue from 'vue'
import Router from 'vue-router'
import StuIndex from '../views/stuIndex/index.vue'
import Paint from '../views/paint/index.vue'
import ImgRecord from '../views/imgRecord/index.vue'
import TeaIndex from '../views/teaIndex/index.vue';

// 如果使用模块化机制编程，导入Vue和VueRouter，要调用 Vue.use(VueRouter)
Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        {
            name: 'StuIndex',
            path: '/StuIndex',
            component: StuIndex
        },
        {
            name: 'Paint',
            path: '/StuIndex/Paint',
            component: Paint
        },
        {
            name: 'ImgRecord',
            path: '/StuIndex/ImgRecord',
            component: ImgRecord
        },
        {
            name: 'TeaIndex',
            path: '/TeaIndex',
            component: TeaIndex
        }
    ]
})
