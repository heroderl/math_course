import { InterPoint, Tools, InterCircular, InterSegment, InterFan } from './interface/inter-toolslib';
import { RePaint } from './rePaint';
import { CanvasChoosed } from './canvasChoosed';
import { CanvasData } from './canvasData';
import { ToolsName } from './enum/enum-configlib';
import { Intersect } from './intersect';
import { Adsorption } from './adsorption';

/**
 * 移动图形
 */
export class MoveGraph {
    private myCanvasNode: HTMLElement;  // canvas节点
    private isMobild: boolean;  // true为移动端，false为PC端
    private rePaint: RePaint;  // 重绘图形
    private canvasChoosed: CanvasChoosed;  // 选中图形
    private canvasData: CanvasData;  // 存放canvas上的图形数据
    private startFlag: boolean;  // true表示鼠标按下，false表示鼠标释放
    private moveFlag: boolean;  // true表示图形移动过，false表示为移动
    private x: number;  // 旧的x坐标，不根据鼠标位置来定，而是图形的某一特殊点
    private y: number;  // 旧的y坐标，不根据鼠标位置来定，而是图形的某一特殊点
    private intersect: Intersect;  // 相交
    private adsorption: Adsorption;  // 磁性吸附

    constructor(myCanvasNode: HTMLElement, isMobild: boolean, rePaint: RePaint, canvasChoosed: CanvasChoosed, canvasData: CanvasData, intersect: Intersect) {
        this.myCanvasNode = myCanvasNode;
        this.isMobild = isMobild;
        this.rePaint = rePaint;
        this.canvasChoosed = canvasChoosed;
        this.canvasData = canvasData;
        this.startFlag = false;
        this.moveFlag = false;
        this.x = 0;
        this.y = 0;
        this.intersect = intersect;
        this.adsorption = new Adsorption(this.canvasData, this.intersect);
    }

    /**
     * 开始移动
     */
    start(e: Event): void {
        this.startFlag = true;
        this.moveFlag = false;

        if (this.isMobild) {
            // 移动端
            let event: TouchEvent = (e as TouchEvent);

            this.x = event.touches[0].clientX - this.myCanvasNode.getBoundingClientRect().left;
            this.y = event.touches[0].clientY - this.myCanvasNode.getBoundingClientRect().top;
        } else {
            // PC端
            let event: MouseEvent = (e as MouseEvent);

            this.x = event.clientX - this.myCanvasNode.getBoundingClientRect().left;
            this.y = event.clientY - this.myCanvasNode.getBoundingClientRect().top;
        }
    }

    /**
     * 结束移动
     * @return true表示图形移动过，不再执行click；false表示未移动，照常执行click
     */
    end(e: Event): boolean {
        if (!!this.moveFlag) {
            this.startFlag = false;
            this.moveFlag = false;

            // 图形移动后，清除选中
            let index = this.canvasChoosed.getIndex();
            if (index.length === 1) {
                (this.canvasData.getData(index[0]) as Tools).isChoosed = false;
            } else if (index.length === 2) {
                (this.canvasData.getData(index[0]) as InterCircular).fanAndRadius[index[1]].isChoosed = false;
            }

            this.canvasChoosed.recoverIndex();

            // 清楚画布并重绘图形
            this.rePaint.clearCanvas();
            this.rePaint.rePaint();
            // 找出所有的点
            this.intersect.pointNoSelEach();
            // 画相交的点
            this.intersect.repaintPoint();

            return true;
        }

        this.startFlag = false;
        this.moveFlag = false;

        return false;
    }

    /**
     * 移动点
     */
    movePoint(e: Event) {
        if (!this.startFlag) return;

        this.moveFlag = true;

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

        let index = this.canvasChoosed.getIndex();
        let data = this.canvasData.getData(index[0]) as Tools;

        data.x += x - this.x;
        data.y += y - this.y;

        // 磁性吸附
        let dataXY = this.adsorption.adsorpToXY(data.x, data.y, index);
        data.x = dataXY.x;
        data.y = dataXY.y;

        // 清楚画布并重绘图形
        this.rePaint.clearCanvas();
        this.rePaint.rePaint();
        // 找出所有的点
        this.intersect.pointNoSelEach();
        // 画相交的点
        this.intersect.repaintPoint();

        this.x = x;
        this.y = y;
    }

    /**
     * 移动线段
     */
    moveSegment(e: Event) {
        if (!this.startFlag) return;

        this.moveFlag = true;

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

        let index = this.canvasChoosed.getIndex();
        let data = this.canvasData.getData(index[0]) as Tools;

        data.x += x - this.x;
        data.y += y - this.y;

        // 磁性吸附
        let dataXY = this.adsorption.adsorpToXY(data.x, data.y, index);
        data.x = dataXY.x;
        data.y = dataXY.y;

        // 清楚画布并重绘图形
        this.rePaint.clearCanvas();
        this.rePaint.rePaint();
        // 找出所有的点
        this.intersect.pointNoSelEach();
        // 画相交的点
        this.intersect.repaintPoint();

        this.x = x;
        this.y = y;
    }

    /**
     * 移动圆形
     */
    moveCircular(e: Event) {
        if (!this.startFlag) return;

        this.moveFlag = true;

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

        let index = this.canvasChoosed.getIndex();
        let data = this.canvasData.getData(index[0]) as InterCircular;

        data.x += x - this.x;
        data.y += y - this.y;

        // 磁性吸附
        let dataXY = this.adsorption.adsorpToXY(data.x, data.y, index);
        data.x = dataXY.x;
        data.y = dataXY.y;

        for (let args of data.fanAndRadius) {
            // 扇形或半径或直径
            args.x = data.x;
            args.y = data.y;

            // 弦
            if (args.flag === ToolsName.fan) {
                let temps = args as InterFan;
                temps.hasChord.x = Math.cos(temps.startAngle) * temps.r + temps.x;
                temps.hasChord.y = Math.sin(temps.startAngle) * temps.r + temps.y;
                temps.hasChord.endX = Math.cos(temps.endAngle) * temps.r + temps.x;
                temps.hasChord.endY = Math.sin(temps.endAngle) * temps.r + temps.y;
            }
        }

        // 清楚画布并重绘图形
        this.rePaint.clearCanvas();
        this.rePaint.rePaint();
        // 找出所有的点
        this.intersect.pointNoSelEach();
        // 画相交的点
        this.intersect.repaintPoint();

        this.x = x;
        this.y = y;
    }

    /**
     * 移动字母标志
     */
    moveLetterFlag(e: Event) {
        if (!this.startFlag) return;

        this.moveFlag = true;

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

        let index = this.canvasChoosed.getIndex();
        let data = this.canvasData.getData(index[0]) as Tools;

        data.x += x - this.x;
        data.y += y - this.y;

        // 清楚画布并重绘图形
        this.rePaint.clearCanvas();
        this.rePaint.rePaint();
        // 找出所有的点
        this.intersect.pointNoSelEach();
        // 画相交的点
        this.intersect.repaintPoint();

        this.x = x;
        this.y = y;
    }
}