import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import MathHeader from '@/components/math-header/math-header.vue'
import ArticleComp from '../../assets/js/articleComp'
import MyCanvas from '../../assets/js/canvas/myCanvas'
import $ from 'jquery'

@Component({
    components: {
        MathHeader
    }
})
export default class Paint extends Vue {
    private article: ArticleComp;
    private canvas: MyCanvas;

    data () {
        return {
            mathHeader: {
                btnFlag: true,
                headerName: '画板',
                btnName: '返回'
            },
            articleHeight: 0,
            infoFlag: false
        }
    }

    // 设置inforMask的宽度和高度
    @Watch('infoFlag')
    infoMaskVetical () {
        this.$nextTick(function () {
            let inforAttr = this.getInforWH();
            let maskAttr = this.getMaskWH();
            let top = (inforAttr.height - maskAttr.height) / 2;
            let left = (inforAttr.width - maskAttr.width) / 2;

            top = top < 0 ? 0 : top;
            left = left < 0 ? 0 : left;

            $('.inforMask').css({
                'top': top + 'px',
                'left': left + 'px'
            });
        });
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

    // 获取.box_content的宽高
    boxContent (): {width: number, height: number} {
        let node = $('.box_content');
        return { width: node.width(), height: node.height() };
    }

    // 获取inforPanel的宽度和高度
    getInforWH (): { width: number, height: number } {
        return {
            width: $('aside.inforPanel').width(),
            height: $('aside.inforPanel').height()
        };
    }

    // 获取infoMask的宽度和高度
    getMaskWH (): { width: number, height: number } {
        return {
            width: $('.inforMask').width() + parseFloat($('.inforMask').css('padding-left')) * 2,
            height: $('.inforMask').height() + parseFloat($('.inforMask').css('padding-top')) * 2
        };
    }

    // 设置inforMask的显示或隐藏
    isShowMask () {
        if (this.$data.infoFlag) {
            // 隐藏
            this.$data.infoFlag = false;
        } else {
            // 显示
            this.$data.infoFlag = true;
        }
    }

    // 当窗口改变时，article标签的高度也随着改变
    winChange (): void {
        let that = this;
        window.onresize = function () {
            that.setArticle();
            that.getArtHeig();
            that.structure();
            that.infoMaskVetical();
            that.setPaintAttr();
        };
    }

    // 设置结构
    structure (): void {
        let assistWidth = $('article.assistPanel').width();
        let assistHeight = $('article.assistPanel').height();
        let toolWidth = $('article.toolPanel').width();
        $('article.questPanel').css('width', (this.boxContent().width - assistWidth - 2) + 'px');
        $('article.canvasPanel').css('width', (this.boxContent().width - toolWidth - 2) + 'px');
        $('article.canvasPanel').css('height', (this.boxContent().height - assistHeight - 2) + 'px');
        $('article.toolPanel').css('height', (this.boxContent().height - assistHeight - 2) + 'px');
    }

    // 设置画板的宽度和高度
    setPaintAttr (): void {
        let width = $('article.canvasPanel').width();
        let height = $('article.canvasPanel').height();
        $('#myCanvas').attr({ width, height });
    }

    // 画板
    paint (): void {
        this.canvas = new MyCanvas();
        this.canvas.startListen();
        this.canvas.moveListen();
        this.canvas.endListen();
        this.canvas.clickListen();
    }

    mounted () {
        this.setArticle();  // 设置article高度
        this.getArtHeig();  // 获取article高度
        this.structure();  // 设置结构
        this.infoMaskVetical();  // 设置inforMask的宽度和高度
        this.setPaintAttr();  // // 设置画板的宽度和高度
        this.winChange();
        this.paint();
    }
}
