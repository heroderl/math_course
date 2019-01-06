import Vue from 'vue';
import { Component, Watch } from 'vue-property-decorator'

/**
 * 父组件向此组件传递参数：title, btnName, isShowBtn
 * 此组件向父组件传递参数：
 */
@Component({
    props: ['title', 'btnName', 'isShowBtn']
})
export default class MathHeader extends Vue {
    // 按钮的返回
    retBtn (): void {
        this.$router.go(-1);
    }
}
