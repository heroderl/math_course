import Vue from 'vue'
import Router from 'vue-router'
import StuIndex from '../../views/stuIndex/index.vue'
import ImgRecord from '../../views/imgRecord/index.vue'
import Paint from '../../views/paint/index.vue'

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        {
            name: 'StuIndex',
            path: '/',
            component: StuIndex
        },
        {
            name: 'ImgRecord',
            path: '/ImgRecord',
            component: ImgRecord
        },
        {
            name: 'Paint',
            path: '/Paint',
            component: Paint
        }
    ]
})
