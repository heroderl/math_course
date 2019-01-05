import { ToolsName, Attribute } from './enum/enum-configlib';
import { InterSegment, Tools } from './interface/inter-toolslib';
import { RePaint } from './rePaint';
import { ButtonListen } from './buttonListen';
import { CanvasData } from './canvasData';
import { Adsorption } from './adsorption';
import { Intersect } from './intersect';

/**
 * 线段
 */
export class Segment implements InterSegment {
    flag: ToolsName;  // 标志
    x: number;  // 起点x的坐标
    y: number;  // 起点y的坐标
    r: number;  // 线段长度
    isChoosed: boolean;  // true表示图形被选中，false表示未被选中
    angle: number;  // 表示角，单位为弧度
    anticlockwise?: boolean;  // false表示顺时针(默认)，true表示逆时针

    private isMobild: boolean;  // true为移动端，false为PC端
    private myCanvas: CanvasRenderingContext2D;  // canvas对象
    private myCanvasNode: HTMLElement;  // canvas节点
    private rePaint: RePaint;  // 重绘图形
    private eventFlag: boolean;  // true表示开始点击，false表示结束点击
    private eventCount: number;  // 点击次数
    private buttonListen: ButtonListen;  // 按钮监听事件
    private canvasData: CanvasData;  // canvas图形数据
    private adsorption: Adsorption;  // 磁性吸附
    private intersect: Intersect;  // 相交的点

    constructor(isMobild: boolean, myCanvas: CanvasRenderingContext2D, myCanvasNode: HTMLElement, rePaint: RePaint, buttonListen: ButtonListen, canvasData: CanvasData, intersect: Intersect) {
        this.flag = ToolsName.segment;
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
        this.intersect = intersect;
        this.adsorption = new Adsorption(this.canvasData, this.intersect);
    }

    /*
    * 监听mousedown事件
    * 第一次点击确定起点，第二次点击确定线段
    * @param: e 事件
    */
    startCallBack(e: Event): void {
        if (!this.eventFlag && this.eventCount === 0) {
            // 画点，为了确定点
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

            x += Attribute.mouseOffset;

            // 磁性吸附
            let dataXY = this.adsorption.adsorpToXY(x, y);
            x = dataXY.x;
            y = dataXY.y;

            // 画相交的点
            this.intersect.repaintPoint();

            this.myCanvas.beginPath();
            this.myCanvas.fillStyle = Attribute.propNFStyle;
            this.myCanvas.arc(x, y, Attribute.propPointR, 0, 2 * Math.PI, false);
            this.myCanvas.fill();
        } else if (!this.eventFlag && this.eventCount === 2) {
            // 画终点，画线段
            this.eventFlag = true;

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

            x += Attribute.mouseOffset;

            // 清楚画布并重绘图形
            this.rePaint.clearCanvas();
            this.rePaint.rePaint();

            // 磁性吸附
            let dataXY = this.adsorption.adsorpToXY(x, y);
            x = dataXY.x;
            y = dataXY.y;

            let value = parseFloat((Math.sqrt(Math.pow(Math.abs(x - this.x), 2) + Math.pow(Math.abs(y - this.y), 2)) / Attribute.unitProp).toFixed(1));
            let r = Math.round(value * Attribute.unitProp);
            if (r <= 4) {
                value = 0.1;
                r = 4;
            }
            let angle = Math.atan2((y - this.y), (x - this.x));
            angle = (angle >= 0) ? angle : (2 * Math.PI + angle);
            angle = Math.round((180 / Math.PI) * angle) * (Math.PI / 180);

            // 画相交的点
            this.intersect.repaintPoint();

            // 画线段
            this.myCanvas.beginPath();
            this.myCanvas.lineWidth = Attribute.propWitdh;
            this.myCanvas.strokeStyle = Attribute.propNSStyle;
            this.myCanvas.moveTo(this.x, this.y);
            this.myCanvas.arc(this.x, this.y, r, angle, angle, this.anticlockwise);
            this.myCanvas.closePath();
            this.myCanvas.stroke();

            // 画起点
            this.myCanvas.beginPath();
            this.myCanvas.fillStyle = Attribute.propNFStyle;
            this.myCanvas.arc(this.x, this.y, Attribute.propPointR, 0, 2 * Math.PI, false);
            this.myCanvas.fill();

            // 画终点
            this.myCanvas.beginPath();
            this.myCanvas.fillStyle = Attribute.propNFStyle;
            this.myCanvas.arc(x, y, Attribute.propPointR, 0, 2 * Math.PI, false);
            this.myCanvas.fill();

            // 画尺子
            this.myCanvas.beginPath();
            this.myCanvas.strokeStyle = Attribute.propDSStyle;
            this.myCanvas.lineWidth = 2;
            this.myCanvas.moveTo(this.x, this.y);
            let rulep = this.rotatexy(this.x, this.y, 0, 20, angle);
            this.myCanvas.lineTo(rulep.x, rulep.y);
            rulep = this.rotatexy(this.x, this.y, r, 20, angle);
            this.myCanvas.lineTo(rulep.x, rulep.y);
            rulep = this.rotatexy(this.x, this.y, r, 0, angle);
            this.myCanvas.lineTo(rulep.x, rulep.y);
            this.myCanvas.strokeStyle = Attribute.propDSStyle;
            this.myCanvas.lineWidth = 2;
            for (let i = 10; i < r; i += 10) {
                rulep = this.rotatexy(this.x, this.y, i, 0, angle);
                this.myCanvas.moveTo(rulep.x, rulep.y);
                rulep = this.rotatexy(this.x, this.y, i, 5, angle);
                this.myCanvas.lineTo(rulep.x, rulep.y);
                i += 10;
                if (i < r) {
                    rulep = this.rotatexy(this.x, this.y, i, 0, angle);
                    this.myCanvas.moveTo(rulep.x, rulep.y);
                    rulep = this.rotatexy(this.x, this.y, i, 10, angle);
                    this.myCanvas.lineTo(rulep.x, rulep.y);
                }
            }
            this.myCanvas.stroke();

            // 画文本
            this.myCanvas.save();
            this.myCanvas.beginPath();
            this.myCanvas.translate(this.x, this.y);
            this.myCanvas.rotate(angle);
            this.myCanvas.font = Attribute.propFont;
            this.myCanvas.fillStyle = Attribute.propDFStyle;
            this.myCanvas.fillText(value + 'cm', r / 2 - 22, -30);
            this.myCanvas.restore();
        } else {
            return;
        }
    }

