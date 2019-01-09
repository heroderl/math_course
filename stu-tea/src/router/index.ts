import Vue from 'vue'
import Router from 'vue-router'
import StuIndex from '../views/stuIndex/index.vue'
import Paint from '../views/paint/index.vue'
import ImgRecord from '../views/imgRecord/index.vue'
import TeaIndex from '../views/teaIndex/index.vue'
import QuesRecord from '../views/quesRecord/index.vue'

// 如果使用模块化机制编程，导入Vue和VueRouter，要调用 Vue.use(VueRouter)
Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        {
            name: 'StuIndex',
            path: '/StuIndex',
            component: StuIndex,
            meta: false
        },
        {
            name: 'Paint',
            path: '/StuIndex/Paint',
            component: Paint,
            meta: false
        },
        {
            name: 'ImgRecord',
            path: '/StuIndex/ImgRecord',
            component: ImgRecord,
            meta: false
        },
        {
            name: 'TeaIndex',
            path: '/TeaIndex',
            component: TeaIndex,
            meta: false
        },
        {
            name: 'TPaint',
            path: '/TeaIndex/Paint',
            component: Paint,
            meta: false
        },
        {
            name: 'TQuesRecord',
            path: '/TeaIndex/QuesRecord',
            component: QuesRecord,
            meta: false
        },
        {
            name: 'TImgRecord',
            path: '/TeaIndex/ImgRecord',
            component: ImgRecord,
            meta: false
        }
    ]
})
