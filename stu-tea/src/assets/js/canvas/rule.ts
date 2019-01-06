import { Attribute } from './enum/enum-configlib';
import { AuxiliaryListen } from './auxiliaryListen';
import { RePaint } from './rePaint';
import { Adsorption } from './adsorption';
import { CanvasData } from './canvasData';
import { Intersect } from './intersect';

/**
 * 尺子
 * false, 0
 * start(true, 1) --> move(true, 1) --> end(false, 2)
 * move(false, 2)
 * start(true, 3) --> move(true, 3) --> end(false, 0)
 */
export class Rule {
    private x: number;  // 起点x坐标
    private y: number;  // 起点y坐标
    private eventFlag: boolean;  // true表示开始点击，false表示结束点击
    private eventCount: number;  // 点击次数
    private isMobild: boolean;  // true为移动端，false为PC端
    private myCanvas: CanvasRenderingContext2D;  // canvas对象
    private myCanvasNode: HTMLElement;  // canvas节点
    private rePaint: RePaint;  // 重绘图形
    private auxiliaryListen: AuxiliaryListen;  // 辅助工具
    private canvasData: CanvasData;  // 存放数据
    private adsorption: Adsorption;  // 磁性吸附
    private intersect: Intersect;  // 相交

    constructor(isMobild: boolean, myCanvas: CanvasRenderingContext2D, myCanvasNode: HTMLElement, rePaint: RePaint, auxiliaryListen: AuxiliaryListen, canvasData: CanvasData, intersect: Intersect) {
        this.isMobild = isMobild;
        this.myCanvas = myCanvas;
        this.myCanvasNode = myCanvasNode;
        this.rePaint = rePaint;
        this.eventFlag = false;
        this.eventCount = 0;
        this.auxiliaryListen = auxiliaryListen;
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
            // 画直线
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

            // 画相交的点
            this.intersect.repaintPoint();

            // 画点
            this.myCanvas.beginPath();
            this.myCanvas.fillStyle = Attribute.propDFStyle;
            this.myCanvas.arc(this.x, this.y, Attribute.propPointR, 0, 2 * Math.PI, false);
            this.myCanvas.fill();

            let value = parseFloat((Math.sqrt(Math.pow((x - this.x), 2) + Math.pow((y - this.y), 2)) / Attribute.unitProp).toFixed(1));
            let r = Math.round(value * Attribute.unitProp);
            if (r <= 4) {
                value = 0.1;
                r = 4;
            }
            let angle = Math.atan2((y - this.y), (x - this.x));
            angle = (angle >= 0) ? angle : (2 * Math.PI + angle);

            // 画线段
            this.myCanvas.beginPath();
            this.myCanvas.lineWidth = Attribute.propWitdh;
            this.myCanvas.strokeStyle = Attribute.propNSStyle;
            this.myCanvas.moveTo(this.x, this.y);
            this.myCanvas.arc(this.x, this.y, r, angle, angle, false);
            this.myCanvas.stroke();

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
        }
    }

    /**
     * 监听mouseomove事件
     */
    moveCallback(e: Event): void {
        if (this.eventFlag && this.eventCount === 1) {
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
            // 画直线，并给出长度值

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

            // 画点
            this.myCanvas.beginPath();
            this.myCanvas.fillStyle = Attribute.propDFStyle;
            this.myCanvas.arc(this.x, this.y, Attribute.propPointR, 0, 2 * Math.PI, false);
            this.myCanvas.fill();

            let value = parseFloat((Math.sqrt(Math.pow((x - this.x), 2) + Math.pow((y - this.y), 2)) / Attribute.unitProp).toFixed(1));
            let r = Math.round(value * Attribute.unitProp);
            if (r <= 4) {
                value = 0.1;
                r = 4;
            }
            let angle = Math.atan2((y - this.y), (x - this.x));
            angle = (angle >= 0) ? angle : (2 * Math.PI + angle);

            // 画线段
            this.myCanvas.beginPath();
            this.myCanvas.lineWidth = Attribute.propWitdh;
            this.myCanvas.strokeStyle = Attribute.propNSStyle;
            this.myCanvas.moveTo(this.x, this.y);
            this.myCanvas.arc(this.x, this.y, r, angle, angle, false);
            this.myCanvas.stroke();

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
        } else if (this.eventFlag && this.eventCount === 3) {
            // 画直线

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

            // 画点
            this.myCanvas.beginPath();
            this.myCanvas.fillStyle = Attribute.propDFStyle;
            this.myCanvas.arc(this.x, this.y, Attribute.propPointR, 0, 2 * Math.PI, false);
            this.myCanvas.fill();

            let value = parseFloat((Math.sqrt(Math.pow((x - this.x), 2) + Math.pow((y - this.y), 2)) / Attribute.unitProp).toFixed(1));
            let r = Math.round(value * Attribute.unitProp);
            if (r <= 4) {
                value = 0.1;
                r = 4;
            }
            let angle = Math.atan2((y - this.y), (x - this.x));
            angle = (angle >= 0) ? angle : (2 * Math.PI + angle);

            // 画线段
            this.myCanvas.beginPath();
            this.myCanvas.lineWidth = Attribute.propWitdh;
            this.myCanvas.strokeStyle = Attribute.propNSStyle;
            this.myCanvas.moveTo(this.x, this.y);
            this.myCanvas.arc(this.x, this.y, r, angle, angle, false);
            this.myCanvas.stroke();

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
        }
    }

    /**
     * 监听mouseend事件
     */
    endCallback(e: Event): void {
        if (this.eventFlag && this.eventCount === 1) {
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
            this.myCanvas.arc(this.x, this.y, Attribute.propPointR, 0, 2 * Math.PI, false);
            this.myCanvas.fillStyle = Attribute.propDFStyle;
            this.myCanvas.fill();
        } else if (this.eventFlag && this.eventCount === 3) {
            // 确定直线
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

            // 画相交的点
            this.intersect.repaintPoint();

            // 画点
            this.myCanvas.beginPath();
            this.myCanvas.fillStyle = Attribute.propDFStyle;
            this.myCanvas.arc(this.x, this.y, Attribute.propPointR, 0, 2 * Math.PI, false);
            this.myCanvas.fill();

            let value = parseFloat((Math.sqrt(Math.pow((x - this.x), 2) + Math.pow((y - this.y), 2)) / Attribute.unitProp).toFixed(1));
            let r = Math.round(value * Attribute.unitProp);
            if (r <= 4) {
                value = 0.1;
                r = 4;
            }
            let angle = Math.atan2((y - this.y), (x - this.x));
            angle = (angle >= 0) ? angle : (2 * Math.PI + angle);

            // 画线段
            this.myCanvas.beginPath();
            this.myCanvas.lineWidth = Attribute.propWitdh;
            this.myCanvas.strokeStyle = Attribute.propDSStyle;
            this.myCanvas.moveTo(this.x, this.y);
            this.myCanvas.arc(this.x, this.y, r, angle, angle, false);
            this.myCanvas.stroke();

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

            // 恢复辅助按钮标志
            this.auxiliaryListen.recoverButtonFlag();
        }
    }

    /**
     * 求出范围，计算出四边形的四个顶点
     * @param x x坐标
     * @param y y坐标
     * @param offset 偏移量，x坐标向上为正，向下为负
     * @param angle 角度
     */
    private rangePoints(x: number, y: number, offset: number, angle: number): {x: number, y: number} {
        let ax = x * Math.pow(Math.cos(angle), 2) + x * Math.pow(Math.sin(angle), 2) + offset * Math.sin(angle);
        let ay = y * Math.pow(Math.cos(angle), 2) + y * Math.pow(Math.sin(angle), 2) + offset * Math.cos(angle);
        return { x: ax, y: ay };
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
        return { x, y };
    }
}
