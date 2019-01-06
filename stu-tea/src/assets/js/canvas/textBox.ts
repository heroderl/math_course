import { ToolsName, Auxiliary, Attribute } from './enum/enum-configlib';
import { Tools, InterCircular, InterSegment, InterFan, InterRadius, InterDiameter } from './interface/inter-toolslib';
import { CanvasChoosed } from './canvasChoosed';
import { CanvasData } from './canvasData';
import { RePaint } from './rePaint';
import { AuxiliaryListen } from './auxiliaryListen';
import { ButtonListen } from './buttonListen';
import { Intersect } from './intersect';

/**
 * 文本框输入值
 */
export class TextBox {
    private canvasChoosed: CanvasChoosed;  // 选中图形
    private canvasData: CanvasData;  // 存放canvas上的图形数据
    private rePaint: RePaint;  // 重绘图形
    private textFlag: boolean;  // true：表示文本框为输入状态，false：表示文本框为未输入状态
    private auxiliaryListen: AuxiliaryListen;  // 辅助工具
    private buttonListen: ButtonListen;  // 工具
    private oldtext: string;  // 旧文本值
    private index: number[];  // 选中图形的索引
    private intersect: Intersect;  // 相交

    constructor (canvasChoosed: CanvasChoosed, canvasData: CanvasData, rePaint: RePaint, intersect: Intersect) {
        this.canvasChoosed = canvasChoosed;
        this.canvasData = canvasData;
        this.rePaint = rePaint;
        this.textFlag = false;
        this.oldtext = '';
        this.index = [];
        this.intersect = intersect;

        this.inputListen();
        this.focusListen();
        this.blurListen();
    }

    /**
     * 引入其他标志
     */
    init (auxiliaryListen: AuxiliaryListen, buttonListen: ButtonListen): void {
        this.auxiliaryListen = auxiliaryListen;
        this.buttonListen = buttonListen;
    }

    /**
     * 监听input事件，文本框内容的改变
     */
    inputListen (): void {
        let that = this;
        document.getElementById(Attribute.btnTextValueID).addEventListener('input', function (e) {
            e = e || window.event;

            // 如果为长度，则输入到小数点后一位；如果为角度，则输入1-359
            let inputNode = (document.getElementById(Attribute.btnTextValueID) as HTMLInputElement);
            let value = inputNode.value;
            value = value.replace(/[^\d\.]/g, '').replace(/^\./g, '').replace(/\.{1,}/g, '.').replace(/^(\d+)\.(\d).*/, '$1.$2');
            inputNode.value = value;

            // 判断值的范围
            let index = that.canvasChoosed.getIndex();
            if (index.length === 2) {
                let tools = (that.canvasData.getData(index[0]) as InterCircular).fanAndRadius[index[1]];

                switch ((tools as Tools).flag) {
                case ToolsName.fan:
                    value = value.replace(/\.{1,}/g, '');
                    inputNode.value = value;
                    if (parseFloat(value) <= 0) {
                        inputNode.value = '1';
                    } else if (parseFloat(value) >= 360) {
                        inputNode.value = '359';
                    }
                    break;
                default: break;
                }
            }
        }, false);
    }

