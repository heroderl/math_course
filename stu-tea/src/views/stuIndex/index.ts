import Vue from 'vue';
import { Component, Watch } from 'vue-property-decorator'
import MathHeader from '@/components/math-header/math-header.vue'
import StuHome from '@/components/stuHome/stuHome.vue'
import ArticleComp from '../../assets/js/articleComp'

@Component({
    components: {
        MathHeader,
        StuHome
    }
})
export default class StuIndex extends Vue {
    private article: ArticleComp;

    /*----------data----------*/
    data () {
        return {
            btnFlag: false,
            btnName: '返回',
            headerName: '首页',
            articleHeight: 0,
            liImgs: [
                {
                    click: this.goPaint,
                    src: require('../../../static/image/huaban.png'),
                    text: '新建画板'
                },
                {
                    click: this.goImgRecord,
                    src: require('../../../static/image/jilu.png'),
                    text: '查看記錄'
                }
            ]
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

    // 跳转到画板页面
    goPaint (): void {
        this.$router.push({ name: 'Paint' });
    }

    // 跳转到查看记录页面
    goImgRecord (): void {
        this.$router.push({ name: 'ImgRecord' });
    }

    mounted () {
        this.setArticle();  // 设置article高度
        this.getArtHeig();  // 获取article高度
        this.winChange();
    }
}
