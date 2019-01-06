import { ToolsName, Attribute } from './enum/enum-configlib';
import { InterLetterFlag } from './interface/inter-toolslib';
import { AuxiliaryListen } from './auxiliaryListen';
import { CanvasData } from './canvasData';

/**
 * 字母标志
 */
export class LetterFlag implements InterLetterFlag {
    x: number;  // 字母的x坐标
    y: number;  // 字母的y坐标
    text: string;  // 标志的内容
    flag: ToolsName;  // 标志
    isChoosed: boolean;  // 是否被选中，true表示被选中，false表示未被选中
    private eventFlag: boolean;  // true表示开始点击，false表示结束点击
    private eventCount: number;  // 点击次数
    private isMobild: boolean;  // true为移动端，false为PC端
    private myCanvas: CanvasRenderingContext2D;  // canvas对象
    private myCanvasNode: HTMLElement;  // canvas节点
    private auxiliaryListen: AuxiliaryListen;  // 辅助工具
    private canvasData: CanvasData;

    constructor(isMobild: boolean, myCanvas: CanvasRenderingContext2D, myCanvasNode: HTMLElement, auxiliaryListen: AuxiliaryListen, canvasData: CanvasData) {
        this.flag = ToolsName.letterFlag;
        this.isChoosed = false;
        this.eventFlag = false;
        this.eventCount = 0;
        this.isMobild = isMobild;
        this.myCanvas = myCanvas;
        this.myCanvasNode = myCanvasNode;
        this.auxiliaryListen = auxiliaryListen;
        this.canvasData = canvasData;

        this.inputListen();
        this.focusListen();
        this.blurListen();
    }

    /**
     * 监听mousedown事件
     */
    startCallback(e: Event): void {
        if (!this.eventFlag && this.eventCount === 0) {
            // 绘制可输入值的文本框
            this.eventFlag = true;
            this.eventCount = 1;

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
            this.text = '';

            let inputNode = document.getElementById(Attribute.btnInputFlagID);
            (inputNode as HTMLInputElement).value = '';
            inputNode.className = 'show';
            inputNode.style.left = this.x + 'px';
            inputNode.style.top = (this.y + 70) + 'px';

            this.endCallback(e);
        }
    }

    /**
     * 监听mousemove事件
     */
    moveCallback(e: Event): void {
        if (this.eventFlag && this.eventCount === 1) {
            // 不动
        }
    }

    /**
     * 监听mouseup事件
     */
    endCallback(e: Event): void {
        if (this.eventFlag && this.eventCount === 1) {
            // 保存文本的坐标数据，在文本框失去焦点时才保存数据
            this.eventFlag = false;
            this.eventCount = 0;

            // 恢复辅助按钮标志
            this.auxiliaryListen.recoverButtonFlag();

            // 文本框获得焦点
            setTimeout(function() {
                document.getElementById(Attribute.btnInputFlagID).focus();
            }, 100);
        }
    }

    /**
     * 文本的监听
     */
    private inputListen(): void {
        let that = this;
        document.getElementById(Attribute.btnInputFlagID).addEventListener('input', function(e) {
            let inputNode = (document.getElementById(e.srcElement.id) as HTMLInputElement);
            inputNode.value = inputNode.value.replace(/[^a-z]/gi, '');
            if (inputNode.value.length > 1) {
                inputNode.value = inputNode.value.slice(0, 1);
            }
        }, false);
    }

    /**
     * 监听focus事件，获取焦点
     */
    private focusListen(): void {
        let that = this;
        document.getElementById(Attribute.btnInputFlagID).addEventListener('focus', function(e) {
            (document.getElementById(e.srcElement.id) as HTMLInputElement).value = '';
        }, false);
    }

    /**
     * 监听blue事件，失去焦点
     */
    private blurListen(): void {
        let that = this;
        document.getElementById(Attribute.btnInputFlagID).addEventListener('blur', function(e) {
            let inputNode = (document.getElementById(e.srcElement.id) as HTMLInputElement);
            if (inputNode.value.length === 0) {
                inputNode.value = 'A';
            }
            that.text = inputNode.value;
            inputNode.className = 'hidden';

            that.canvasData.setData(that.data());

            that.myCanvas.beginPath();
            that.myCanvas.font = Attribute.propFont;
            that.myCanvas.fillStyle = Attribute.propDFStyle;
            that.myCanvas.fillText(that.text, that.x, that.y);
        }, false);
    }

    /**
     * 返回坐标数据
     */
    data(): InterLetterFlag {
        return { flag: this.flag, isChoosed: this.isChoosed, x: this.x, y: this.y, text: this.text };
    }
}
