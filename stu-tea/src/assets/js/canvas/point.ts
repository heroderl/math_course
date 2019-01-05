import { ToolsName, Attribute } from './enum/enum-configlib';
import { InterPoint } from './interface/inter-toolslib';
import { RePaint } from './rePaint';
import { CanvasData } from './canvasData';
import { ButtonListen } from './buttonListen';
import { Adsorption } from './adsorption';
import { Intersect } from './intersect';

/**
 * 点
 * false, 0
 * start(true, 1) --> move(true, 1) --> end(false, 0)
 */
export class Point implements InterPoint {
    flag: ToolsName;  // 标志
    x: number;  // x的坐标
    y: number;  // y的坐标
    isChoosed: boolean;  // true表示图形被选中，false表示未被选中
    lineWidth: number;  // 线宽
    private isMobild: boolean;  // true为移动端，false为PC端
    private myCanvas: CanvasRenderingContext2D;  // canvas对象
    private myCanvasNode: HTMLElement;  // canvas节点
    private canvasData: CanvasData;  // canvas图形数据
    private buttonListen: ButtonListen;  // 按钮监听事件
    private rePaint: RePaint;  // 重绘图形
    private eventFlag: boolean;  // true表示开始点击，false表示结束点击
    private adsorption: Adsorption;  // 磁性吸附
    private intersect: Intersect;  // 相交

    constructor(isMobild: boolean, myCanvas: CanvasRenderingContext2D, myCanvasNode: HTMLElement, rePaint: RePaint, canvasData: CanvasData, buttonListen: ButtonListen, intersect: Intersect) {
        this.flag = ToolsName.point;
        this.isMobild = isMobild;
        this.myCanvas = myCanvas;
        this.myCanvasNode = myCanvasNode;
        this.eventFlag = false;
        this.canvasData = canvasData;
        this.rePaint = rePaint;
        this.buttonListen = buttonListen;
        this.isChoosed = false;
        this.intersect = intersect;
        this.adsorption = new Adsorption(this.canvasData, this.intersect);
    }

    /**
     * 监听mousedown事件
     * @param: e Event事件
     */
    startCallBack(e: Event): void {
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
    }

    /**
     * 监听mousemove事件
     * @param: e Event事件
     */
    moveCallBack(e: Event): void {
        if (!this.eventFlag) return;

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
    }

    /**
     * 监听mouseup事件
     * @param: e Event事件
     */
    endCallBack(e: Event): void {
        if (!this.eventFlag) return;

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

        // 保存数据
        this.canvasData.setData(this.data());
        this.buttonListen.recoverButtonFlag();
        this.eventFlag = false;
    }

    /**
     * 返回坐标数据
     * @returns InterPoint
     */
    data(): InterPoint {
        return { flag: this.flag, isChoosed: this.isChoosed, x: this.x, y: this.y };
    }
}