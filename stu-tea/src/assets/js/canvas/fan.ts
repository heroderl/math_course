import { ToolsName, Color, Attribute } from './enum/enum-configlib';
import { InterFan, Tools, InterCircular, InterChord } from './interface/inter-toolslib';
import { RePaint } from './rePaint';
import { ButtonListen } from './buttonListen';
import { CanvasData } from './canvasData';
import { CanvasChoosed } from './canvasChoosed';
import { Intersect } from './intersect';

/**
 * 画扇形过程
 * false, 0
 * move(false, 0)
 * start(true, 1) --> move(true, 1) --> end(false, 2)
 * move(false, 2)
 * start(true, 3) --> move(true, 3) --> end(false, 0)
 */
export class Fan implements InterFan {
    flag: ToolsName;  // 标志
    x: number;  // 起点x的坐标
    y: number;  // 起点y的坐标
    r: number;  // 半径
    isChoosed: boolean;  // true表示图形被选中，false表示未被选中
    startAngle: number;  // 表示起始角，单位为弧度
    endAngle: number;  // 表示结束角，单位为弧度
    fillStyle: string;  // 填充的颜色
    anticlockwise?: boolean;  // false表示顺时针(默认)，true表示逆时针
    hasChord: InterChord;  // 存放扇形上的弦

    private isMobild: boolean;  // true为移动端，false为PC端
    private myCanvas: CanvasRenderingContext2D;  // canvas对象
    private myCanvasNode: HTMLElement;  // canvas节点
    private rePaint: RePaint;  // 重绘图形
    private eventFlag: boolean;  // true表示开始点击，false表示结束点击
    private eventCount: number;  // 点击次数
    private buttonListen: ButtonListen;  // 按钮监听事件
    private canvasData: CanvasData;  // canvas图形数据
    private canvasChoosed: CanvasChoosed;  // 选中图形
    private intersect: Intersect;  // 相交

    constructor(isMobild: boolean, myCanvas: CanvasRenderingContext2D, myCanvasNode: HTMLElement, rePaint: RePaint, buttonListen: ButtonListen, canvasData: CanvasData, canvasChoosed: CanvasChoosed, intersect: Intersect) {
        this.flag = ToolsName.fan;
        this.isMobild = isMobild;
        this.myCanvas = myCanvas;
        this.myCanvasNode = myCanvasNode;
        this.eventFlag = false;
        this.eventCount = 0;
        this.anticlockwise = false;
        this.canvasData = canvasData;
        this.rePaint = rePaint;
        this.buttonListen = buttonListen;
        this.isChoosed = false;
        this.canvasChoosed = canvasChoosed;
        this.fillStyle = Color.default;
        this.intersect = intersect;
    }

