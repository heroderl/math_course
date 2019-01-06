import { ToolsName, Attribute } from './enum/enum-configlib';
import { Tools, InterPoint, InterSegment, InterFan, InterCircular, InterRadius, InterLetterFlag, InterChord, InterDiameter } from './interface/inter-toolslib';

/**
 * 重绘图形
 */
export class RePaint {
    private myCanvas: CanvasRenderingContext2D;  // 表示canvas对象
    private myCanvasNode: HTMLElement;  // canvas节点
    private data: Tools[];  // 存放canvas图形数据

    constructor(myCanvas: CanvasRenderingContext2D, myCanvasNode: HTMLElement, data: Tools[]) {
        this.myCanvas = myCanvas;
        this.myCanvasNode = myCanvasNode;
        this.data = data;
    }

    /**
     * 画点
     * @param: x 表示点的x坐标
     * @param: y 表示点的y坐标
     */
    private paintPoint(data: InterPoint) {
        this.myCanvas.beginPath();
        if (data.isChoosed) {
            this.myCanvas.fillStyle = Attribute.propisChoosed;
        } else {
            this.myCanvas.fillStyle = Attribute.propDFStyle;
        }
        this.myCanvas.arc(data.x, data.y, Attribute.propPointR, 0, 2 * Math.PI, false);
        this.myCanvas.fill();
    }

    /**
     * 画线段
     * @param: x 表示起点的x坐标
     * @param: y 表示起点的y坐标
     * @param: r 表示线段长度
     * @param: angle 表示角，单位为弧度
     * @param: anticlockwise false表示顺时针(默认)，true表示逆时针
     */
    private paintSegment(data: InterSegment) {
        data.anticlockwise = (!!data.anticlockwise) ? data.anticlockwise : false;

        let x = Math.cos(data.angle) * data.r + data.x;
        let y = Math.sin(data.angle) * data.r + data.y;

        // 画线段
        this.myCanvas.beginPath();
        if (data.isChoosed) {
            this.myCanvas.strokeStyle = Attribute.propisChoosed;
            this.myCanvas.fillStyle = Attribute.propisChoosed;
        } else {
            this.myCanvas.fillStyle = Attribute.propDFStyle;
            this.myCanvas.strokeStyle = Attribute.propDSStyle;
        }
        this.myCanvas.lineWidth = Attribute.propWitdh;
        this.myCanvas.moveTo(data.x, data.y);
        this.myCanvas.arc(data.x, data.y, data.r, data.angle, data.angle, data.anticlockwise);
        this.myCanvas.closePath();
        this.myCanvas.stroke();
        // 画起点
        this.myCanvas.moveTo(data.x, data.y);
        this.myCanvas.arc(data.x, data.y, Attribute.propPointR, 0, 2 * Math.PI, false);
        this.myCanvas.fill();
        // 画终点
        this.myCanvas.moveTo(x, y);
        this.myCanvas.arc(x, y, Attribute.propPointR, 0, 2 * Math.PI, false);
        this.myCanvas.fill();
    }

    /**
     * 画扇形
     * @param: x 表示起点的x坐标
     * @param: y 表示起点的y坐标
     * @param: r 表示半径
     * @param: startAngle 表示起始角，单位为弧度
     * @param: endAngle 表示结束角，单位为弧度
     * @param: anticlockwise false表示顺时针(默认)，true表示逆时针
     */
    private paintFan(data: InterFan) {
        data.anticlockwise = (!!data.anticlockwise) ? data.anticlockwise : false;

        this.myCanvas.beginPath();
        if (data.isChoosed) {
            this.myCanvas.strokeStyle = Attribute.propisChoosed;
        } else {
            this.myCanvas.strokeStyle = Attribute.propDSStyle;
        }
        this.myCanvas.lineWidth = Attribute.propWitdh;
        this.myCanvas.fillStyle = data.fillStyle;
        this.myCanvas.moveTo(data.x, data.y);
        this.myCanvas.arc(data.x, data.y, data.r, data.startAngle, data.endAngle, data.anticlockwise);
        this.myCanvas.closePath();
        this.myCanvas.fill();
        this.myCanvas.stroke();
    }

    /**
     * 圆
     * @param: x 表示起点的x坐标
     * @param: y 表示起点的y坐标
     * @param: r 表示半径
     * @param: angle 表示角，单位为弧度
     * @param: anticlockwise false表示顺时针(默认)，true表示逆时针
     */
    private paintCircular(data: InterCircular) {
        data.anticlockwise = (!!data.anticlockwise) ? data.anticlockwise : false;

        // 圆
        this.myCanvas.beginPath();
        if (data.isChoosed) {
            this.myCanvas.strokeStyle = Attribute.propisChoosed;
        } else {
            this.myCanvas.strokeStyle = Attribute.propDSStyle;
        }
        this.myCanvas.lineWidth = Attribute.propWitdh;
        this.myCanvas.fillStyle = data.fillStyle;
        this.myCanvas.arc(data.x, data.y, data.r, 0, 2 * Math.PI, false);
        this.myCanvas.fill();
        this.myCanvas.stroke();
        // 圆心
        this.myCanvas.beginPath();
        if (data.isChoosed) {
            this.myCanvas.fillStyle = Attribute.propisChoosed;
        } else {
            this.myCanvas.fillStyle = Attribute.propDFStyle;
        }
        this.myCanvas.arc(data.x, data.y, Attribute.propPointR, 0, 2 * Math.PI, false);
        this.myCanvas.fill();
    }

