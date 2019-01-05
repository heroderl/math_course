import { ToolsName, Auxiliary, Attribute } from './enum/enum-configlib';
import { Tools, InterCircular, InterFan } from './interface/inter-toolslib';
import { CanvasChoosed } from './canvasChoosed';
import { CanvasData } from './canvasData';
import { RePaint } from './rePaint';
import { ButtonListen } from './buttonListen';
import { TextBox } from './textBox';
import { Intersect } from './intersect';

/**
 * 辅助工具
 */
export class AuxiliaryListen {
    private eventClick: string;
    private canvasChoosed: CanvasChoosed;
    private canvasData: CanvasData;
    private rePaint: RePaint;
    private auxiliaryFlag: Auxiliary;  // 辅助工具标志
    private buttonListen: ButtonListen;  // 按钮监听事件
    private textBox: TextBox;  // 文本框输入值
    private intersect: Intersect;  // 相交

    constructor(eventClick: string, canvasChoosed: CanvasChoosed, canvasData: CanvasData, rePaint: RePaint, intersect: Intersect) {
        this.eventClick = eventClick;
        this.canvasChoosed = canvasChoosed;
        this.canvasData = canvasData;
        this.rePaint = rePaint;
        this.auxiliaryFlag = Auxiliary.default;
        this.intersect = intersect;

        this.buttonRubber();
        this.buttonRule();
        this.buttonProtractor();
        this.buttonRotate();
        this.buttonFlag();
        this.buttonCancle();
    }

    /**
     * 引入其他标志
     */
    init(buttonListen: ButtonListen, textBox: TextBox): void {
        this.buttonListen = buttonListen;
        this.textBox = textBox;
    }

    /**
     * 按钮监听模板
     */
    private btnListen(id: string, callback: Function): void {
        let that = this;
        document.getElementById(id).addEventListener(that.eventClick, function(e) {
            e = e || window.event;

            // 防止按钮多按
            if (that.auxiliaryFlag !== Auxiliary.default) return;
            // 如果点了工具按钮，则不能使用辅助工具了
            if (that.buttonListen.getButtonFlag() !== ToolsName.default) return;
            // 如果点了文本框，则不能使用辅助工具了
            if (!!that.textBox.getTextFlag()) return;

            callback.call(that, e);
        }, false);
    }

    /**
     * 标志
     */
    private buttonFlag(): void {
        this.btnListen(Attribute.btnLetFlagID, function(e: Event) {
            this.auxiliaryFlag = Auxiliary.flag;
            e.srcElement.className = 'choosed';

            // 取消图形选中
            this.canvasChoosed.cancleSelected();
            this.canvasChoosed.recoverIndex();
            // 清除画布并重绘图形
            this.rePaint.clearCanvas();
            this.rePaint.rePaint();
            // 画相交的点
            this.intersect.repaintPoint();
        });
    }

    /**
     * 橡皮檫
     */
    private buttonRubber(): void {
        this.btnListen(Attribute.btnRubberID, function(e: Event) {
            let index = this.canvasChoosed.getIndex();
            if (index.length === 0) return;
            this.canvasData.delData(index);
            this.canvasChoosed.recoverIndex();

            // 清除画布
            this.rePaint.clearCanvas();
            // 重绘图形
            this.rePaint.rePaint();
            // 恢复按钮
            this.recoverButtonFlag();
            // 找出所有的点
            this.intersect.pointNoSelEach();
            // 画相交的点
            this.intersect.repaintPoint();
        });
    }

    /**
     * 尺子
     */
    private buttonRule(): void {
        this.btnListen(Attribute.btnRuleID, function(e: Event) {
            this.auxiliaryFlag = Auxiliary.rule;
            document.getElementById(Attribute.btnRuleID).className = 'choosed';

            // 取消图形选中
            this.canvasChoosed.cancleSelected();
            this.canvasChoosed.recoverIndex();
            // 清除画布并重绘图形
            this.rePaint.clearCanvas();
            this.rePaint.rePaint();
            // 画相交的点
            this.intersect.repaintPoint();
        });
    }

