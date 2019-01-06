import { Attribute, ToolsName } from './enum/enum-configlib';
import { Tools, InterCircular, InterFan, InterRadius, InterSegment, InterDiameter } from './interface/inter-toolslib';
import { AuxiliaryListen } from './auxiliaryListen';
import { RePaint } from './rePaint';
import { CanvasData } from './canvasData';
import { CanvasChoosed } from './canvasChoosed';
import { Intersect } from './intersect';

/**
 * 旋转
 * false, 0
 * start(true, 1) --> move(true, 1) --> end(false, 0)
 */
export class Rotate {
    private x: number;  // 圆心x坐标
    private y: number;  // 圆心y坐标
    private oldAngle: number;  // 旧角度
    private newAngle: number;  // 新角度
    private index: number[];  // 被选中图形下标
    private oldXY: number;  // 保存就的鼠标里线段起点的距离
    private eventFlag: boolean;  // true表示开始点击，false表示结束点击
    private eventCount: number;  // 点击次数
    private isMobild: boolean;  // true为移动端，false为PC端
    private myCanvas: CanvasRenderingContext2D;  // canvas对象
    private myCanvasNode: HTMLElement;  // canvas节点
    private rePaint: RePaint;  // 重绘图形
    private auxiliaryListen: AuxiliaryListen;  // 辅助工具
    private canvasData: CanvasData;  // 存放canvas上的图形数据
    private canvasChoosed: CanvasChoosed;  // 选中图形
    private intersect: Intersect;  // 相交

    constructor(isMobild: boolean, myCanvas: CanvasRenderingContext2D, myCanvasNode: HTMLElement, rePaint: RePaint, auxiliaryListen: AuxiliaryListen, canvasData: CanvasData, canvasChoosed: CanvasChoosed, intersect: Intersect) {
        this.isMobild = isMobild;
        this.myCanvas = myCanvas;
        this.myCanvasNode = myCanvasNode;
        this.rePaint = rePaint;
        this.eventFlag = false;
        this.eventCount = 0;
        this.auxiliaryListen = auxiliaryListen;
        this.canvasData = canvasData;
        this.canvasChoosed = canvasChoosed;
        this.intersect = intersect;
    }

    /**
     * 监听mousedown事件
     */
    startCallback(e: Event): void {
        if (!this.eventFlag && this.eventCount === 0) {
            // 不动
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
            this.index = this.canvasChoosed.getIndex();
            this.x = (this.canvasData.getData(this.index[0]) as Tools).x;
            this.y = (this.canvasData.getData(this.index[0]) as Tools).y;
            let angle = Math.atan2((y - this.y), (x - this.x));
            this.newAngle = (angle >= 0) ? angle : (2 * Math.PI + angle);
            this.oldXY = Math.sqrt(Math.pow((x - this.x), 2) + Math.pow((y - this.y), 2));
        }
    }

