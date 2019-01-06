import { ToolsName, Color, Auxiliary, Attribute } from './enum/enum-configlib';
import { Tools, InterCircular, InterFan } from './interface/inter-toolslib';
import { CanvasChoosed } from './canvasChoosed';
import { CanvasData } from './canvasData';
import { RePaint } from './rePaint';
import { AuxiliaryListen } from './auxiliaryListen';
import { ButtonListen } from './buttonListen';

/**
 * 填充背景色
 */
export class FillColor {
    private eventClick: string;  // 点击事件名称
    private canvasChoosed: CanvasChoosed;  // 选中图形
    private canvasData: CanvasData;  // 存放canvas上的图形数据
    private rePaint: RePaint;  // 重绘图形
    private auxiliaryListen: AuxiliaryListen;  // 辅助工具
    private buttonListen: ButtonListen;  // 工具

    constructor(eventClick: string, canvasChoosed: CanvasChoosed, canvasData: CanvasData, rePaint: RePaint) {
        this.eventClick = eventClick;
        this.canvasChoosed = canvasChoosed;
        this.canvasData = canvasData;
        this.rePaint = rePaint;

        this.buttonBlack();
        this.buttonRed();
        this.buttonBlue();
        this.buttonGreen();
        this.buttonYellow();
        this.buttonPurple();
    }

    /**
     * 获取按钮标志
     * @param auxiliaryListen 辅助工具
     * @param buttonListen 工具
     */
    init(auxiliaryListen: AuxiliaryListen, buttonListen: ButtonListen): void {
        this.auxiliaryListen = auxiliaryListen;
        this.buttonListen = buttonListen;
    }

    /**
     * 监听颜色按钮的函数模板
     */
    private colorBtnListen(id: string, colorBtnFlag: Color): void {
        let that = this;
        document.getElementById(id).addEventListener(this.eventClick, function(e) {
            e = e || window.event;

            // 判断辅助工具和工具按钮是否已打开
            if (that.auxiliaryListen.getButtonFlag() !== Auxiliary.default || that.buttonListen.getButtonFlag() !== ToolsName.default) {
                return;
            }

            // 判断是否有图形被选中
            let index = that.canvasChoosed.getIndex();
            if (index.length === 0) {
                // 没有图形被选中
                return;
            } else if (index.length === 1) {
                // 圆被选中
                let data = that.canvasData.getData(index[0]) as Tools;
                if (data.flag === ToolsName.circular) {
                    (data as InterCircular).fillStyle = colorBtnFlag;
                }

                // 清除图形选中
                data.isChoosed = false;
                that.canvasChoosed.recoverIndex();
            } else if (index.length === 2) {
                // 扇形被选中
                let data = (that.canvasData.getData(index[0]) as InterCircular).fanAndRadius[index[1]];
                if (data.flag === ToolsName.fan) {
                    (data as InterFan).fillStyle = colorBtnFlag;
                }

                // 清除图形选中
                data.isChoosed = false;
                that.canvasChoosed.recoverIndex();
            }

            // 清除画板
            that.rePaint.clearCanvas();
            // 重绘图形
            that.rePaint.rePaint();
        }, false);
    }

    /**
     * 黑色按钮
     */
    private buttonBlack(): void {
        this.colorBtnListen(Attribute.colorBlackID, Color.black);
    }

    /**
     * 红色按钮
     */
    private buttonRed(): void {
        this.colorBtnListen(Attribute.colorRedID, Color.red);
    }

    /**
     * 蓝色按钮
     */
    private buttonBlue(): void {
        this.colorBtnListen(Attribute.colorBlueID, Color.blue);
    }

    /**
     * 绿色按钮
     */
    private buttonGreen(): void {
        this.colorBtnListen(Attribute.colorGreenID, Color.green);
    }

    /**
     * 黄色按钮
     */
    private buttonYellow(): void {
        this.colorBtnListen(Attribute.colorYellowID, Color.yellow);
    }

    /**
     * 紫色按钮
     */
    private buttonPurple(): void {
        this.colorBtnListen(Attribute.colorPurpleID, Color.purple);
    }
}