    /**
     * 量角器
     */
    private buttonProtractor(): void {
        this.btnListen(Attribute.btnProtractorID, function(e: Event) {
            this.auxiliaryFlag = Auxiliary.protractor;
            e.srcElement.className = 'choosed';

            // 取消图形选中
            this.canvasChoosed.cancleSelected();
            this.canvasChoosed.recoverIndex();
            // 清除画布并重绘图形
            this.rePaint.clearCanvas();
            this.rePaint.rePaint();
            // 画相交的点
            this.intersect.repaintPoint();
        });
    }

    /**
     * 旋转
     */
    private buttonRotate(): void {
        this.btnListen(Attribute.btnRotateID, function(e: Event) {
            // 必须先选中扇形或半径
            let index = this.canvasChoosed.getIndex();
            if (index.length === 1 && (this.canvasData.getData(index[0]) as Tools).flag === ToolsName.segment) {
                // 旋转线段，拉长多端线段
                this.auxiliaryFlag = Auxiliary.rotate;
                e.srcElement.className = 'choosed';
            } else if (index.length === 2 && (this.canvasData.getData(index[0]) as InterCircular).fanAndRadius[index[1]].flag === ToolsName.fan) {
                // 旋转扇形
                this.auxiliaryFlag = Auxiliary.rotate;
                e.srcElement.className = 'choosed';
            } else if (index.length === 2 && (this.canvasData.getData(index[0]) as InterCircular).fanAndRadius[index[1]].flag === ToolsName.radius) {
                // 旋转半径
                this.auxiliaryFlag = Auxiliary.rotate;
                e.srcElement.className = 'choosed';
            } else if (index.length === 2 && (this.canvasData.getData(index[0]) as InterCircular).fanAndRadius[index[1]].flag === ToolsName.diameter) {
                // 旋转直径
                this.auxiliaryFlag = Auxiliary.rotate;
                e.srcElement.className = 'choosed';
            } else {
                return;
            }
        });
    }

    /**
     * 撤销
     */
    private buttonCancle(): void {
        this.btnListen(Attribute.btnCancleID, function(e: Event) {
            // 清除图形的选中
            this.canvasChoosed.cancleSelected();
            this.canvasChoosed.recoverIndex();

            // 删除数组中最后一个
            let length = (this.canvasData.getData() as Tools[]).length;
            if (length !== 0) {
                let data = (this.canvasData.getData(length - 1) as Tools);
                if (data.flag === ToolsName.circular) {
                    let cir = (data as InterCircular).fanAndRadius;
                    if (cir.length !== 0) {
                        let tempsFan = cir[cir.length - 1];
                        if (tempsFan.flag === ToolsName.fan && !!(tempsFan as InterFan).hasChord.isShow) {
                            this.canvasData.delData([length - 1, cir.length - 1, -1]);
                        } else {
                            this.canvasData.delData([length - 1, cir.length - 1]);
                        }
                    } else {
                        this.canvasData.delData([length - 1]);
                    }
                } else {
                    this.canvasData.delData([length - 1]);
                }
            }

            // 清除画布
            this.rePaint.clearCanvas();
            // 重绘图形
            this.rePaint.rePaint();
            // 恢复按钮
            this.recoverButtonFlag();
            // 找出所有的点
            this.intersect.pointNoSelEach();
            // 画相交的点
            this.intersect.repaintPoint();
        });
    }

    /**
     * 获取辅助工具标志
     */
    getButtonFlag(): Auxiliary {
        return this.auxiliaryFlag;
    }

    /**
     * 恢复辅助工具标志
     */
    recoverButtonFlag(): void {
        this.auxiliaryFlag = Auxiliary.default;

        let arr = [Attribute.btnLetFlagID, Attribute.btnRubberID, Attribute.btnRuleID, Attribute.btnProtractorID, Attribute.btnRotateID, Attribute.btnCancleID];

        arr.forEach(function(item: Attribute) {
            document.getElementById(item.toString()).className = 'nochoosed';
        });
    }
}