    /**
     * 监听mousedown事件
     * 第一次点击确定起点，第二次点击确定线段
     * @param: e Event事件
     */
    startCallBack(e: Event): void {
        if (!this.eventFlag && this.eventCount === 0) {
            this.hasChord = { flag: ToolsName.chord, isChoosed: false, x: 0, y: 0, endX: 0, endY: 0, isShow: false };

            // 画半径1
            this.eventFlag = true;
            this.eventCount = 1;

            let x = 0, y = 0;
            if (this.isMobild) {
                // 移动端
                let event: TouchEvent = (e as TouchEvent);

                x = event.touches[0].clientX - this.myCanvasNode.getBoundingClientRect().left;
                y = event.touches[0].clientY - this.myCanvasNode.getBoundingClientRect().top;
            } else {
                // PC端
                let event: MouseEvent = (e as MouseEvent);

                x = event.clientX - this.myCanvasNode.getBoundingClientRect().left;
                y = event.clientY - this.myCanvasNode.getBoundingClientRect().top;
            }

            // 清除画布并重绘图形
            this.rePaint.clearCanvas();
            this.rePaint.rePaint();

            let index = this.canvasChoosed.getIndex();
            this.x = (this.canvasData.getData(index[0]) as Tools).x;
            this.y = (this.canvasData.getData(index[0]) as Tools).y;
            this.r = (this.canvasData.getData(index[0]) as InterCircular).r;
            let angle = Math.atan2((y - this.y), (x - this.x));
            angle = (angle >= 0) ? angle : (2 * Math.PI + angle);
            let startAngle = Math.round((180 / Math.PI) * angle) * (Math.PI / 180);

            // 画相交的点
            this.intersect.repaintPoint();

            this.myCanvas.beginPath();
            this.myCanvas.strokeStyle = Attribute.propDSStyle;
            this.myCanvas.lineWidth = Attribute.propWitdh;
            this.myCanvas.moveTo(this.x, this.y);
            this.myCanvas.arc(this.x, this.y, this.r, startAngle, startAngle, this.anticlockwise);
            this.myCanvas.stroke();
            this.myCanvas.closePath();
        } else if (!this.eventFlag && this.eventCount === 2) {
            // 画半径2
            this.eventFlag = true;
            this.eventCount = 3;

            let x = 0, y = 0;
            if (this.isMobild) {
                // 移动端
                let event: TouchEvent = (e as TouchEvent);

                x = event.touches[0].clientX - this.myCanvasNode.getBoundingClientRect().left;
                y = event.touches[0].clientY - this.myCanvasNode.getBoundingClientRect().top;
            } else {
                // PC端
                let event: MouseEvent = (e as MouseEvent);

                x = event.clientX - this.myCanvasNode.getBoundingClientRect().left;
                y = event.clientY - this.myCanvasNode.getBoundingClientRect().top;
            }

            // 清除画布并重绘图形
            this.rePaint.clearCanvas();
            this.rePaint.rePaint();

            let index = this.canvasChoosed.getIndex();
            this.x = (this.canvasData.getData(index[0]) as Tools).x;
            this.y = (this.canvasData.getData(index[0]) as Tools).y;
            this.r = (this.canvasData.getData(index[0]) as InterCircular).r;
            let angle = Math.atan2((y - this.y), (x - this.x));
            angle = (angle >= 0) ? angle : (2 * Math.PI + angle);
            angle = Math.round((180 / Math.PI) * angle) * (Math.PI / 180);

            // 画相交的点
            this.intersect.repaintPoint();

            // 画半径1
            this.myCanvas.beginPath();
            this.myCanvas.strokeStyle = Attribute.propDSStyle;
            this.myCanvas.lineWidth = Attribute.propWitdh;
            this.myCanvas.moveTo(this.x, this.y);
            this.myCanvas.arc(this.x, this.y, this.r, this.startAngle, this.startAngle, this.anticlockwise);
            this.myCanvas.closePath();
            this.myCanvas.stroke();

            // 画半径2
            this.myCanvas.beginPath();
            this.myCanvas.strokeStyle = Attribute.propNSStyle;
            this.myCanvas.lineWidth = Attribute.propWitdh;
            this.myCanvas.moveTo(this.x, this.y);
            this.myCanvas.arc(this.x, this.y, this.r, angle, angle, this.anticlockwise);
            this.myCanvas.closePath();
            this.myCanvas.stroke();

            // 圆心角
            this.myCanvas.beginPath();
            this.myCanvas.lineWidth = Attribute.propWitdh;
            this.myCanvas.strokeStyle = Attribute.propNSStyle;
            this.myCanvas.arc(this.x, this.y, 30, this.startAngle, angle, false);
            this.myCanvas.stroke();

            // 度数和文本位置
            let value = 0;
            let pr = 40;
            let px = 0;
            let py = 0;
            if (this.startAngle <= angle) {
                value = (180 / Math.PI) * (angle - this.startAngle);
                px = pr * Math.cos((this.startAngle + angle) / 2) + this.x;
                py = pr * Math.sin((this.startAngle + angle) / 2) + this.y;
            } else {
                value = (180 / Math.PI) * (Math.PI * 2 - this.startAngle + angle);
                px = pr * Math.cos((this.startAngle + angle) / 2 - Math.PI) + this.x;
                py = pr * Math.sin((this.startAngle + angle) / 2 - Math.PI) + this.y;
            }

            value = Math.round(value);
            this.myCanvas.beginPath();
            this.myCanvas.font = 'bold 22px Arial';
            this.myCanvas.textAlign = 'center';
            this.myCanvas.fillStyle = 'black';
            this.myCanvas.fillText(value + '°', px + 22, py + 22);
        }
    }

