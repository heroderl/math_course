import { Attribute } from './enum/enum-configlib';
import { AuxiliaryListen } from './auxiliaryListen';
import { RePaint } from './rePaint';
import { CanvasData } from './canvasData';
import { Adsorption } from './adsorption';
import { Intersect } from './intersect';

/**
 * 量角器
 * false, 0
 * start(true, 1) --> move(true, 1) --> end(false, 2)
 * move(false, 2)
 * start(true, 3) --> move(true, 3) --> end(false, 3)
 * move(false, 3)
 * start(true, 4) --> move(true, 4) --> end(false, 0)
 */
export class Protractor {
    private x: number;  // 起点x坐标
    private y: number;  // 起点y坐标
    private r: number;  // 半径
    private startAngle: number;  // 起始角
    private endAngle: number;  // 结束角
    private eventFlag: boolean;  // true表示开始点击，false表示结束点击
    private eventCount: number;  // 点击次数
    private isMobild: boolean;  // true为移动端，false为PC端
    private myCanvas: CanvasRenderingContext2D;  // canvas对象
    private myCanvasNode: HTMLElement;  // canvas节点
    private rePaint: RePaint;  // 重绘图形
    private AuxiliaryListen: AuxiliaryListen;  // 辅助工具
    private canvasData: CanvasData;  // 存放数据
    private adsorption: Adsorption;  // 磁性吸附
    private intersect: Intersect;  // 相交

    constructor(isMobild: boolean, myCanvas: CanvasRenderingContext2D, myCanvasNode: HTMLElement, rePaint: RePaint, AuxiliaryListen: AuxiliaryListen, canvasData: CanvasData, intersect: Intersect) {
        this.isMobild = isMobild;
        this.myCanvas = myCanvas;
        this.myCanvasNode = myCanvasNode;
        this.rePaint = rePaint;
        this.eventFlag = false;
        this.eventCount = 0;
        this.AuxiliaryListen = AuxiliaryListen;
        this.canvasData = canvasData;
        this.intersect = intersect;
        this.adsorption = new Adsorption(this.canvasData, this.intersect);
    }

