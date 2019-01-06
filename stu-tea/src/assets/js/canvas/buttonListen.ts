import { ToolsName, Auxiliary, Attribute } from './enum/enum-configlib';
import { Tools, InterCircular, InterFan } from './interface/inter-toolslib';
import { RePaint } from './rePaint';
import { CanvasData } from './canvasData';
import { CanvasChoosed } from './canvasChoosed';
import { AuxiliaryListen } from './auxiliaryListen';
import { TextBox } from './textBox';
import { Intersect } from './intersect';

/**
 * 按钮监听事件
 */
export class ButtonListen {
    private buttonFlag: ToolsName;  // 按钮标志
    private eventClick: string;  // 点击事件名称
    private rePaint: RePaint;  // 重绘图形
    private canvasData: CanvasData;  // 存储画布上图形的数据
    private canvasChoosed: CanvasChoosed;  // 选中图形
    private auxiliaryTools: AuxiliaryListen;  // 辅助工具
    private textBox: TextBox;  // 文本框输入值
    private intersect: Intersect;  // 相交

    constructor (eventClick: string, rePaint: RePaint, canvasData: CanvasData, canvasChoosed: CanvasChoosed, intersect: Intersect) {
        this.buttonFlag = ToolsName.default;
        this.eventClick = eventClick;
        this.rePaint = rePaint;
        this.canvasData = canvasData;
        this.canvasChoosed = canvasChoosed;
        this.intersect = intersect;
        this.buttonPoint();
        this.buttonSegment();
        this.buttonCircular();
        this.buttonFan();
        this.buttonRadius();
        this.buttonDiameter();
        this.buttonChord();
        // this.buttonTangent();
    }

    /**
     * 引入其他标志
     */
    init (auxiliaryTools: AuxiliaryListen, textBox: TextBox): void {
        this.auxiliaryTools = auxiliaryTools;
        this.textBox = textBox;
    }

    // 按钮监听函数模板
    private buttonListen (id: string, eventClick: string, buttonFlag: ToolsName): void {
        let _self = this;
        document.getElementById(id).addEventListener(eventClick, function (e) {
            e = e || window.event;

            // 防止多按
            if (_self.buttonFlag !== ToolsName.default) return;

            // 判断辅助工具按钮是否打开
            if (_self.auxiliaryTools.getButtonFlag() !== Auxiliary.default) return;
            // 判断文本框输入值是否打开
            if (_self.textBox.getTextFlag()) return;

            // 画扇形，半径，直径前必须选中圆形
            let index = _self.canvasChoosed.getIndex();
            if (buttonFlag === ToolsName.fan || buttonFlag === ToolsName.radius || buttonFlag === ToolsName.diameter) {
                if (index.length === 1) {
                    // 点，线段，圆
                    if ((_self.canvasData.getData(index[0]) as Tools).flag !== ToolsName.circular) {
                        return;
                    }
                } else {
                    return;
                }

                // 清除图形的选中
                _self.canvasChoosed.cancleSelected();
                // 设置按钮为选中
                _self.buttonFlag = buttonFlag;
                e.srcElement.className = 'choosed';
            } else if (buttonFlag === ToolsName.chord) {
                if (index.length === 2) {
                    // 显示弦
                    if ((_self.canvasData.getData(index[0]) as InterCircular).fanAndRadius[index[1]].flag === ToolsName.fan) {
                        let temp = (_self.canvasData.getData(index[0]) as InterCircular).fanAndRadius[index[1]] as InterFan;
                        temp.hasChord.isShow = true;
                    } else {
                        return;
                    }
                } else {
                    return;
                }

                // 清除图形的选中
                _self.canvasChoosed.cancleSelected();
                // 清除选中图形的索引
                _self.canvasChoosed.recoverIndex();
                // 设置按钮为未选中
                _self.buttonFlag = ToolsName.default;
                e.srcElement.className = 'nochoosed';
            } else {
                // 清除图形的选中
                _self.canvasChoosed.cancleSelected();
                // 清除选中图形的索引
                _self.canvasChoosed.recoverIndex();
                // 设置按钮为选中
                _self.buttonFlag = buttonFlag;
                e.srcElement.className = 'choosed';
            }

            // 清除画布
            _self.rePaint.clearCanvas();
            // 重绘画布
            _self.rePaint.rePaint();
            // 重绘交点
            _self.intersect.repaintPoint();
        }, false);
    }

    // 按钮点的监听
    private buttonPoint (): void {
        this.buttonListen(Attribute.btnPointID, this.eventClick, ToolsName.point);
    }

    // 按钮线段的监听
    private buttonSegment (): void {
        this.buttonListen(Attribute.btnSegmentID, this.eventClick, ToolsName.segment);
    }

    // 按钮圆的监听
    private buttonCircular (): void {
        this.buttonListen(Attribute.btnCircularID, this.eventClick, ToolsName.circular);
    }

    // 按钮扇形的监听
    private buttonFan (): void {
        this.buttonListen(Attribute.btnFanID, this.eventClick, ToolsName.fan);
    }

    // 按钮半径的监听
    private buttonRadius (): void {
        this.buttonListen(Attribute.btnRadiusID, this.eventClick, ToolsName.radius);
    }

    // 按钮直径的监听
    private buttonDiameter (): void {
        this.buttonListen(Attribute.btnDiameterID, this.eventClick, ToolsName.diameter);
    }

    // 按钮弦的监听
    private buttonChord (): void {
        this.buttonListen(Attribute.btnChordID, this.eventClick, ToolsName.chord);
    }

    // 按钮切线的监听
    private buttonTangent (): void {
        this.buttonListen(Attribute.btnTangentID, this.eventClick, ToolsName.tangent);
    }

    // 获得按钮标志
    getButtonFlag (): ToolsName {
        return this.buttonFlag;
    }

    // 按钮标志恢复默认
    recoverButtonFlag (): void {
        this.buttonFlag = ToolsName.default;

        let arr = [Attribute.btnPointID, Attribute.btnSegmentID, Attribute.btnCircularID, Attribute.btnFanID, Attribute.btnRadiusID, Attribute.btnDiameterID, Attribute.btnChordID /*Attribute.btnTangentID*/];

        arr.forEach(function (item: Attribute) {
            document.getElementById(item.toString()).className = 'nochoosed';
        });
    }
}
