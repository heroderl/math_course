import { Vue, Component } from 'vue-property-decorator'
import $ from 'jquery'
import MathHeader from '@/components/math-header/math-header.vue'
import QuesList from '@/components/quesList/quesList.vue'
import ArticleComp from '../../assets/js/articleComp'
import config from '../../common/config'
import { Eapi } from '../../common/api'

@Component({
    components: {
        MathHeader,
        QuesList
    }
})
export default class QuesRecord extends Vue {
    private article: ArticleComp;

    data () {
        return {
            mathHeader: {
                btnFlag: true,
                headerName: '试题列表',
                btnName: '返回'
            },
            date: Array(0),
            list: Array(0),
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

    // 为data里的date赋值
    pushDate (year: number, month: number, day: number): void {
        let temp = (this.$data.date as {year: number, month: {month: number, day: number[]}[]}[]);
        let yflag = false;
        let mflag = false;
        let dflag = false;

        for (let i = 0; i < temp.length; i++) {
            if (temp[i].year === year) {
                // 存在年
                yflag = true;

                for (let j = 0; j < temp[i].month.length; j++) {
                    let monthTemp = temp[i].month[j];
                    if (monthTemp.month === month) {
                        // 存在月
                        mflag = true;

                        for (let k = 0; k < monthTemp.day.length; k++) {
                            let dayTemp = monthTemp.day[k];
                            if (dayTemp === day) {
                                // 存在日
                                dflag = true;
                            }
                        }

                        if (!dflag) {
                            // 不存在日
                            temp[i].month[j].day.push(day);
                        }
                    }
                }

                if (!mflag) {
                    // 不存在月
                    temp[i].month.push({
                        month, day: [day]
                    });
                }
            }
        }

        if (!yflag) {
            // 不存在年
            temp.push({
                year, month: [
                    {
                        month, day: [ day ]
                    }
                ]
            });
        }
    }

    // ajax请求所有试题数据
    initData (): void {
        let postURL = 'http://' + config().host + ':' + config().post + '/' + config().project + '/' + config().api + '/' + Eapi.quesRecordInit
        let that = this;

        $.ajax({
            url: postURL,
            type: 'post',
            dataType: 'json',
            timeout: 10000,
            success: (data: {code: number, message: string, data: [{'q_NO': string, 'q_board': string, 'q_content': string, 'q_id': string, 'q_other': string, 'q_state': string, 'q_time': string | string[]}]}) => {
                for (let item of data['data']) {
                    let reg = /(\d+)-(\d+)-(\d+)/;
                    let arr = reg.exec(item['q_time'] as string);

                    item['q_time'] = [arr[1], arr[2], arr[3]];
                    that.pushDate(parseInt(arr[1], 10), parseInt(arr[2], 10), parseInt(arr[3], 10))
                }

                data['data'].sort(function (a, b): number {
                    return parseInt(b['q_id'], 10) - parseInt(a['q_id'], 10);
                });

                this.$data.list = data['data'];
            },
            error: (xml, status, err) => {
            },
            complete: (xml, status) => {
                if (status === 'timeout' || status === 'error') {
                    console.log('网络连接失败');
                }
            }
        });
    }

    mounted () {
        this.setArticle();  // 设置article高度
        this.getArtHeig();  // 获取article高度
        this.winChange();
        this.initData();  // ajax请求所有试题数据
    }
}
