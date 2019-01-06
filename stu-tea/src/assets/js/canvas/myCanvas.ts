import { ToolsName, Auxiliary, Attribute } from './enum/enum-configlib';
import { Tools, InterCircular } from './interface/inter-toolslib';
import { Point } from './point';
import { CanvasData } from './canvasData';
import { RePaint } from './rePaint';
import { ButtonListen } from './buttonListen';
import { Segment } from './segment';
import { Circular } from './circular';
import { CanvasChoosed } from './canvasChoosed';
import { Fan } from './fan';
import { Radius } from './radius';
import { TextBox } from './textBox';
import { FillColor } from './fillColor';
import { AuxiliaryListen } from './auxiliaryListen';
import { Rule } from './rule';
import { Protractor } from './protractor';
import { Rotate } from './rotate';
import { LetterFlag } from './letterFlag';
import { MoveGraph } from './moveGraph';
import { Intersect } from './intersect';
import { Diameter } from './diameter';

export default class MyCanvas {
    myCanvasNode: HTMLElement;  // canvas节点
    myCanvas: CanvasRenderingContext2D;  // canvas对象
    canvasData: CanvasData;  // 存放canvas上的图形数据
    rePaint: RePaint;  // 重绘图形
    private intersect: Intersect;  // 相交
    private buttonListen: ButtonListen;  // 按钮监听事件
    private cvsClick: boolean;  // Canvas上的click事件，true表示执行click事件，false表示不执行click事件
    private canvasChoosed: CanvasChoosed;  // 选中图形
    private textBox: TextBox;  // 文本框对象
    private fillColor: FillColor;  // 填充背景色
    private auxiliaryListen: AuxiliaryListen;  // 辅助工具的监听
    private moveGraph: MoveGraph;  // 移动图形

    eventClick: string;  // 点击事件
    eventStart: string;  // 开始点击事件
    eventMove: string;  // 拖动事件
    eventEnd: string;  // 结束点击事件

    point: Point;  // 点的对象
    segment: Segment;  // 线段的对象
    circular: Circular;  // 圆的对象
    fan: Fan;  // 扇形的对象
    radius: Radius;  // 半径的对象
    diameter: Diameter;  // 直径的对象

    rule: Rule;  // 尺子
    protractor: Protractor;  // 量角器
    rotate: Rotate;  // 旋转
    letterFlag: LetterFlag;  // 字母标志

    constructor () {
        this.eventClick = this.isMobile() ? 'click' : 'click';
        this.eventStart = this.isMobile() ? 'touchstart' : 'mousedown';
        this.eventMove = this.isMobile() ? 'touchmove' : 'mousemove';
        this.eventEnd = this.isMobile() ? 'touchend' : 'mouseup';

        this.myCanvasNode = document.getElementById(Attribute.canvasID);
        this.myCanvas = (this.myCanvasNode as HTMLCanvasElement).getContext('2d');
        this.myCanvas.fillStyle = 'white';
        this.myCanvas.fillRect(0, 0, this.myCanvasNode.clientWidth, this.myCanvasNode.clientHeight);
        this.canvasData = new CanvasData();
        this.rePaint = new RePaint(this.myCanvas, this.myCanvasNode, (this.canvasData.getData() as Tools[]));
        this.cvsClick = false;
        this.canvasChoosed = new CanvasChoosed(this.isMobile(), this.canvasData, this.myCanvasNode);
        this.intersect = new Intersect(this.myCanvas, this.canvasChoosed, this.canvasData);
        this.buttonListen = new ButtonListen(this.eventClick, this.rePaint, this.canvasData, this.canvasChoosed, this.intersect);
        this.textBox = new TextBox(this.canvasChoosed, this.canvasData, this.rePaint, this.intersect);
        this.fillColor = new FillColor(this.eventClick, this.canvasChoosed, this.canvasData, this.rePaint);
        this.auxiliaryListen = new AuxiliaryListen(this.eventClick, this.canvasChoosed, this.canvasData, this.rePaint, this.intersect);
        this.moveGraph = new MoveGraph(this.myCanvasNode, this.isMobile(), this.rePaint, this.canvasChoosed, this.canvasData, this.intersect);

        this.newTools();
        this.auxiTools();
        this.buttonListen.init(this.auxiliaryListen, this.textBox);
        this.auxiliaryListen.init(this.buttonListen, this.textBox);
        this.textBox.init(this.auxiliaryListen, this.buttonListen);
        this.fillColor.init(this.auxiliaryListen, this.buttonListen);
    }

