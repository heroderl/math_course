import { Tools, InterCircular, InterFan } from './interface/inter-toolslib';

/**
 * 存放canvas上的图形数据
 */
export class CanvasData {
    private data: Array<Tools>;  // 存放数据

    constructor() {
        this.data = [];
    }

    /*
    * 存放数据
    * @param: data 类型为Tools
    */
    setData(data: Tools): void {
        this.data.push(data);
    }

    /*
    * 获取数据
    * @param: item 可选，表示数组下标
    */
    getData(item?: number): Tools | Array<Tools> {
        if (typeof(item) !== 'undefined' && item < this.data.length) {
            return this.data[item];
        } else {
            return this.data;
        }
    }

    /*
    * 删除数据
    * @param: item 可选，表示数组下标 [(点、线段、圆), (扇形、半径), (弦)]
    */
    delData(item?: Array<number>): Tools {
        if (!item || item.length === 0) {
            return this.data.pop();
        } else if (item.length === 1 && item[0] < this.data.length) {
            let value: Tools = this.getData(item[0]) as Tools;
            this.data.splice(item[0], 1);
            return value;
        } else if (item.length === 2 && item[0] < this.data.length && item[1] < (this.data[item[0]] as InterCircular).fanAndRadius.length) {
            let value: Tools = (this.getData(item[0]) as InterCircular).fanAndRadius[item[1]];
            (this.data[item[0]] as InterCircular).fanAndRadius.splice(item[1], 1);
            return value;
        } else if (item.length === 3 && item[0] < this.data.length && item[1] < (this.data[item[0]] as InterCircular).fanAndRadius.length) {
            let value: Tools = ((this.getData(item[0]) as InterCircular).fanAndRadius[item[1]] as InterFan).hasChord;
            ((this.data[item[0]] as InterCircular).fanAndRadius[item[1]] as InterFan).hasChord.isShow = false;
            return value;
        }
    }
}