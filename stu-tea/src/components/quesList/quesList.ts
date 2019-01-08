import { Vue, Component, Watch } from 'vue-property-decorator'

/**
 * 父组件向此组件传递参数：date[{year, month[{month, day[]}]}], list['id', 'content', 'state', 'time]
 * 此组件向父组件传递参数：
 */
@Component({
    props: ['date']
})
export default class QuesList extends Vue {
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

    getYear (): number[] {
        let temp: [{'year': number, 'month': [{'month': number, day: number[]}]}] = this.$data.dDate;
        let arr = [];

        for (let item of temp) {
            arr.push(item.year);
        }

        return arr;
    }

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

    mounted() {
    }
}