    // 判断是移动端还是电脑端
    private isMobile (): boolean {
        let sUserAgent: string = navigator.userAgent.toLowerCase();
        let bIsIpad: boolean = (/ipad/i).test(sUserAgent);
        let bIsIphoneOs: boolean = (/iphone os/i).test(sUserAgent);
        let bIsMidp: boolean = (/midp/i).test(sUserAgent);
        let bIsUc7: boolean = (/rv:1.2.3.4/i).test(sUserAgent);
        let bIsUc: boolean = (/ucweb/i).test(sUserAgent);
        let bIsAndroid: boolean = (/android/i).test(sUserAgent);
        let bIsCE: boolean = (/windows ce/i).test(sUserAgent);
        let bIsWM: boolean = (/windows mobile/i).test(sUserAgent);

        if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
            return true;
        } else {
            return false;
        }
    }

    // 新建图形对象
    private newTools (): void {
        this.point = new Point(this.isMobile(), this.myCanvas, this.myCanvasNode, this.rePaint, this.canvasData, this.buttonListen, this.intersect);
        this.segment = new Segment(this.isMobile(), this.myCanvas, this.myCanvasNode, this.rePaint, this.buttonListen, this.canvasData, this.intersect);
        this.circular = new Circular(this.isMobile(), this.myCanvas, this.myCanvasNode, this.rePaint, this.buttonListen, this.canvasData, this.intersect);
        this.fan = new Fan(this.isMobile(), this.myCanvas, this.myCanvasNode, this.rePaint, this.buttonListen, this.canvasData, this.canvasChoosed, this.intersect);
        this.radius = new Radius(this.isMobile(), this.myCanvas, this.myCanvasNode, this.rePaint, this.buttonListen, this.canvasData, this.canvasChoosed, this.intersect);
        this.diameter = new Diameter(this.isMobile(), this.myCanvas, this.myCanvasNode, this.rePaint, this.buttonListen, this.canvasData, this.canvasChoosed, this.intersect);
    }

    // 辅助工具对象
    private auxiTools (): void {
        this.rule = new Rule(this.isMobile(), this.myCanvas, this.myCanvasNode, this.rePaint, this.auxiliaryListen, this.canvasData, this.intersect);
        this.protractor = new Protractor(this.isMobile(), this.myCanvas, this.myCanvasNode, this.rePaint, this.auxiliaryListen, this.canvasData, this.intersect);
        this.rotate = new Rotate(this.isMobile(), this.myCanvas, this.myCanvasNode, this.rePaint, this.auxiliaryListen, this.canvasData, this.canvasChoosed, this.intersect);
        this.letterFlag = new LetterFlag(this.isMobile(), this.myCanvas, this.myCanvasNode, this.auxiliaryListen, this.canvasData);
    }

    // 监听mousedown事件
    startListen (): void {
        let _self: MyCanvas = this;
        this.myCanvasNode.addEventListener(this.eventStart, function (e) {
            e = e || window.event;
            _self.cvsClick = false;

            // 右侧工具
            switch (_self.buttonListen.getButtonFlag()) {
            case ToolsName.point:
                _self.point.startCallBack(e);
                return;
            case ToolsName.segment:
                _self.segment.startCallBack(e);
                return;
            case ToolsName.fan:
                _self.fan.startCallBack(e);
                return;
            case ToolsName.circular:
                _self.circular.startCallBack(e);
                return;
            case ToolsName.radius:
                _self.radius.startCallBack(e);
                return;
            case ToolsName.diameter:
                _self.diameter.startCallBack(e);
                return;
            case ToolsName.tangent: return;
            case ToolsName.default:
                _self.cvsClick = true;
                break;
            default: return;
            }

            // 顶部辅助工具
            _self.cvsClick = false;
            switch (_self.auxiliaryListen.getButtonFlag()) {
            case Auxiliary.rule:
                _self.rule.startCallback(e);
                return;
            case Auxiliary.flag:
                _self.letterFlag.startCallback(e);
                return;
            case Auxiliary.protractor:
                _self.protractor.startCallback(e);
                return;
            case Auxiliary.rotate:
                _self.rotate.startCallback(e);
                return;
            case Auxiliary.default:
                _self.cvsClick = true;
                break;
            default: return;
            }

            // 图形移动
            _self.moveGraph.start(e);
        }, false);
    }

    // 监听mousemove事件
    moveListen (): void {
        let _self = this;
        this.myCanvasNode.addEventListener(this.eventMove, function (e) {
            e = e || window.event;

            switch (_self.buttonListen.getButtonFlag()) {
            case ToolsName.point:
                _self.point.moveCallBack(e);
                break;
            case ToolsName.segment:
                _self.segment.moveCallBack(e);
                break;
            case ToolsName.fan:
                _self.fan.moveCallBack(e);
                break;
            case ToolsName.circular:
                _self.circular.moveCallBack(e);
                break;
            case ToolsName.radius:
                _self.radius.moveCallBack(e);
                break;
            case ToolsName.diameter:
                _self.diameter.moveCallBack(e);
                break;
            case ToolsName.tangent: break;
            case ToolsName.default: break;
            default: return;
            }

            switch (_self.auxiliaryListen.getButtonFlag()) {
            case Auxiliary.rule:
                _self.rule.moveCallback(e);
                break;
            case Auxiliary.flag:
                _self.letterFlag.moveCallback(e);
                return;
            case Auxiliary.protractor:
                _self.protractor.moveCallback(e);
                break;
            case Auxiliary.rotate:
                _self.rotate.moveCallback(e);
                break;
            case Auxiliary.default:
                break;
            default: return;
            }

            // 图形移动
            let index = _self.canvasChoosed.getIndex();
            if (index.length === 1) {
                switch ((_self.canvasData.getData(index[0]) as Tools).flag) {
                case ToolsName.point:
                    _self.moveGraph.movePoint(e);
                    return;
                case ToolsName.segment:
                    _self.moveGraph.moveSegment(e);
                    return;
                case ToolsName.circular:
                    _self.moveGraph.moveCircular(e);
                    return;
                case ToolsName.letterFlag:
                    _self.moveGraph.moveLetterFlag(e);
                    return;
                case ToolsName.default:
                    break;
                default: return;
                }
            }
        }, false);
    }

    // 监听mouseend事件
    endListen (): void {
        let _self: MyCanvas = this;
        this.myCanvasNode.addEventListener(this.eventEnd, function (e) {
            e = e || window.event;

            switch (_self.buttonListen.getButtonFlag()) {
            case ToolsName.point:
                _self.point.endCallBack(e);
                return;
            case ToolsName.segment:
                _self.segment.endCallBack(e);
                return;
            case ToolsName.fan:
                _self.fan.endCallBack(e);
                return;
            case ToolsName.circular:
                _self.circular.endCallBack(e);
                return;
            case ToolsName.radius:
                _self.radius.endCallBack(e);
                return;
            case ToolsName.diameter:
                _self.diameter.endCallBack(e);
                return;
            case ToolsName.tangent: return;
            case ToolsName.default: break;
            default: return;
            }

            switch (_self.auxiliaryListen.getButtonFlag()) {
            case Auxiliary.rule:
                _self.rule.endCallback(e);
                return;
            case Auxiliary.flag:
                _self.letterFlag.endCallback(e);
                return;
            case Auxiliary.protractor:
                _self.protractor.endCallback(e);
                return;
            case Auxiliary.rotate:
                _self.rotate.endCallback(e);
                return;
            case Auxiliary.default:
                break;
            default: return;
            }

            // 图形移动
            if (_self.moveGraph.end(e)) {
                _self.cvsClick = false;
            }
        }, false);
    }

    // 监听click事件
    clickListen (): void {
        let _self: MyCanvas = this;
        this.myCanvasNode.addEventListener(this.eventClick, function (e) {
            e = e || window.event;

            if (_self.cvsClick) {
                // 执行click
                _self.cvsClick = false;

                // 执行click事件，选中图形
                _self.canvasChoosed.canvasClick(e);
                _self.rePaint.clearCanvas();  // 清除画布
                _self.rePaint.rePaint();  // 重绘
                // 画相交的点
                _self.intersect.repaintPoint();
            } else {
                // 不执行click
                return;
            }
        }, false);
    }
}