    /*
    * 监听mousemove事件
    * @param: e 事件
    */
    moveCallBack(e: Event): void {
        if (this.eventFlag && this.eventCount === 1) {
            // 画点，为了确定点

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

            x += Attribute.mouseOffset;

            // 清楚画布并重绘图形
            this.rePaint.clearCanvas();
            this.rePaint.rePaint();

            // 磁性吸附
            let dataXY = this.adsorption.adsorpToXY(x, y);
            x = dataXY.x;
            y = dataXY.y;

            // 画相交的点
            this.intersect.repaintPoint();

            this.myCanvas.beginPath();
            this.myCanvas.fillStyle = Attribute.propNFStyle;
            this.myCanvas.arc(x, y, Attribute.propPointR, 0, 2 * Math.PI, false);
            this.myCanvas.fill();
        } else if (!this.eventFlag && this.eventCount === 2) {
            // 画线段，为了确定线段

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

            x += Attribute.mouseOffset;

            // 清楚画布并重绘图形
            this.rePaint.clearCanvas();
            this.rePaint.rePaint();

            // 磁性吸附
            let dataXY = this.adsorption.adsorpToXY(x, y);
            x = dataXY.x;
            y = dataXY.y;

            let value = parseFloat((Math.sqrt(Math.pow(Math.abs(x - this.x), 2) + Math.pow(Math.abs(y - this.y), 2)) / Attribute.unitProp).toFixed(1));
            let r = Math.round(value * Attribute.unitProp);
            if (r <= 4) {
                value = 0.1;
                r = 4;
            }
            let angle = Math.atan2((y - this.y), (x - this.x));
            angle = (angle >= 0) ? angle : (2 * Math.PI + angle);
            angle = Math.round((180 / Math.PI) * angle) * (Math.PI / 180);

            // 画相交的点
            this.intersect.repaintPoint();

            // 画线段
            this.myCanvas.beginPath();
            this.myCanvas.lineWidth = Attribute.propWitdh;
            this.myCanvas.strokeStyle = Attribute.propNSStyle;
            this.myCanvas.moveTo(this.x, this.y);
            this.myCanvas.arc(this.x, this.y, r, angle, angle, this.anticlockwise);
            this.myCanvas.stroke();

            // 画起点
            this.myCanvas.beginPath();
            this.myCanvas.fillStyle = Attribute.propNFStyle;
            this.myCanvas.arc(this.x, this.y, Attribute.propPointR, 0, 2 * Math.PI, false);
            this.myCanvas.fill();

            // 画终点
            x = Math.cos(angle) * r + this.x;
            y = Math.sin(angle) * r + this.y;
            this.myCanvas.beginPath();
            this.myCanvas.fillStyle = Attribute.propNFStyle;
            this.myCanvas.arc(x, y, Attribute.propPointR, 0, 2 * Math.PI, false);
            this.myCanvas.fill();

            // 画尺子
            this.myCanvas.beginPath();
            this.myCanvas.strokeStyle = Attribute.propDSStyle;
            this.myCanvas.lineWidth = 2;
            this.myCanvas.moveTo(this.x, this.y);
            let rulep = this.rotatexy(this.x, this.y, 0, 20, angle);
            this.myCanvas.lineTo(rulep.x, rulep.y);
            rulep = this.rotatexy(this.x, this.y, r, 20, angle);
            this.myCanvas.lineTo(rulep.x, rulep.y);
            rulep = this.rotatexy(this.x, this.y, r, 0, angle);
            this.myCanvas.lineTo(rulep.x, rulep.y);
            this.myCanvas.strokeStyle = Attribute.propDSStyle;
            this.myCanvas.lineWidth = 2;
            for (let i = 10; i < r; i += 10) {
                rulep = this.rotatexy(this.x, this.y, i, 0, angle);
                this.myCanvas.moveTo(rulep.x, rulep.y);
                rulep = this.rotatexy(this.x, this.y, i, 5, angle);
                this.myCanvas.lineTo(rulep.x, rulep.y);
                i += 10;
                if (i < r) {
                    rulep = this.rotatexy(this.x, this.y, i, 0, angle);
                    this.myCanvas.moveTo(rulep.x, rulep.y);
                    rulep = this.rotatexy(this.x, this.y, i, 10, angle);
                    this.myCanvas.lineTo(rulep.x, rulep.y);
                }
            }
            this.myCanvas.stroke();

            // 画文本
            this.myCanvas.save();
            this.myCanvas.beginPath();
            this.myCanvas.translate(this.x, this.y);
            this.myCanvas.rotate(angle);
            this.myCanvas.font = Attribute.propFont;
            this.myCanvas.fillStyle = Attribute.propDFStyle;
            this.myCanvas.fillText(value + 'cm', r / 2 - 22, -30);
            this.myCanvas.restore();
        } else if (this.eventFlag && this.eventCount === 2) {
            // 画终点，画线段
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

            x += Attribute.mouseOffset;

            // 清楚画布并重绘图形
            this.rePaint.clearCanvas();
            this.rePaint.rePaint();

            // 磁性吸附
            let dataXY = this.adsorption.adsorpToXY(x, y);
            x = dataXY.x;
            y = dataXY.y;

            let value = parseFloat((Math.sqrt(Math.pow(Math.abs(x - this.x), 2) + Math.pow(Math.abs(y - this.y), 2)) / Attribute.unitProp).toFixed(1));
            let r = Math.round(value * Attribute.unitProp);
            if (r <= Attribute.unitProp * 0.1) {
                value = 0.1;
                r = Attribute.unitProp * 0.1;
            }
            let angle = Math.atan2((y - this.y), (x - this.x));
            angle = (angle >= 0) ? angle : (2 * Math.PI + angle);
            angle = Math.round((180 / Math.PI) * angle) * (Math.PI / 180);

            // 画相交的点
            this.intersect.repaintPoint();

            // 画线段
            this.myCanvas.beginPath();
            this.myCanvas.lineWidth = Attribute.propWitdh;
            this.myCanvas.strokeStyle = Attribute.propNSStyle;
            this.myCanvas.moveTo(this.x, this.y);
            this.myCanvas.arc(this.x, this.y, r, angle, angle, this.anticlockwise);
            this.myCanvas.closePath();
            this.myCanvas.stroke();

            // 画起点
            this.myCanvas.beginPath();
            this.myCanvas.fillStyle = Attribute.propNFStyle;
            this.myCanvas.arc(this.x, this.y, Attribute.propPointR, 0, 2 * Math.PI, false);
            this.myCanvas.fill();

            // 画终点
            x = Math.cos(angle) * r + this.x;
            y = Math.sin(angle) * r + this.y;
            this.myCanvas.beginPath();
            this.myCanvas.fillStyle = Attribute.propNFStyle;
            this.myCanvas.arc(x, y, Attribute.propPointR, 0, 2 * Math.PI, false);
            this.myCanvas.fill();

            // 画尺子
            this.myCanvas.beginPath();
            this.myCanvas.strokeStyle = Attribute.propDSStyle;
            this.myCanvas.lineWidth = 2;
            this.myCanvas.moveTo(this.x, this.y);
            let rulep = this.rotatexy(this.x, this.y, 0, 20, angle);
            this.myCanvas.lineTo(rulep.x, rulep.y);
            rulep = this.rotatexy(this.x, this.y, r, 20, angle);
            this.myCanvas.lineTo(rulep.x, rulep.y);
            rulep = this.rotatexy(this.x, this.y, r, 0, angle);
            this.myCanvas.lineTo(rulep.x, rulep.y);
            this.myCanvas.strokeStyle = Attribute.propDSStyle;
            this.myCanvas.lineWidth = 2;
            for (let i = 10; i < r; i += 10) {
                rulep = this.rotatexy(this.x, this.y, i, 0, angle);
                this.myCanvas.moveTo(rulep.x, rulep.y);
                rulep = this.rotatexy(this.x, this.y, i, 5, angle);
                this.myCanvas.lineTo(rulep.x, rulep.y);
                i += 10;
                if (i < r) {
                    rulep = this.rotatexy(this.x, this.y, i, 0, angle);
                    this.myCanvas.moveTo(rulep.x, rulep.y);
                    rulep = this.rotatexy(this.x, this.y, i, 10, angle);
                    this.myCanvas.lineTo(rulep.x, rulep.y);
                }
            }
            this.myCanvas.stroke();

            // 画文本
            this.myCanvas.save();
            this.myCanvas.beginPath();
            this.myCanvas.translate(this.x, this.y);
            this.myCanvas.rotate(angle);
            this.myCanvas.font = Attribute.propFont;
            this.myCanvas.fillStyle = Attribute.propDFStyle;
            this.myCanvas.fillText(value + 'cm', r / 2 - 22, -30);
            this.myCanvas.restore();
        } else {
            return;
        }
    }

