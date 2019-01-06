import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import MathHeader from '@/components/math-header/math-header.vue'
import ImgDisplay from '@/components/imgDisplay/imgDisplay.vue'
import ArticleComp from '../../assets/js/articleComp'

@Component({
    components: {
        MathHeader,
        ImgDisplay
    }
})
export default class ImgRecord extends Vue {
    private article: ArticleComp;

    data () {
        return {
            mathHeader: {
                btnFlag: true,
                headerName: '查看记录',
                btnName: '返回'
            },
            imgDisplay: {
                liImgs: [
                    '../../../static/image/beijing2.png', '../../../static/image/beijing.png', '../../../static/image/huaban.png'
                ]
            },
            articleHeight: 0
        }
    }

    // 设置article标签的高度
    setArticle (): void {
        this.article = new ArticleComp(this.$refs.content as HTMLElement);
        this.article.setAttr();
    }

    // 获取article标签的高度
    getArtHeig (): void {
        this.$data.articleHeight = this.article.getArtHeig();
    }

    // 当窗口改变时，article标签的高度也随着改变
    winChange (): void {
        let that = this;
        window.onresize = function () {
            that.setArticle();
            that.getArtHeig();
        };
    }

    mounted () {
        this.setArticle();  // 设置article高度
        this.getArtHeig();  // 获取article高度
        this.winChange();
    }
}
