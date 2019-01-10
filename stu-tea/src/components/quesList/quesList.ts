import { Vue, Component, Watch } from 'vue-property-decorator'
import { EIdentity, Socket } from '../../assets/js/socket'

/**
 * 父组件向此组件传递参数：date[{year, month[{month, day[]}]}], list['id', 'content', 'state', 'time]
 * 此组件向父组件传递参数：
 */
@Component({
    props: ['date', 'list']
})
export default class QuesList extends Vue {
    private socket: Socket;

    constructor () {
        super();
        this.socket = new Socket(EIdentity.teacher);
    }

    data () {
        return {
            dDate: this.$props.date,
            year: -1,
            month: -1,
            day: -1
        }
    }

    @Watch('year')
    wYear () {
        this.$data.month = -1;
        this.$data.day = -1;
    }

    @Watch('month')
    wMonth () {
        this.$data.day = -1;
    }

    @Watch('list')
    wList () {
        let param = this.getPushQeus();
        // this.socket.send(param.status, param.qid);
    }

    // select的年
    getYear (): number[] {
        let temp: [{'year': number, 'month': [{'month': number, day: number[]}]}] = this.$data.dDate;
        let arr = [];

        for (let item of temp) {
            arr.push(item.year);
        }

        return arr;
    }

    // select的月
    getMonth (year: number): number[] {
        let temp: [{'year': number, 'month': [{'month': number, day: number[]}]}] = this.$data.dDate;
        let arr = [];

        year = parseInt(year + '', 10);

        if (year === -1) {
            // 表示year为全部
            this.$data.month = -1;
            this.$data.day = -1;
        } else {
            for (let item of temp[year].month) {
                arr.push(item.month);
            }
        }

        return arr;
    }

    // select的日
    getDay (year: number, month: number): number[] {
        let temp: [{'year': number, 'month': [{'month': number, day: number[]}]}] = this.$data.dDate;
        let arr = [];

        year = parseInt(year + '', 10);
        month = parseInt(month + '', 10);

        if (year === -1) {
            // 表示year为全部
            this.$data.month = -1;
            this.$data.day = -1;
        } else if (month === -1) {
            // 表示month为全部
            this.$data.day = -1;
        } else {
            for (let item of temp[year].month[month].day) {
                arr.push(item);
            }
        }

        return arr;
    }

    // 根据日期查询试题列表
    queryQuesOfDate (): [] {
        let tempArr = [];

        // tslint:disable-next-line:triple-equals
        if (this.$data.year == -1) {
            // 显示所有年份的试题
            let virtualYear = this.$data.dDate[this.$data.year];
            tempArr = this.$props.list;

        // tslint:disable-next-line:triple-equals
        } else if (this.$data.month == -1) {
            // 显示某一年的试题
            let virtualYear = this.$data.dDate[this.$data.year].year;

            for (let item of this.$props.list) {
                if (parseInt(item['q_time'][0], 10) === virtualYear) {
                    tempArr.push(item);
                }
            }

        // tslint:disable-next-line:triple-equals
        } else if (this.$data.day == -1) {
            // 显示某一月的试题
            let virtualYear = this.$data.dDate[this.$data.year].year;
            let virtualMonth = this.$data.dDate[this.$data.year].month[this.$data.month].month;

            for (let item of this.$props.list) {
                if (parseInt(item['q_time'][0], 10) === virtualYear && parseInt(item['q_time'][1], 10) === virtualMonth) {
                    tempArr.push(item);
                }
            }

        } else {
            // 显示某一天的试题
            let virtualYear = this.$data.dDate[this.$data.year].year;
            let virtualMonth = this.$data.dDate[this.$data.year].month[this.$data.month].month;
            let virtualDay = this.$data.dDate[this.$data.year].month[this.$data.month].day[this.$data.day];

            for (let item of this.$props.list) {
                if (parseInt(item['q_time'][0], 10) === virtualYear && parseInt(item['q_time'][1], 10) === virtualMonth && parseInt(item['q_time'][2], 10) === virtualDay) {
                    tempArr.push(item);
                }
            }
        }

        return tempArr;
    }

    // 判断是否处于推送中
    isPush (state: number): boolean {
        if (!state) {
            // 推送结束
            return true;
        } else {
            // 推送中
            return false;
        }
    }

    // 获取当前推送的试题
    getPushQeus (): {status: boolean, qid: number} {
        for (let item of this.$props.list) {
            // tslint:disable-next-line:no-extra-boolean-cast
            if (!!parseInt(item['q_state'], 10)) {
                // 存在推送中
                return { status: true, qid: parseInt(item['q_id'], 10) };
            }
        }

        // 存在推送结束
        return { status: false, qid: 0 };
    }

    // ajax推送试题
    remotePush (e: Event): void {
        let qid = e.srcElement.parentElement.getAttribute('data-qid');
        let flag = false;

        for (let item of this.$props.list) {
            // tslint:disable-next-line:no-extra-boolean-cast
            if (!!parseInt(item['q_state'], 10)) {
                // 存在推送中
                flag = true;
                // 判断当前按钮
                if (item['q_id'] === qid) {
                    // 请求结束推送
                    // console.log('发送ajax请求结束推送');
                    this.socket.send(false, 0);
                } else {
                    // 有试题在推送中，请结束推送
                    alert('有试题在推送中');
                }

                break;
            }
        }

        // 如果不存在试题推送
        if (!flag) {
            // 请求开始推送
            // console.log('发送ajax请求开始推送');
            this.socket.send(true, parseInt(qid, 10));
        }
    }
}