    /*
    * 监听mouseup事件
    * @param: e 事件
    */
    endCallBack(e: Event): void {
        if (this.eventFlag && this.eventCount === 1) {
            // 画点，但不保存，确定了点
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

            this.x += Attribute.mouseOffset;

            // 清楚画布并重绘图形
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
        } else if (this.eventFlag && this.eventCount === 2) {
            // 确定线段，保存数据
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

            x += Attribute.mouseOffset;

            // 清楚画布并重绘图形
            this.rePaint.clearCanvas();
            this.rePaint.rePaint();

            // 磁性吸附
            let dataXY = this.adsorption.adsorpToXY(x, y);
            x = dataXY.x;
            y = dataXY.y;

            let value = parseFloat((Math.sqrt(Math.pow(Math.abs(x - this.x), 2) + Math.pow(Math.abs(y - this.y), 2)) / Attribute.unitProp).toFixed(1));
            this.r = Math.round(value * Attribute.unitProp);
            if (this.r <= 4) {
                value = 0.1;
                this.r = 4;
            }
            let angle = Math.atan2((y - this.y), (x - this.x));
            angle = (angle >= 0) ? angle : (2 * Math.PI + angle);
            this.angle = Math.round((180 / Math.PI) * angle) * (Math.PI / 180);

            // 相交的点
            this.intersect.pointEach(this.data(), this.canvasData);
            // 画相交的点
            this.intersect.repaintPoint();

            // 画线段
            this.myCanvas.beginPath();
            this.myCanvas.lineWidth = Attribute.propWitdh;
            this.myCanvas.strokeStyle = Attribute.propDSStyle;
            this.myCanvas.moveTo(this.x, this.y);
            this.myCanvas.arc(this.x, this.y, this.r, this.angle, this.angle, this.anticlockwise);
            this.myCanvas.closePath();
            this.myCanvas.stroke();

            // 画起点
            this.myCanvas.beginPath();
            this.myCanvas.fillStyle = Attribute.propDFStyle;
            this.myCanvas.arc(this.x, this.y, Attribute.propPointR, 0, 2 * Math.PI, false);
            this.myCanvas.fill();

            // 画终点
            x = Math.cos(this.angle) * this.r + this.x;
            y = Math.sin(this.angle) * this.r + this.y;
            this.myCanvas.beginPath();
            this.myCanvas.fillStyle = Attribute.propDFStyle;
            this.myCanvas.arc(x, y, Attribute.propPointR, 0, 2 * Math.PI, false);
            this.myCanvas.fill();

            // 保存数据
            this.canvasData.setData(this.data());
            // 恢复按钮标志
            this.buttonListen.recoverButtonFlag();
        } else {
            return;
        }
    }

    /**
     * 返回坐标数据
     */
    data(): InterSegment {
        return { flag: this.flag, isChoosed: this.isChoosed, x: this.x, y: this.y, r: this.r, angle: this.angle, anticlockwise: this.anticlockwise };
    }

    /**
     * 旋转后的坐标
     * @param ox 原点x坐标
     * @param oy 原点y坐标
     * @param px 所求点的x坐标，此时以线段原点O为坐标原点，所求点P在x坐标上
     * @param py 所求点的y坐标，同上，x坐标向上为正，向下为负
     * @param angle 角度，顺时针
     */
    private rotatexy(ox: number, oy: number, px: number, py: number, angle: number): {x: number, y: number} {
        let x = px * Math.cos(angle) + py * Math.sin(angle) + ox;
        let y = px * Math.sin(angle) - py * Math.cos(angle) + oy;
        return {x: x, y: y};
    }
}