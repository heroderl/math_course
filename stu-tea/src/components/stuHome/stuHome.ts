import Vue from 'vue';
import { Component, Watch } from 'vue-property-decorator'

/**
 * 父组件向此组件传递参数：height, liImgs: {src: NodeRequire, text: string, click: Function}[]
 * 此组件向父组件传递参数：
 */
@Component({
    props: ['height', 'liImgs']
})
export default class StuHome extends Vue {
    private ulNode: HTMLElement;
    private ulHeight: number;

    /* --------data------- */

    /* --------computed------- */
    get ulEl (): HTMLElement {
        return (this.$refs.ulBtn as HTMLElement);
    }

    /* --------methods------- */
    // 设置ul标签的位置
    setAttr (): void {
        this.ulHeight = this.ulNode.clientHeight || this.ulNode.offsetHeight;
        this.ulNode.style.top = [(this.$props.height / 2) - (this.ulHeight / 2)] + 'px';
    }

    /* --------watch------- */
    @Watch('height')
    heightChange (): void {
        // 数据及节点全部更新完后
        let that = this;
        this.$nextTick(function () {
            that.setAttr();
        });
    }

    /* --------生命周期钩子------- */
    mounted () {
        this.ulNode = this.ulEl;
    }
}