    /**
     * 监听mousedown事件
     */
    startCallback(e: Event): void {
        if (!this.eventFlag && this.eventCount === 0) {
            // 画点
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

            // 磁性吸附
            let dataXY = this.adsorption.adsorpToXY(x, y);
            x = dataXY.x;
            y = dataXY.y;

            // 画相交的点
            this.intersect.repaintPoint();

            this.myCanvas.beginPath();
            this.myCanvas.arc(x, y, Attribute.propPointR, 0, 2 * Math.PI, false);
            this.myCanvas.fillStyle = Attribute.propNFStyle;
            this.myCanvas.fill();
        } else if (!this.eventFlag && this.eventCount === 2) {
            // 画半径1
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

            // 磁性吸附
            let dataXY = this.adsorption.adsorpToXY(x, y);
            x = dataXY.x;
            y = dataXY.y;

            let r = Math.sqrt(Math.pow((y - this.y), 2) + Math.pow((x - this.x), 2));
            let angle = Math.atan2((y - this.y), (x - this.x));
            angle = (angle >= 0) ? angle : (2 * Math.PI + angle);
            angle = Math.round(180 / Math.PI * angle) * (Math.PI / 180);

            // 画相交的点
            this.intersect.repaintPoint();

            // 画半径1
            this.myCanvas.beginPath();
            this.myCanvas.lineWidth = Attribute.propWitdh;
            this.myCanvas.strokeStyle = Attribute.propNSStyle;
            this.myCanvas.moveTo(this.x, this.y);
            this.myCanvas.arc(this.x, this.y, r, angle, angle, false);
            this.myCanvas.stroke();
        } else if (!this.eventFlag && this.eventCount === 3) {
            // 画半径2
            this.eventFlag = true;
            this.eventCount = 4;

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

            // 磁性吸附
            let dataXY = this.adsorption.adsorpToXY(x, y);
            x = dataXY.x;
            y = dataXY.y;

            let angle = Math.atan2((y - this.y), (x - this.x));
            angle = (angle >= 0) ? angle : (2 * Math.PI + angle);
            let endAngle = Math.round(180 / Math.PI * angle) * (Math.PI / 180);

            // 画相交的点
            this.intersect.repaintPoint();

            // 半径1
            this.myCanvas.beginPath();
            this.myCanvas.lineWidth = Attribute.propWitdh;
            this.myCanvas.strokeStyle = Attribute.propDSStyle;
            this.myCanvas.moveTo(this.x, this.y);
            this.myCanvas.arc(this.x, this.y, this.r, this.startAngle, this.startAngle, false);
            this.myCanvas.stroke();

            // 半径2
            this.myCanvas.beginPath();
            this.myCanvas.lineWidth = Attribute.propWitdh;
            this.myCanvas.strokeStyle = Attribute.propNSStyle;
            this.myCanvas.moveTo(this.x, this.y);
            this.myCanvas.arc(this.x, this.y, this.r, endAngle, endAngle, false);
            this.myCanvas.stroke();

            // 圆心角
            this.myCanvas.beginPath();
            this.myCanvas.lineWidth = Attribute.propWitdh;
            this.myCanvas.strokeStyle = Attribute.propNSStyle;
            this.myCanvas.arc(this.x, this.y, 30, this.startAngle, endAngle, false);
            this.myCanvas.stroke();

            // 度数和文本位置
            let value = 0;
            let pr = 40;
            let px = 0;
            let py = 0;
            if (this.startAngle <= endAngle) {
                value = (180 / Math.PI) * (endAngle - this.startAngle);
                px = pr * Math.cos((this.startAngle + endAngle) / 2) + this.x;
                py = pr * Math.sin((this.startAngle + endAngle) / 2) + this.y;
            } else {
                value = (180 / Math.PI) * (Math.PI * 2 - this.startAngle + endAngle);
                px = pr * Math.cos((this.startAngle + endAngle) / 2 - Math.PI) + this.x;
                py = pr * Math.sin((this.startAngle + endAngle) / 2 - Math.PI) + this.y;
            }

            // 文本
            value = Math.round(value);
            this.myCanvas.beginPath();
            this.myCanvas.font = Attribute.propFont;
            this.myCanvas.textAlign = Attribute.propTextAlign;
            this.myCanvas.fillStyle = Attribute.propDFStyle;
            this.myCanvas.fillText(value + '°', px + 22, py + 22);
        }
    }