    /**
     * 画半径
     * @param: x 表示起点的x坐标
     * @param: y 表示起点的y坐标
     * @param: r 表示半径
     * @param: angle 表示角，单位为弧度
     * @param: anticlockwise false表示顺时针(默认)，true表示逆时针
     */
    private paintRadius(data: InterRadius) {
        data.anticlockwise = (!!data.anticlockwise) ? data.anticlockwise : false;

        this.myCanvas.beginPath();
        if (data.isChoosed) {
            this.myCanvas.strokeStyle = Attribute.propisChoosed;
        } else {
            this.myCanvas.strokeStyle = Attribute.propDSStyle;
        }
        this.myCanvas.lineWidth = Attribute.propWitdh;
        this.myCanvas.moveTo(data.x, data.y);
        this.myCanvas.arc(data.x, data.y, data.r, data.angle, data.angle, data.anticlockwise);
        this.myCanvas.closePath();
        this.myCanvas.stroke();
    }

    /**
     * 画直径
     * @param: x 表示起点的x坐标
     * @param: y 表示起点的y坐标
     * @param: r 表示半径
     * @param: angle 表示角，单位为弧度
     * @param: anticlockwise false表示顺时针(默认)，true表示逆时针
     */
    private paintDiameter(data: InterDiameter) {
        data.anticlockwise = (!!data.anticlockwise) ? data.anticlockwise : false;

        this.myCanvas.beginPath();
        if (data.isChoosed) {
            this.myCanvas.strokeStyle = Attribute.propisChoosed;
        } else {
            this.myCanvas.strokeStyle = Attribute.propDSStyle;
        }
        this.myCanvas.lineWidth = Attribute.propWitdh;
        this.myCanvas.moveTo(data.x, data.y);
        this.myCanvas.arc(data.x, data.y, data.r, data.angle, data.angle, data.anticlockwise);
        this.myCanvas.moveTo(data.x, data.y);
        this.myCanvas.arc(data.x, data.y, data.r, (data.angle + Math.PI), (data.angle + Math.PI), data.anticlockwise);
        this.myCanvas.closePath();
        this.myCanvas.stroke();
    }

    /**
     * 画弦
     * @param: x 表示扇形起始边的x坐标
     * @param: y 表示扇形起始边的y坐标
     * @param endX 表示扇形结束边的x坐标
     * @param endY 表示扇形结束边的y坐标
     * @param isShow 表示弦是否显示
     */
    private paintChord(data: InterChord) {
        this.myCanvas.beginPath();
        if (data.isChoosed) {
            this.myCanvas.strokeStyle = Attribute.propisChoosed;
            this.myCanvas.fillStyle = Attribute.propisChoosed;
        } else {
            this.myCanvas.strokeStyle = Attribute.propDSStyle;
            this.myCanvas.fillStyle = Attribute.propDFStyle;
        }
        this.myCanvas.lineWidth = Attribute.propWitdh;
        this.myCanvas.moveTo(data.x, data.y);
        this.myCanvas.lineTo(data.endX, data.endY);
        this.myCanvas.stroke();
        this.myCanvas.moveTo(data.x, data.y);
        this.myCanvas.arc(data.x, data.y, Attribute.propPointR, 0, 2 * Math.PI, false);
        this.myCanvas.fill();
        this.myCanvas.moveTo(data.endX, data.endY);
        this.myCanvas.arc(data.endX, data.endY, Attribute.propPointR, 0, 2 * Math.PI, false);
        this.myCanvas.fill();
    }

    /**
     * 画切线
     */
    private paintTangent() {

    }

    /**
     * 画文本标志
     * @param x 表示文本的x坐标
     * @param y 表示文本的y坐标
     * @param text 表示文本的内容
     */
    private paintLetterFlag(data: InterLetterFlag) {
        this.myCanvas.beginPath();
        this.myCanvas.font = Attribute.propFont;
        if (data.isChoosed) {
            this.myCanvas.fillStyle = Attribute.propisChoosed;
        } else {
            this.myCanvas.fillStyle = Attribute.propDFStyle;
        }
        this.myCanvas.fillText(data.text, data.x, data.y);
    }

    /**
     * 重绘
     */
    rePaint(): void {
        for (let value of this.data) {
            switch (value.flag) {
            case ToolsName.point:
                this.paintPoint((value as InterPoint));
                break;
            case ToolsName.segment:
                this.paintSegment((value as InterSegment));
                break;
            case ToolsName.circular:
                this.paintCircular((value as InterCircular));
                for (let value2 of (value as InterCircular).fanAndRadius) {
                    switch (value2.flag) {
                    case ToolsName.fan:
                        this.paintFan((value2 as InterFan));

                        let temp = (value2 as InterFan).hasChord;
                        if (temp.isShow) {
                            this.paintChord(temp);
                        }
                        break;
                    case ToolsName.radius:
                        this.paintRadius((value2 as InterRadius));
                        break;
                    case ToolsName.diameter:
                        this.paintDiameter((value2 as InterDiameter));
                        break;
                    default: break;
                    }
                }
                break;
            case ToolsName.tangent:
                this.paintTangent();
                break;
            case ToolsName.letterFlag:
                this.paintLetterFlag(value as InterLetterFlag);
                break;
            default: break;
            }
        }
    }

    /**
     * 清除画布
     */
    clearCanvas(): void {
        this.myCanvas.clearRect(0, 0, this.myCanvasNode.clientWidth, this.myCanvasNode.clientHeight - 5);
        this.myCanvas.fillStyle = 'white';
        this.myCanvas.fillRect(0, 0, this.myCanvasNode.clientWidth, this.myCanvasNode.clientHeight);
    }
}