    /**
     * 监听mousemove事件
     * @param: e Event事件
     */
    moveCallBack(e: Event): void {
        if (!this.eventFlag && this.eventCount === 0) {
            // 画半径1

            let x = 0, y = 0;
            if (this.isMobild) {
                // 移动端
                let event: TouchEvent = (e as TouchEvent);

                x = event.touches[0].clientX - this.myCanvasNode.getBoundingClientRect().left;
                y = event.touches[0].clientY - this.myCanvasNode.getBoundingClientRect().top;
            } else {
                // PC端
                let event: MouseEvent = (e as MouseEvent);

                x = event.clientX - this.myCanvasNode.getBoundingClientRect().left;
                y = event.clientY - this.myCanvasNode.getBoundingClientRect().top;
            }

            // 清除画布并重绘图形
            this.rePaint.clearCanvas();
            this.rePaint.rePaint();

            let index = this.canvasChoosed.getIndex();
            this.x = (this.canvasData.getData(index[0]) as Tools).x;
            this.y = (this.canvasData.getData(index[0]) as Tools).y;
            this.r = (this.canvasData.getData(index[0]) as InterCircular).r;
            let angle = Math.atan2((y - this.y), (x - this.x));
            angle = (angle >= 0) ? angle : (2 * Math.PI + angle);
            angle = Math.round((180 / Math.PI) * angle) * (Math.PI / 180);

            // 画相交的点
            this.intersect.repaintPoint();

            // 画半径1
            this.myCanvas.beginPath();
            this.myCanvas.strokeStyle = Attribute.propNSStyle;
            this.myCanvas.lineWidth = Attribute.propWitdh;
            this.myCanvas.moveTo(this.x, this.y);
            this.myCanvas.arc(this.x, this.y, this.r, angle, angle, this.anticlockwise);
            this.myCanvas.stroke();
            this.myCanvas.closePath();
        } else if (!!this.eventFlag && this.eventCount === 1) {
            // 画半径1
            let x = 0, y = 0;
            if (this.isMobild) {
                // 移动端
                let event: TouchEvent = (e as TouchEvent);

                x = event.touches[0].clientX - this.myCanvasNode.getBoundingClientRect().left;
                y = event.touches[0].clientY - this.myCanvasNode.getBoundingClientRect().top;
            } else {
                // PC端
                let event: MouseEvent = (e as MouseEvent);

                x = event.clientX - this.myCanvasNode.getBoundingClientRect().left;
                y = event.clientY - this.myCanvasNode.getBoundingClientRect().top;
            }

            // 清除画布并重绘图形
            this.rePaint.clearCanvas();
            this.rePaint.rePaint();

            let index = this.canvasChoosed.getIndex();
            this.x = (this.canvasData.getData(index[0]) as Tools).x;
            this.y = (this.canvasData.getData(index[0]) as Tools).y;
            this.r = (this.canvasData.getData(index[0]) as InterCircular).r;
            let angle = Math.atan2((y - this.y), (x - this.x));
            angle = (angle >= 0) ? angle : (2 * Math.PI + angle);
            let startAngle = Math.round((180 / Math.PI) * angle) * (Math.PI / 180);

            // 画相交的点
            this.intersect.repaintPoint();

            this.myCanvas.beginPath();
            this.myCanvas.strokeStyle = Attribute.propNSStyle;
            this.myCanvas.lineWidth = Attribute.propWitdh;
            this.myCanvas.moveTo(this.x, this.y);
            this.myCanvas.arc(this.x, this.y, this.r, startAngle, startAngle, this.anticlockwise);
            this.myCanvas.stroke();
            this.myCanvas.closePath();
        } else if (!this.eventFlag && this.eventCount === 2) {
            // 画半径2

            let x = 0, y = 0;
            if (this.isMobild) {
                // 移动端
                let event: TouchEvent = (e as TouchEvent);

                x = event.touches[0].clientX - this.myCanvasNode.getBoundingClientRect().left;
                y = event.touches[0].clientY - this.myCanvasNode.getBoundingClientRect().top;
            } else {
                // PC端
                let event: MouseEvent = (e as MouseEvent);

                x = event.clientX - this.myCanvasNode.getBoundingClientRect().left;
                y = event.clientY - this.myCanvasNode.getBoundingClientRect().top;
            }

            // 清除画布并重绘图形
            this.rePaint.clearCanvas();
            this.rePaint.rePaint();

            let index = this.canvasChoosed.getIndex();
            this.x = (this.canvasData.getData(index[0]) as Tools).x;
            this.y = (this.canvasData.getData(index[0]) as Tools).y;
            this.r = (this.canvasData.getData(index[0]) as InterCircular).r;
            let angle = Math.atan2((y - this.y), (x - this.x));
            angle = (angle >= 0) ? angle : (2 * Math.PI + angle);
            angle = Math.round((180 / Math.PI) * angle) * (Math.PI / 180);

            // 画相交的点
            this.intersect.repaintPoint();

            // 画半径1
            this.myCanvas.beginPath();
            this.myCanvas.strokeStyle = Attribute.propDSStyle;
            this.myCanvas.lineWidth = Attribute.propWitdh;
            this.myCanvas.moveTo(this.x, this.y);
            this.myCanvas.arc(this.x, this.y, this.r, this.startAngle, this.startAngle, this.anticlockwise);
            this.myCanvas.closePath();
            this.myCanvas.stroke();

            // 画半径2
            this.myCanvas.beginPath();
            this.myCanvas.strokeStyle = Attribute.propNSStyle;
            this.myCanvas.lineWidth = Attribute.propWitdh;
            this.myCanvas.moveTo(this.x, this.y);
            this.myCanvas.arc(this.x, this.y, this.r, angle, angle, this.anticlockwise);
            this.myCanvas.closePath();
            this.myCanvas.stroke();

            // 圆心角
            this.myCanvas.beginPath();
            this.myCanvas.lineWidth = Attribute.propWitdh;
            this.myCanvas.strokeStyle = Attribute.propNSStyle;
            this.myCanvas.arc(this.x, this.y, 30, this.startAngle, angle, false);
            this.myCanvas.stroke();

            // 度数和文本位置
            let value = 0;
            let pr = 40;
            let px = 0;
            let py = 0;
            if (this.startAngle <= angle) {
                value = (180 / Math.PI) * (angle - this.startAngle);
                px = pr * Math.cos((this.startAngle + angle) / 2) + this.x;
                py = pr * Math.sin((this.startAngle + angle) / 2) + this.y;
            } else {
                value = (180 / Math.PI) * (Math.PI * 2 - this.startAngle + angle);
                px = pr * Math.cos((this.startAngle + angle) / 2 - Math.PI) + this.x;
                py = pr * Math.sin((this.startAngle + angle) / 2 - Math.PI) + this.y;
            }

            value = Math.round(value);
            this.myCanvas.beginPath();
            this.myCanvas.font = 'bold 22px Arial';
            this.myCanvas.textAlign = 'center';
            this.myCanvas.fillStyle = 'black';
            this.myCanvas.fillText(value + '°', px + 22, py + 22);
        } else if (!!this.eventFlag && this.eventCount === 3) {
            // 画半径2

            let x = 0, y = 0;
            if (this.isMobild) {
                // 移动端
                let event: TouchEvent = (e as TouchEvent);

                x = event.touches[0].clientX - this.myCanvasNode.getBoundingClientRect().left;
                y = event.touches[0].clientY - this.myCanvasNode.getBoundingClientRect().top;
            } else {
                // PC端
                let event: MouseEvent = (e as MouseEvent);

                x = event.clientX - this.myCanvasNode.getBoundingClientRect().left;
                y = event.clientY - this.myCanvasNode.getBoundingClientRect().top;
            }

            // 清除画布并重绘图形
            this.rePaint.clearCanvas();
            this.rePaint.rePaint();

            let index = this.canvasChoosed.getIndex();
            this.x = (this.canvasData.getData(index[0]) as Tools).x;
            this.y = (this.canvasData.getData(index[0]) as Tools).y;
            this.r = (this.canvasData.getData(index[0]) as InterCircular).r;
            let angle = Math.atan2((y - this.y), (x - this.x));
            angle = (angle >= 0) ? angle : (2 * Math.PI + angle);
            angle = Math.round((180 / Math.PI) * angle) * (Math.PI / 180);

            // 画相交的点
            this.intersect.repaintPoint();

            // 画半径1
            this.myCanvas.beginPath();
            this.myCanvas.strokeStyle = Attribute.propDSStyle;
            this.myCanvas.lineWidth = Attribute.propWitdh;
            this.myCanvas.moveTo(this.x, this.y);
            this.myCanvas.arc(this.x, this.y, this.r, this.startAngle, this.startAngle, this.anticlockwise);
            this.myCanvas.closePath();
            this.myCanvas.stroke();

            // 画半径2
            this.myCanvas.beginPath();
            this.myCanvas.strokeStyle = Attribute.propNSStyle;
            this.myCanvas.lineWidth = Attribute.propWitdh;
            this.myCanvas.moveTo(this.x, this.y);
            this.myCanvas.arc(this.x, this.y, this.r, angle, angle, this.anticlockwise);
            this.myCanvas.closePath();
            this.myCanvas.stroke();

            // 圆心角
            this.myCanvas.beginPath();
            this.myCanvas.lineWidth = Attribute.propWitdh;
            this.myCanvas.strokeStyle = Attribute.propNSStyle;
            this.myCanvas.arc(this.x, this.y, 30, this.startAngle, angle, false);
            this.myCanvas.stroke();

            // 度数和文本位置
            let value = 0;
            let pr = 40;
            let px = 0;
            let py = 0;
            if (this.startAngle <= angle) {
                value = (180 / Math.PI) * (angle - this.startAngle);
                px = pr * Math.cos((this.startAngle + angle) / 2) + this.x;
                py = pr * Math.sin((this.startAngle + angle) / 2) + this.y;
            } else {
                value = (180 / Math.PI) * (Math.PI * 2 - this.startAngle + angle);
                px = pr * Math.cos((this.startAngle + angle) / 2 - Math.PI) + this.x;
                py = pr * Math.sin((this.startAngle + angle) / 2 - Math.PI) + this.y;
            }

            value = Math.round(value);
            this.myCanvas.beginPath();
            this.myCanvas.font = 'bold 22px Arial';
            this.myCanvas.textAlign = 'center';
            this.myCanvas.fillStyle = 'black';
            this.myCanvas.fillText(value + '°', px + 22, py + 22);
        }
    }