    /**
     * 监听mouseomove事件
     */
    moveCallback(e: Event): void {
        if (!!this.eventFlag && this.eventCount === 1) {
            // 画点

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

            // 磁性吸附
            let dataXY = this.adsorption.adsorpToXY(x, y);
            x = dataXY.x;
            y = dataXY.y;

            // 画相交的点
            this.intersect.repaintPoint();

            this.myCanvas.beginPath();
            this.myCanvas.arc(x, y, Attribute.propPointR, 0, 2 * Math.PI, false);
            this.myCanvas.fillStyle = Attribute.propNFStyle;
            this.myCanvas.fill();
        } else if (!this.eventFlag && this.eventCount === 2) {
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

            // 磁性吸附
            let dataXY = this.adsorption.adsorpToXY(x, y);
            x = dataXY.x;
            y = dataXY.y;

            let r = Math.sqrt(Math.pow((y - this.y), 2) + Math.pow((x - this.x), 2));
            let angle = Math.atan2((y - this.y), (x - this.x));
            angle = (angle >= 0) ? angle : (2 * Math.PI + angle);
            angle = Math.round(180 / Math.PI * angle) * (Math.PI / 180);

            // 画相交的点
            this.intersect.repaintPoint();

            // 画半径1
            this.myCanvas.beginPath();
            this.myCanvas.lineWidth = Attribute.propWitdh;
            this.myCanvas.strokeStyle = Attribute.propNSStyle;
            this.myCanvas.moveTo(this.x, this.y);
            this.myCanvas.arc(this.x, this.y, r, angle, angle, false);
            this.myCanvas.stroke();
        } else if (!!this.eventFlag && this.eventCount === 3) {
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

            // 磁性吸附
            let dataXY = this.adsorption.adsorpToXY(x, y);
            x = dataXY.x;
            y = dataXY.y;

            let r = Math.sqrt(Math.pow((y - this.y), 2) + Math.pow((x - this.x), 2));
            let angle = Math.atan2((y - this.y), (x - this.x));
            angle = (angle >= 0) ? angle : (2 * Math.PI + angle);
            angle = Math.round(180 / Math.PI * angle) * (Math.PI / 180);

            // 画相交的点
            this.intersect.repaintPoint();

            // 画半径1
            this.myCanvas.beginPath();
            this.myCanvas.lineWidth = Attribute.propWitdh;
            this.myCanvas.strokeStyle = Attribute.propNSStyle;
            this.myCanvas.moveTo(this.x, this.y);
            this.myCanvas.arc(this.x, this.y, r, angle, angle, false);
            this.myCanvas.stroke();
        } else if (!this.eventFlag && this.eventCount === 3) {
            // 画半径2，并给出度数

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

            // 磁性吸附
            let dataXY = this.adsorption.adsorpToXY(x, y);
            x = dataXY.x;
            y = dataXY.y;

            let angle = Math.atan2((y - this.y), (x - this.x));
            angle = (angle >= 0) ? angle : (2 * Math.PI + angle);
            let endAngle = Math.round(180 / Math.PI * angle) * (Math.PI / 180);

            // 画相交的点
            this.intersect.repaintPoint();

            // 半径1
            this.myCanvas.beginPath();
            this.myCanvas.lineWidth = Attribute.propWitdh;
            this.myCanvas.strokeStyle = Attribute.propDSStyle;
            this.myCanvas.moveTo(this.x, this.y);
            this.myCanvas.arc(this.x, this.y, this.r, this.startAngle, this.startAngle, false);
            this.myCanvas.stroke();

            // 半径2
            this.myCanvas.beginPath();
            this.myCanvas.lineWidth = Attribute.propWitdh;
            this.myCanvas.strokeStyle = Attribute.propNSStyle;
            this.myCanvas.moveTo(this.x, this.y);
            this.myCanvas.arc(this.x, this.y, this.r, endAngle, endAngle, false);
            this.myCanvas.stroke();

            // 圆心角
            this.myCanvas.beginPath();
            this.myCanvas.lineWidth = Attribute.propWitdh;
            this.myCanvas.strokeStyle = Attribute.propNSStyle;
            this.myCanvas.arc(this.x, this.y, 30, this.startAngle, endAngle, false);
            this.myCanvas.stroke();

            // 度数和文本位置
            let value = 0;
            let pr = 40;
            let px = 0;
            let py = 0;
            if (this.startAngle <= endAngle) {
                value = (180 / Math.PI) * (endAngle - this.startAngle);
                px = pr * Math.cos((this.startAngle + endAngle) / 2) + this.x;
                py = pr * Math.sin((this.startAngle + endAngle) / 2) + this.y;
            } else {
                value = (180 / Math.PI) * (Math.PI * 2 - this.startAngle + endAngle);
                px = pr * Math.cos((this.startAngle + endAngle) / 2 - Math.PI) + this.x;
                py = pr * Math.sin((this.startAngle + endAngle) / 2 - Math.PI) + this.y;
            }

            value = Math.round(value);
            this.myCanvas.beginPath();
            this.myCanvas.font = Attribute.propFont;
            this.myCanvas.textAlign = Attribute.propTextAlign;
            this.myCanvas.fillStyle = Attribute.propDFStyle;
            this.myCanvas.fillText(value + '°', px + 22, py + 22);
        } else if (!!this.eventFlag && this.eventCount === 4) {
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

            // 磁性吸附
            let dataXY = this.adsorption.adsorpToXY(x, y);
            x = dataXY.x;
            y = dataXY.y;

            let angle = Math.atan2((y - this.y), (x - this.x));
            angle = (angle >= 0) ? angle : (2 * Math.PI + angle);
            let endAngle = Math.round(180 / Math.PI * angle) * (Math.PI / 180);

            // 画相交的点
            this.intersect.repaintPoint();

            // 半径1
            this.myCanvas.beginPath();
            this.myCanvas.lineWidth = Attribute.propWitdh;
            this.myCanvas.strokeStyle = Attribute.propDSStyle;
            this.myCanvas.moveTo(this.x, this.y);
            this.myCanvas.arc(this.x, this.y, this.r, this.startAngle, this.startAngle, false);
            this.myCanvas.stroke();

            // 半径2
            this.myCanvas.beginPath();
            this.myCanvas.lineWidth = Attribute.propWitdh;
            this.myCanvas.strokeStyle = Attribute.propNSStyle;
            this.myCanvas.moveTo(this.x, this.y);
            this.myCanvas.arc(this.x, this.y, this.r, endAngle, endAngle, false);
            this.myCanvas.stroke();

            // 圆心角
            this.myCanvas.beginPath();
            this.myCanvas.lineWidth = Attribute.propWitdh;
            this.myCanvas.strokeStyle = Attribute.propNSStyle;
            this.myCanvas.arc(this.x, this.y, 30, this.startAngle, endAngle, false);
            this.myCanvas.stroke();

            // 度数和文本位置
            let value = 0;
            let pr = 40;
            let px = 0;
            let py = 0;
            if (this.startAngle <= endAngle) {
                value = (180 / Math.PI) * (endAngle - this.startAngle);
                px = pr * Math.cos((this.startAngle + endAngle) / 2) + this.x;
                py = pr * Math.sin((this.startAngle + endAngle) / 2) + this.y;
            } else {
                value = (180 / Math.PI) * (Math.PI * 2 - this.startAngle + endAngle);
                px = pr * Math.cos((this.startAngle + endAngle) / 2 - Math.PI) + this.x;
                py = pr * Math.sin((this.startAngle + endAngle) / 2 - Math.PI) + this.y;
            }

            value = Math.round(value);
            this.myCanvas.beginPath();
            this.myCanvas.font = Attribute.propFont;
            this.myCanvas.textAlign = Attribute.propTextAlign;
            this.myCanvas.fillStyle = Attribute.propDFStyle;
            this.myCanvas.fillText(value + '°', px + 22, py + 22);
        }
    }

