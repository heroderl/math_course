import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import $ from 'jquery'

/**
 * 父组件向此组件传递参数：liImgs: src[]
 * 此组件向父组件传递参数：
 */
@Component({
    props: ['liImgs']
})
export default class ImgDisplay extends Vue {
    data () {
        return {
            showAside: false,  // 控制aside节点的显示隐藏
            imgSrc: ''  // 图片的路径
        }
    }

    // 设置data的showAside为true或false
    get getAside (): boolean {
        return this.$data.showAside;
    }
    set getAside (flag: boolean) {
        this.$data.showAside = flag;
    }

    @Watch('showAside')
    listShowAside () {
        let that = this;
        this.$nextTick(function () {
            if (that.getAside) {
                that.setImgSrc();
                that.adjImgSize();
            }
        });
    }

    // 点击展示图片
    showImg (src: string): void {
        if (!src && (typeof(src) === 'undefined' || typeof(src) === 'object')) {
            this.$data.imgSrc = '';
        } else {
            this.$data.imgSrc = src;
        }

        if (this.getAside) {
            // 隐藏展示
            this.getAside = false;
        } else {
            // 显示展示
            this.getAside = true;
        }
    }

    // 设置aside>img的src
    setImgSrc (): void {
        if (this.getAside) {
            (this.$refs.asideImg as HTMLImageElement).src = this.$data.imgSrc;
        }
    }

    // 调整图片大小
    adjImgSize (): void {
        if (this.getAside) {
            let imgNode = (this.$refs.asideImg as HTMLImageElement);
            this.getImgNaturalDimensions(imgNode, function (dimensions: { width: number, height: number }) {
                let imgWidth = dimensions.width;
                let imgHeight = dimensions.height;
                let width = $('aside.showImg').width();
                let height = $('aside.showImg').height();

                if ((imgWidth / imgHeight) > (width / height)) {
                    if (imgWidth < width) {
                        $('aside.showImg>img').css('width', imgWidth + 'px');
                        $('aside.showImg>img').css('height', imgHeight + 'px');
                        $('aside.showImg>img').css('margin-top', (height - imgHeight) / 2 + 'px');
                    } else {
                        $('aside.showImg>img').css('width', width + 'px');
                        $('aside.showImg>img').css('height', (width * imgHeight / imgWidth) + 'px');
                        $('aside.showImg>img').css('margin-top', (height - (width * imgHeight / imgWidth)) / 2 + 'px');
                    }
                } else {
                    if (imgHeight < height) {
                        $('aside.showImg>img').css('width', imgWidth + 'px');
                        $('aside.showImg>img').css('height', imgHeight + 'px');
                        $('aside.showImg>img').css('margin-top', (height - imgHeight) / 2 + 'px');
                    } else {
                        $('aside.showImg>img').css('width', (imgWidth * height / imgHeight) + 'px');
                        $('aside.showImg>img').css('height', height + 'px');
                    }
                }
            });
        }
    }

    // 获取图片的原始大小
    getImgNaturalDimensions (oImg: HTMLImageElement, callback: Function) {
        let nWidth: number;
        let nHeight: number;

        if (oImg.naturalWidth) {
            nWidth = oImg.naturalWidth;
            nHeight = oImg.naturalHeight;

            callback({ width: nWidth, height: nHeight });
        } else {
            let nImg = new Image();

            nImg.onload = function () {
                nWidth = nImg.width;
                nHeight = nImg.height;

                callback({ width: nWidth, height: nHeight });
            };
            nImg.src = oImg.src;
        }
    }
}