    /**
     * 监听blue事件，失去焦点
     */
    blurListen (): void {
        let that = this;
        document.getElementById(Attribute.btnTextValueID).addEventListener('blur', function (e) {
            e = e || FocusEvent.prototype;

            let inputNode = (document.getElementById(Attribute.btnTextValueID) as HTMLInputElement);

            if (that.index.length === 0) {
                // 判断是否选中图形，才能获得文本框输入
                if (that.canvasChoosed.getIndex().length === 0) {
                    return;
                }
                // 判断是否点击了辅助工具按钮和工具按钮
                if (that.auxiliaryListen.getButtonFlag() !== Auxiliary.default || that.buttonListen.getButtonFlag() !== ToolsName.default) {
                    return;
                }
            }

            // 改变图形
            let index = that.index;
            that.textFlag = false;
            if (index.length === 1) {
                let data = that.canvasData.getData(index[0]) as Tools;
                switch (data.flag) {
                case ToolsName.segment:
                        // 线段
                    if (inputNode.value.length === 0 || parseFloat(inputNode.value) === 0) {
                        inputNode.value = '0.1';
                    }
                    (data as InterSegment).r = parseFloat(inputNode.value) * Attribute.unitProp;
                    break;
                case ToolsName.circular:
                        // 圆
                    if (inputNode.value.length === 0 || parseFloat(inputNode.value) === 0) {
                        inputNode.value = '0.1';
                    }
                    (data as InterCircular).r = parseFloat(inputNode.value) * Attribute.unitProp;
                        // 圆上的扇形和半径和直径和弦也要跟着改变
                    let fanRad = (data as InterCircular).fanAndRadius;
                    for (let i of fanRad) {
                        switch (i.flag) {
                        case ToolsName.fan:
                            let temps = i as InterFan;
                            temps.r = parseFloat(inputNode.value) * Attribute.unitProp;
                            temps.hasChord.x = Math.cos(temps.startAngle) * temps.r + temps.x;
                            temps.hasChord.y = Math.sin(temps.startAngle) * temps.r + temps.y;
                            temps.hasChord.endX = Math.cos(temps.endAngle) * temps.r + temps.x;
                            temps.hasChord.endY = Math.sin(temps.endAngle) * temps.r + temps.y;
                            break;
                        case ToolsName.radius:
                            (i as InterRadius).r = parseFloat(inputNode.value) * Attribute.unitProp;
                            break;
                        case ToolsName.diameter:
                            (i as InterDiameter).r = parseFloat(inputNode.value) * Attribute.unitProp;
                            break;
                        default: break;
                        }
                    }
                    break;
                default: break;
                }
            } else if (index.length === 2) {
                let data = (that.canvasData.getData(index[0]) as InterCircular).fanAndRadius[index[1]] as InterFan;
                switch (data.flag) {
                case ToolsName.fan:
                        // 扇形
                    if (inputNode.value.length === 0 || parseInt(inputNode.value, 10) === 0) {
                        inputNode.value = '1';
                    }
                    if (data.startAngle <= data.endAngle) {
                        data.endAngle = (Math.PI / 180) * parseFloat(inputNode.value) + data.startAngle;
                    } else {
                        data.endAngle = (Math.PI / 180) * parseFloat(inputNode.value) - Math.PI * 2 + data.startAngle;
                    }

                        // 弦
                    data.hasChord.x = Math.cos(data.startAngle) * data.r + data.x;
                    data.hasChord.y = Math.sin(data.startAngle) * data.r + data.y;
                    data.hasChord.endX = Math.cos(data.endAngle) * data.r + data.x;
                    data.hasChord.endY = Math.sin(data.endAngle) * data.r + data.y;
                    break;
                default: break;
                }
            }

            // 取消图形选中
            that.canvasChoosed.cancleSelected();
            // 恢复选中图形的下标
            that.canvasChoosed.recoverIndex();
            // 清除图形
            that.rePaint.clearCanvas();
            // 重绘图形
            that.rePaint.rePaint();
            // 画相交的点
            that.intersect.repaintPoint();
            // 文本框值为空
            inputNode.value = '';
            // 清空index
            that.index = [];
        }, false);
    }

    /**
     * 监听focus事件，获取焦点
     */
    focusListen (): void {
        let that = this;
        document.getElementById(Attribute.btnTextValueID).addEventListener('focus', function (e) {
            e = e || FocusEvent.prototype;

            that.index = [];
            let inputNode = (document.getElementById(Attribute.btnTextValueID) as HTMLInputElement);

            // 判断是否选中图形，才能获得文本框输入
            if (that.canvasChoosed.getIndex().length === 0) {
                inputNode.blur();
                return;
            }
            // 判断是否点击了辅助工具按钮和工具按钮
            if (that.auxiliaryListen.getButtonFlag() !== Auxiliary.default || that.buttonListen.getButtonFlag() !== ToolsName.default) {
                inputNode.blur();
                return;
            }

            // 获取图形数据
            let index = that.canvasChoosed.getIndex();
            that.textFlag = true;
            if (index.length === 1) {
                // 线段，圆
                let data = that.canvasData.getData(index[0]) as Tools;
                switch (data.flag) {
                case ToolsName.circular:
                        // 获取圆的半径
                    inputNode.value = Math.round((data as InterCircular).r) / Attribute.unitProp + '';
                    break;
                case ToolsName.segment:
                        // 获取线段的长度
                    inputNode.value = Math.round((data as InterSegment).r) / Attribute.unitProp + '';
                    break;
                default:
                    inputNode.blur();
                    break;
                }
            } else if (index.length === 2) {
                // 扇形
                let data = (that.canvasData.getData(index[0]) as InterCircular).fanAndRadius[index[1]];
                switch (data.flag) {
                case ToolsName.fan:
                        // 获取扇形的圆心角
                    let startAngle = (data as InterFan).startAngle;
                    let endAngel = (data as InterFan).endAngle;
                    if (startAngle <= endAngel) {
                        inputNode.value = Math.round((180 / Math.PI) * (endAngel - startAngle)).toString();
                    } else {
                        inputNode.value = Math.round((180 / Math.PI) * (Math.PI * 2 - startAngle + endAngel)).toString();
                    }
                    break;
                default:
                    inputNode.blur();
                    break;
                }
            }
            that.index = index;

            that.oldtext = inputNode.value;
        }, false);
    }

    /**
     * 获取文本框标志
     */
    getTextFlag (): boolean {
        return this.textFlag;
    }

    /**
     * 恢复文本框标志
     */
    recoverTextFlag (): void {
        this.textFlag = false;
    }
}