    /**
     * 监听mouseomove事件
     */
    moveCallback(e: Event): void {
        if (this.eventFlag && this.eventCount === 1) {
            // 旋转扇形或半径或线段

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

            this.oldAngle = this.newAngle;
            let angle = Math.atan2((y - this.y), (x - this.x));
            angle = (angle >= 0) ? angle : (2 * Math.PI + angle);
            this.newAngle = angle;
            let cirAngle = Math.round((this.newAngle - this.oldAngle) * (180 / Math.PI)) * (Math.PI / 180);
            let newXY = Math.sqrt(Math.pow((x - this.x), 2) + Math.pow((y - this.y), 2));

            let tools;
            if (this.index.length === 1) {
                tools = this.canvasData.getData(this.index[0]) as Tools;
            } else if (this.index.length === 2) {
                tools = (this.canvasData.getData(this.index[0]) as InterCircular).fanAndRadius[this.index[1]];
            }
            let data;
            if (tools.flag === ToolsName.fan) {
                // 扇形旋转
                data = tools as InterFan;

                data.startAngle = (data.startAngle + cirAngle) % (2 * Math.PI);
                data.endAngle = (data.endAngle + cirAngle) % (2 * Math.PI);

                data.startAngle = (data.startAngle < 0) ? (2 * Math.PI + data.startAngle) : data.startAngle;
                data.endAngle = (data.endAngle < 0) ? (2 * Math.PI + data.endAngle) : data.endAngle;

                data.hasChord.x = Math.cos(data.startAngle) * data.r + data.x;
                data.hasChord.y = Math.sin(data.startAngle) * data.r + data.y;
                data.hasChord.endX = Math.cos(data.endAngle) * data.r + data.x;
                data.hasChord.endY = Math.sin(data.endAngle) * data.r + data.y;

                // 清除画布并重绘图形
                this.rePaint.clearCanvas();
                this.rePaint.rePaint();
                // 找出所有的点
                this.intersect.pointNoSelEach();
                // 画相交的点
                this.intersect.repaintPoint();
            } else if (tools.flag === ToolsName.radius) {
                // 半径旋转
                data = tools as InterRadius;

                data.angle = (data.angle + cirAngle) % (2 * Math.PI);
                data.angle = (data.angle < 0) ? (2 * Math.PI + data.angle) : data.angle;

                // 清除画布并重绘图形
                this.rePaint.clearCanvas();
                this.rePaint.rePaint();
                // 找出所有的点
                this.intersect.pointNoSelEach();
                // 画相交的点
                this.intersect.repaintPoint();
            } else if (tools.flag === ToolsName.diameter) {
                // 直径旋转
                data = tools as InterDiameter;

                data.angle = (data.angle + cirAngle) % (2 * Math.PI);
                data.angle = (data.angle < 0) ? (2 * Math.PI + data.angle) : data.angle;

                // 清除画布并重绘图形
                this.rePaint.clearCanvas();
                this.rePaint.rePaint();
                // 找出所有的点
                this.intersect.pointNoSelEach();
                // 画相交的点
                this.intersect.repaintPoint();
            } else if (tools.flag === ToolsName.segment) {
                // 线段旋转，拉长，缩短
                data = tools as InterSegment;

                // 旋转
                data.angle = (data.angle + cirAngle) % (2 * Math.PI);
                data.angle = (data.angle < 0) ? (2 * Math.PI + data.angle) : data.angle;

                // 伸缩
                data.r += newXY - this.oldXY;
                data.r = parseFloat((data.r / Attribute.unitProp).toFixed(1));
                data.r = Math.round(data.r * Attribute.unitProp);
                if (data.r < (Attribute.unitProp * 0.1)) {
                    data.r = Attribute.unitProp * 0.1;
                }
                this.oldXY = newXY;

                // 清楚画布并重绘图形
                this.rePaint.clearCanvas();
                this.rePaint.rePaint();

                // 找出所有的点
                this.intersect.pointNoSelEach();
                // 画相交的点
                this.intersect.repaintPoint();

                // 画起点
                this.myCanvas.beginPath();
                this.myCanvas.fillStyle = Attribute.propNFStyle;
                this.myCanvas.arc(data.x, data.y, Attribute.propPointR, 0, 2 * Math.PI, false);
                this.myCanvas.fill();

                // 画终点
                let x = Math.cos(data.angle) * data.r + data.x;
                let y = Math.sin(data.angle) * data.r + data.y;
                this.myCanvas.beginPath();
                this.myCanvas.fillStyle = Attribute.propNFStyle;
                this.myCanvas.arc(x, y, Attribute.propPointR, 0, 2 * Math.PI, false);
                this.myCanvas.fill();

                // 画尺子
                this.myCanvas.beginPath();
                this.myCanvas.strokeStyle = Attribute.propDSStyle;
                this.myCanvas.lineWidth = 2;
                this.myCanvas.moveTo(data.x, data.y);
                let rulep = this.rotatexy(data.x, data.y, 0, 20, data.angle);
                this.myCanvas.lineTo(rulep.x, rulep.y);
                rulep = this.rotatexy(data.x, data.y, data.r, 20, data.angle);
                this.myCanvas.lineTo(rulep.x, rulep.y);
                rulep = this.rotatexy(data.x, data.y, data.r, 0, data.angle);
                this.myCanvas.lineTo(rulep.x, rulep.y);
                this.myCanvas.strokeStyle = Attribute.propDSStyle;
                this.myCanvas.lineWidth = 2;
                for (let i = 10; i < data.r; i += 10) {
                    rulep = this.rotatexy(data.x, data.y, i, 0, data.angle);
                    this.myCanvas.moveTo(rulep.x, rulep.y);
                    rulep = this.rotatexy(data.x, data.y, i, 5, data.angle);
                    this.myCanvas.lineTo(rulep.x, rulep.y);
                    i += 10;
                    if (i < data.r) {
                        rulep = this.rotatexy(data.x, data.y, i, 0, data.angle);
                        this.myCanvas.moveTo(rulep.x, rulep.y);
                        rulep = this.rotatexy(data.x, data.y, i, 10, data.angle);
                        this.myCanvas.lineTo(rulep.x, rulep.y);
                    }
                }
                this.myCanvas.stroke();

                // 画文本
                this.myCanvas.save();
                this.myCanvas.beginPath();
                this.myCanvas.translate(data.x, data.y);
                this.myCanvas.rotate(data.angle);
                this.myCanvas.font = Attribute.propFont;
                this.myCanvas.fillStyle = Attribute.propDFStyle;
                this.myCanvas.fillText((data.r / Attribute.unitProp) + 'cm', data.r / 2 - 22, -30);
                this.myCanvas.restore();
            }
        }
    }

    /**
     * 监听mouseend事件
     */
    endCallback(e: Event): void {
        if (this.eventFlag && this.eventCount === 1) {
            // 不动
            this.eventFlag = false;
            this.eventCount = 0;

            // 恢复辅助按钮标志
            this.auxiliaryListen.recoverButtonFlag();

            // 清除图形选中
            this.canvasChoosed.cancleSelected();
            this.canvasChoosed.recoverIndex();

            // 清除画布并重绘图形
            this.rePaint.clearCanvas();
            this.rePaint.rePaint();
            // 找出所有的点
            this.intersect.pointNoSelEach();
            // 画相交的点
            this.intersect.repaintPoint();
        }
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