    /**
     * 监听mouseend事件
     */
    endCallback(e: Event): void {
        if (!!this.eventFlag && this.eventCount === 1) {
            // 确定点
            this.eventFlag = false;
            this.eventCount = 2;

            if (this.isMobild) {
                // 移动端
                let event: TouchEvent = (e as TouchEvent);

                this.x = event.changedTouches[0].clientX - this.myCanvasNode.getBoundingClientRect().left;
                this.y = event.changedTouches[0].clientY - this.myCanvasNode.getBoundingClientRect().top;
            } else {
                // PC端
                let event: MouseEvent = (e as MouseEvent);

                this.x = event.clientX - this.myCanvasNode.getBoundingClientRect().left;
                this.y = event.clientY - this.myCanvasNode.getBoundingClientRect().top;
            }

            // 清除画布并重绘图形
            this.rePaint.clearCanvas();
            this.rePaint.rePaint();

            // 磁性吸附
            let dataXY = this.adsorption.adsorpToXY(this.x, this.y);
            this.x = dataXY.x;
            this.y = dataXY.y;

            // 画相交的点
            this.intersect.repaintPoint();

            this.myCanvas.beginPath();
            this.myCanvas.fillStyle = Attribute.propDFStyle;
            this.myCanvas.arc(this.x, this.y, Attribute.propPointR, 0, 2 * Math.PI, false);
            this.myCanvas.fill();
        } else if (!!this.eventFlag && this.eventCount === 3) {
            // 确定半径1
            this.eventFlag = false;

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

            // 磁性吸附
            let dataXY = this.adsorption.adsorpToXY(x, y);
            x = dataXY.x;
            y = dataXY.y;

            this.r = Math.sqrt(Math.pow((y - this.y), 2) + Math.pow((x - this.x), 2));
            let angle = Math.atan2((y - this.y), (x - this.x));
            angle = (angle >= 0) ? angle : (2 * Math.PI + angle);
            this.startAngle = Math.round(180 / Math.PI * angle) * (Math.PI / 180);

            // 画相交的点
            this.intersect.repaintPoint();

            // 画半径1
            this.myCanvas.beginPath();
            this.myCanvas.lineWidth = Attribute.propWitdh;
            this.myCanvas.strokeStyle = Attribute.propDSStyle;
            this.myCanvas.moveTo(this.x, this.y);
            this.myCanvas.arc(this.x, this.y, this.r, this.startAngle, this.startAngle, false);
            this.myCanvas.stroke();
        } else if (!!this.eventFlag && this.eventCount === 4) {
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

            // 磁性吸附
            let dataXY = this.adsorption.adsorpToXY(x, y);
            x = dataXY.x;
            y = dataXY.y;

            let angle = Math.atan2((y - this.y), (x - this.x));
            angle = (angle >= 0) ? angle : (2 * Math.PI + angle);
            this.endAngle = Math.round(180 / Math.PI * angle) * (Math.PI / 180);

            // 画相交的点
            this.intersect.repaintPoint();

            // 半径1
            this.myCanvas.beginPath();
            this.myCanvas.lineWidth = Attribute.propWitdh;
            this.myCanvas.strokeStyle = Attribute.propDSStyle;
            this.myCanvas.moveTo(this.x, this.y);
            this.myCanvas.arc(this.x, this.y, this.r, this.startAngle, this.startAngle, false);
            this.myCanvas.stroke();

            // 半径2
            this.myCanvas.beginPath();
            this.myCanvas.lineWidth = Attribute.propWitdh;
            this.myCanvas.strokeStyle = Attribute.propDSStyle;
            this.myCanvas.moveTo(this.x, this.y);
            this.myCanvas.arc(this.x, this.y, this.r, this.endAngle, this.endAngle, false);
            this.myCanvas.stroke();

            // 圆心角
            this.myCanvas.beginPath();
            this.myCanvas.lineWidth = Attribute.propWitdh;
            this.myCanvas.strokeStyle = Attribute.propDSStyle;
            this.myCanvas.arc(this.x, this.y, 30, this.startAngle, this.endAngle, false);
            this.myCanvas.stroke();

            // 度数和文本位置
            let value = 0;
            let pr = 40;
            let px = 0;
            let py = 0;
            if (this.startAngle <= this.endAngle) {
                value = (180 / Math.PI) * (this.endAngle - this.startAngle);
                px = pr * Math.cos((this.startAngle + this.endAngle) / 2) + this.x;
                py = pr * Math.sin((this.startAngle + this.endAngle) / 2) + this.y;
            } else {
                value = (180 / Math.PI) * (Math.PI * 2 - this.startAngle + this.endAngle);
                px = pr * Math.cos((this.startAngle + this.endAngle) / 2 - Math.PI) + this.x;
                py = pr * Math.sin((this.startAngle + this.endAngle) / 2 - Math.PI) + this.y;
            }

            value = Math.round(value);
            this.myCanvas.beginPath();
            this.myCanvas.font = Attribute.propFont;
            this.myCanvas.textAlign = Attribute.propTextAlign;
            this.myCanvas.fillStyle = Attribute.propDFStyle;
            this.myCanvas.fillText(value + '°', px + 22, py + 22);

            // 恢复辅助按钮标志
            this.AuxiliaryListen.recoverButtonFlag();
        }
    }
}