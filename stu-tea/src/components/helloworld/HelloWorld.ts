import Vue from 'vue'
import { Component } from 'vue-property-decorator'
// State 存数据；Getter 类似于计算属性；Mutation 类似于事件，用来改变state的值；Action 提交mutation；module 可以将store分割成模块，每个模块中拥有自己的state、mutation、action和getter
import { State, Getter, Mutation, Action } from 'vuex-class'

@Component
export default class HelloWorld extends Vue {
    name: string = '你好'
    @State login: boolean
    @Getter load: boolean
    @Action initAjax: () => void

    // computed
    get MyName (): string {
        return this.name
    }
    get isLogin (): boolean {
        return this.login
    }

    // methods
    sayHello (): void {
        console.log(this.name)
    }

    // 生命周期
    mounted () {
        this.sayHello()
        this.initAjax()
    }
}