    /**
     * 监听mouseup事件
     * @param: e Event事件
     */
    endCallBack(e: Event): void {
        if (!!this.eventFlag && this.eventCount === 1) {
            // 确定半径1
            this.eventFlag = false;
            this.eventCount = 2;

            let x = 0, y = 0;
            if (this.isMobild) {
                // 移动端
                let event: TouchEvent = (e as TouchEvent);

                x = event.changedTouches[0].clientX - this.myCanvasNode.getBoundingClientRect().left;
                y = event.changedTouches[0].clientY - this.myCanvasNode.getBoundingClientRect().top;
            } else {
                // PC端
                let event: MouseEvent = (e as MouseEvent);

                x = event.clientX - this.myCanvasNode.getBoundingClientRect().left;
                y = event.clientY - this.myCanvasNode.getBoundingClientRect().top;
            }

            // 清除画布并重绘图形
            this.rePaint.clearCanvas();
            this.rePaint.rePaint();

            let index = this.canvasChoosed.getIndex();
            this.x = (this.canvasData.getData(index[0]) as Tools).x;
            this.y = (this.canvasData.getData(index[0]) as Tools).y;
            this.r = (this.canvasData.getData(index[0]) as InterCircular).r;
            let angle = Math.atan2((y - this.y), (x - this.x));
            angle = (angle >= 0) ? angle : (2 * Math.PI + angle);
            this.startAngle = Math.round((180 / Math.PI) * angle) * (Math.PI / 180);
            this.hasChord.x = Math.cos(this.startAngle) * this.r + this.x;
            this.hasChord.y = Math.sin(this.startAngle) * this.r + this.y;

            // 画相交的点
            this.intersect.repaintPoint();

            // 画半径1
            this.myCanvas.beginPath();
            this.myCanvas.strokeStyle = Attribute.propDSStyle;
            this.myCanvas.lineWidth = Attribute.propWitdh;
            this.myCanvas.moveTo(this.x, this.y);
            this.myCanvas.arc(this.x, this.y, this.r, this.startAngle, this.startAngle, this.anticlockwise);
            this.myCanvas.stroke();
            this.myCanvas.closePath();
        } else if (!!this.eventFlag && this.eventCount === 3) {
            // 确定半径2，保存数据
            this.eventFlag = false;
            this.eventCount = 0;

            let x = 0, y = 0;
            if (this.isMobild) {
                // 移动端
                let event: TouchEvent = (e as TouchEvent);

                x = event.changedTouches[0].clientX - this.myCanvasNode.getBoundingClientRect().left;
                y = event.changedTouches[0].clientY - this.myCanvasNode.getBoundingClientRect().top;
            } else {
                // PC端
                let event: MouseEvent = (e as MouseEvent);

                x = event.clientX - this.myCanvasNode.getBoundingClientRect().left;
                y = event.clientY - this.myCanvasNode.getBoundingClientRect().top;
            }

            // 清除画布并重绘图形
            this.rePaint.clearCanvas();
            this.rePaint.rePaint();

            let index = this.canvasChoosed.getIndex();
            this.x = (this.canvasData.getData(index[0]) as Tools).x;
            this.y = (this.canvasData.getData(index[0]) as Tools).y;
            this.r = (this.canvasData.getData(index[0]) as InterCircular).r;
            let angle = Math.atan2((y - this.y), (x - this.x));
            angle = (angle >= 0) ? angle : (2 * Math.PI + angle);
            this.endAngle = Math.round((180 / Math.PI) * angle) * (Math.PI / 180);
            this.hasChord.endX = Math.cos(this.endAngle) * this.r + this.x;
            this.hasChord.endY = Math.sin(this.endAngle) * this.r + this.y;

            // 画相交的点
            this.intersect.repaintPoint();

            // 画半径1
            this.myCanvas.beginPath();
            this.myCanvas.strokeStyle = Attribute.propDSStyle;
            this.myCanvas.lineWidth = Attribute.propWitdh;
            this.myCanvas.moveTo(this.x, this.y);
            this.myCanvas.arc(this.x, this.y, this.r, this.startAngle, this.startAngle, this.anticlockwise);
            this.myCanvas.closePath();
            this.myCanvas.stroke();

            // 画半径2
            this.myCanvas.beginPath();
            this.myCanvas.strokeStyle = Attribute.propDSStyle;
            this.myCanvas.lineWidth = Attribute.propWitdh;
            this.myCanvas.moveTo(this.x, this.y);
            this.myCanvas.arc(this.x, this.y, this.r, this.endAngle, this.endAngle, this.anticlockwise);
            this.myCanvas.closePath();
            this.myCanvas.stroke();

            // 保存扇形数据到对应的圆里
            (this.canvasData.getData(this.canvasChoosed.getIndex()[0]) as InterCircular).fanAndRadius.push(this.data());
            // 恢复按钮标志
            this.buttonListen.recoverButtonFlag();

            // 清除canvasChoosed的下标
            this.canvasChoosed.recoverIndex();
        }
    }

    /**
     * 返回坐标数据
     */
    data(): InterFan {
        return { flag: this.flag, isChoosed: this.isChoosed, x: this.x, y: this.y, r: this.r, startAngle: this.startAngle, endAngle: this.endAngle, fillStyle: this.fillStyle, anticlockwise: this.anticlockwise, hasChord: this.hasChord };
    }
}