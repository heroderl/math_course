import { InterSegment, InterCircular, Tools } from './interface/inter-toolslib';
import { CanvasData } from './canvasData';
import { ToolsName, Attribute } from './enum/enum-configlib';
import { CanvasChoosed } from './canvasChoosed';

/**
 * 直线与直线，直线与圆相交
 */
export class Intersect {
    private pointData: Array<{x: number, y: number}>;
    private myCanvas: CanvasRenderingContext2D;  // canvas对象
    private canvasChoosed: CanvasChoosed;  // 选中图形
    private canvasData: CanvasData;  // 存放canvas上的图形数据

    constructor(myCanvas: CanvasRenderingContext2D, canvasChoosed: CanvasChoosed, canvasData: CanvasData) {
        this.pointData = [];
        this.myCanvas = myCanvas;
        this.canvasChoosed = canvasChoosed;
        this.canvasData = canvasData;
    }

    /**
     * 直线与直线相交
     * @param seg1 线段1
     * @param seg2 线段2
     */
    segment(seg1: InterSegment, seg2: InterSegment) {
        let x1 = Math.cos(seg1.angle) * seg1.r + seg1.x;
        let y1 = Math.sin(seg1.angle) * seg1.r + seg1.y;
        let x2 = Math.cos(seg2.angle) * seg2.r + seg2.x;
        let y2 = Math.sin(seg2.angle) * seg2.r + seg2.y;

        // // 快速排斥法
        // let rangeFlag = (function(seg1: [{x: number, y: number}, {x: number, y: number}], seg2: [{x: number, y: number}, {x: number, y: number}]) {
        //     // 判断x是否在范围内
        //     if (seg1[0].x > seg2[0].x && seg1[0].x > seg2[1].x && seg1[1].x > seg2[0].x && seg1[1].x > seg2[0].x) {
        //         // x不相交
        //         return false;
        //     } else if (seg1[0].x < seg2[0].x && seg1[0].x < seg2[1].x && seg1[1].x < seg2[0].x && seg1[1].x < seg2[0].x) {
        //         // x不相交
        //         return false;
        //     }

        //     // 判断y是否在范围内
        //     if (seg1[0].y > seg2[0].y && seg1[0].y > seg2[1].y && seg1[1].y > seg2[0].y && seg1[1].y > seg2[0].y) {
        //         // y不相交
        //         return false;
        //     } else if (seg1[0].y < seg2[0].y && seg1[0].y < seg2[1].y && seg1[1].y < seg2[0].y && seg1[1].y < seg2[0].y) {
        //         // y不相交
        //         return false;
        //     }

        //     return true;
        // })([{x: seg1.x, y: seg1.y}, {x: x1, y: y1}], [{x: seg2.x, y: seg2.y}, {x: x2, y: y2}]);

        // if (!rangeFlag) return;

        // // 跨立法
        // let straddleFlag = (function(seg1: [{x: number, y: number}, {x: number, y: number}], seg2: [{x: number, y: number}, {x: number, y: number}]) {
        //     let a = (seg2[0].x - seg1[0].x) * (seg1[1].y - seg1[0].y) - (seg1[1].x - seg1[0].x) * (seg2[0].y - seg1[0].y);
        //     let b = (seg1[1].x - seg1[0].x) * (seg2[1].y - seg1[0].y) - (seg2[1].x - seg1[0].x) * (seg1[1].y - seg1[0].y);
        //     let c = (seg1[0].x - seg2[1].x) * (seg2[0].y - seg2[1].y) - (seg2[0].x - seg2[1].x) * (seg1[0].y - seg2[1].y);
        //     let d = (seg2[0].x - seg2[1].x) * (seg1[1].y - seg2[1].y) - (seg1[1].x - seg2[1].x) * (seg2[0].y - seg2[1].y);
        //     if (a >= 0 && b >= 0 && c >= 0 && d >= 0) {
        //         return true;
        //     } else {
        //         return false;
        //     }
        // })([{x: seg1.x, y: seg1.y}, {x: x1, y: y1}], [{x: seg2.x, y: seg2.y}, {x: x2, y: y2}]);

        // if (!straddleFlag) return;

        // 找出相交的点
        let cover = (function(seg1: [{x: number, y: number}, {x: number, y: number}], seg2: [{x: number, y: number}, {x: number, y: number}]) {
            let k1 = 0, k2 = 0, b1 = 0, b2 = 0, ox = 0, oy = 0;

            // 线段1垂直
            if (seg1[0].x === seg1[1].x) {
                k1 = 0;
            }
            // 线段2垂直
            if (seg2[0].x === seg2[1].x) {
                k2 = 0;
            } else {
                // 求出两线段的斜率
                k1 = (seg1[0].y - seg1[1].y) / (seg1[0].x - seg1[1].x);
                k2 = (seg2[0].y - seg2[1].y) / (seg2[0].x - seg2[1].x);
            }
            // 求出b的值
            b1 = seg1[0].y - k1 * seg1[0].x;
            b2 = seg2[0].y - k2 * seg2[0].x;
            // 线段1和线段2斜率相同
            if (k1 === k2) {
                return {flag: false, x: 0, y: 0};
            } else {
                ox = (b2 - b1) / (k1 - k2);
                oy = (b1 * k2 - b2 * k1) / (k2 - k1);

                // 判断相交点是否在范围内
                let sa = [seg1[0].x, seg1[1].x];
                let sb = [seg2[0].x, seg2[1].x];
                sa.sort(function(v1, v2) {
                    return v1 - v2;
                });
                sb.sort(function(v1, v2) {
                    return v1 - v2;
                });
                if (sa[0] <= ox && ox <= sa[1] && sb[0] <= ox && ox <= sb[1]) {
                    return {flag: true, x: ox, y: oy};
                } else {
                    return {flag: false, x: 0, y: 0};
                }
            }
        })([{x: seg1.x, y: seg1.y}, {x: x1, y: y1}], [{x: seg2.x, y: seg2.y}, {x: x2, y: y2}]);

        return cover;
    }

    /**
     * 直线与圆相交
     * @param seg 线段
     * @param cir 圆
     */
    circular(seg: InterSegment, cir: InterCircular): {flag: boolean, point: Array<{x: number, y: number}>} {
        let x = Math.cos(seg.angle) * seg.r + seg.x;
        let y = Math.sin(seg.angle) * seg.r + seg.y;

        // 找出相交的点
        let cover = (function(seg: [{x: number, y: number}, {x: number, y: number}], cir: {x: number, y: number, r: number}) {
            let k = 0, b = 0, A: number, B: number, C: number, del: number, res: [{x: number, y: number}, {x: number, y: number}] = [{x: 0, y: 0}, {x: 0, y: 0}];

            if (seg[0].x === seg[1].x) {
                // 垂直
                k = 0;
                A = 1;
                B = -2 * cir.y;
                C = Math.pow(seg[0].x, 2) - 2 * cir.x * seg[0].x + Math.pow(cir.x, 2) + Math.pow(cir.y, 2) - Math.pow(cir.r, 2);

                del = B * B - 4 * A * C;
                if (del < 0) {
                    // 无根
                    return {flag: false, point: []};
                } else if (del === 0) {
                    // 有一个交点
                    res[0].x = seg[0].x;
                    res[0].y = cir.y;

                    // 判断交点是否在范围内
                    let sa = [seg[0].x, seg[1].x];

                    sa.sort(function(v1, v2) {
                        return v1 - v2;
                    });

                    if (sa[0] <= res[0].x && res[0].x <= sa[1] && (cir.x - cir.r) <= res[0].x && res[0].x <= (cir.x + cir.r)) {
                        return {flag: true, point: [{x: res[0].x, y: res[0].y}]};
                    } else {
                        return {flag: false, point: []};
                    }
                } else if (del > 0) {
                    // 有两个交点
                    res[0].x = seg[0].x;
                    res[0].y = (2 * cir.y + Math.sqrt(del)) / 2;
                    res[1].x = seg[0].x;
                    res[1].y = (2 * cir.y - Math.sqrt(del)) / 2;

                    // 判断交点是否在范围内
                    let sa = [seg[0].x, seg[1].x];

                    sa.sort(function(v1, v2) {
                        return v1 - v2;
                    });

                    let result = {flag: false, point: Array<{x: number, y: number}>()};
                    if (sa[0] <= res[0].x && res[0].x <= sa[1] && (cir.x - cir.r) <= res[0].x && res[0].x <= (cir.x + cir.r)) {
                        result.flag = true;
                        result.point.push(res[0]);
                    }
                    if (sa[0] <= res[1].x && res[1].x <= sa[1] && (cir.x - cir.r) <= res[1].x && res[1].x <= (cir.x + cir.r)) {
                        result.flag = true;
                        result.point.push(res[1]);
                    } else {
                        result.flag = false;
                    }

                    return result;
                }
            } else if (seg[0].y === seg[1].y) {
                // 水平
                k = 0;
                b = seg[0].y;
                A = 1;
                B = -2 * cir.x;
                C = Math.pow(seg[0].y, 2) - 2 * cir.y * b + Math.pow(cir.x, 2) + Math.pow(cir.y, 2) - Math.pow(cir.r, 2);
            } else {
                // 线段的斜率
                k = (seg[0].y - seg[1].y) / (seg[0].x - seg[1].x);
                b = seg[0].y - k * seg[0].x;
                A = 1 + k * k;
                B = 2 * (k * b - cir.x - cir.y * k);
                C = b * b - 2 * cir.y * b + cir.x * cir.x + cir.y * cir.y - cir.r * cir.r;
            }

            del = B * B - 4 * A * C;

            // 求出交点
            if (del < 0) {
                // 无根
                return {flag: false, point: []};
            } else if (del === 0) {
                // 有一个交点
                res[0].x = - (2 * k * b - 2 * cir.x - 2 * cir.y * k) / (2 * (1 + k * k));
                res[0].y = k * res[0].x + b;

                // 判断交点是否在范围内
                let sa = [seg[0].x, seg[1].x];

                sa.sort(function(v1, v2) {
                    return v1 - v2;
                });

                if (sa[0] <= res[0].x && res[0].x <= sa[1] && (cir.x - cir.r) <= res[0].x && res[0].x <= (cir.x + cir.r)) {
                    return {flag: true, point: [{x: res[0].x, y: res[0].y}]};
                } else {
                    return {flag: false, point: []};
                }
            } else if (del > 0) {
                // 有两个交点
                res[0].x = (- B + Math.sqrt(del)) / (2 * A);
                res[0].y = k * res[0].x + b;
                res[1].x = (- B - Math.sqrt(del)) / (2 * A);
                res[1].y = k * res[1].x + b;

                // 判断交点是否在范围内
                let sa = [seg[0].x, seg[1].x];

                sa.sort(function(v1, v2) {
                    return v1 - v2;
                });

                let result = {flag: false, point: Array<{x: number, y: number}>()};
                if (sa[0] <= res[0].x && res[0].x <= sa[1] && (cir.x - cir.r) <= res[0].x && res[0].x <= (cir.x + cir.r)) {
                    result.flag = true;
                    result.point.push(res[0]);
                }
                if (sa[0] <= res[1].x && res[1].x <= sa[1] && (cir.x - cir.r) <= res[1].x && res[1].x <= (cir.x + cir.r)) {
                    result.flag = true;
                    result.point.push(res[1]);
                }

                return result;
            }

        })([{x: seg.x, y: seg.y}, {x: x, y: y}], {x: cir.x, y: cir.y, r: cir.r});

        return cover;
    }

    /**
     * 遍历当前线段与所有线段、圆，当前圆与所有线段、圆的交点
     * @param pict 当前线段或圆
     * @param canvasData 图形数据
     */
    pointEach(pict: Tools, canvasData: CanvasData): void {
        let pointData: {flag: boolean, x: number, y: number};
        let cirPoints: {flag: boolean, point: Array<{x: number, y: number}>};

        if (pict.flag === ToolsName.segment) {
            for (let data of (canvasData.getData() as Tools[])) {
                if (data.flag === ToolsName.segment) {
                    // 线段与线段相交
                    pointData = this.segment((pict as InterSegment), (data as InterSegment));
                    if (pointData.flag) {
                        this.saveData({x: pointData.x, y: pointData.y});
                    }
                } else if (data.flag === ToolsName.circular) {
                    // 线段与圆相交
                    cirPoints = this.circular((pict as InterSegment), (data as InterCircular));
                    if (cirPoints.flag) {
                        for (let item of cirPoints.point) {
                            this.saveData({x: item.x, y: item.y});
                        }
                    }
                }
            }
        } else if (pict.flag === ToolsName.circular) {
            for (let data of (canvasData.getData() as Tools[])) {
                if (data.flag === ToolsName.segment) {
                    // 线段与圆相交
                    cirPoints = this.circular((data as InterSegment), (pict as InterCircular));
                    if (cirPoints.flag) {
                        for (let item of cirPoints.point) {
                            this.saveData({x: item.x, y: item.y});
                        }
                    }
                }
            }
        }
    }

    /**
     * 遍历所有线段，圆的交点，除了被选中图形之外
     */
    pointNoSelEach(): void {
        this.pointData = [];
        let index = this.canvasChoosed.getIndex();
        let data = this.canvasData.getData() as Tools[];
        for (let i = 0; i < data.length; i++) {
            // 非线段和圆
            if (data[i].flag !== ToolsName.segment && data[i].flag !== ToolsName.circular) continue;
            // 选中的图形不获取相交点
            if (index.length === 1 && index[0] === i) continue;



            for (let j = i + 1; j < data.length; j++) {
                // 非线段和圆
                if (data[j].flag !== ToolsName.segment && data[j].flag !== ToolsName.circular) continue;
                // 选中的图形不获取相交点
                if (index.length === 1 && index[0] === j) continue;

                // 如果当前图形为线段，则需与线段、圆相交
                if (data[i].flag === ToolsName.segment) {
                    if (data[j].flag === ToolsName.segment) {
                        let pointPosi = this.segment((data[i] as InterSegment), (data[j] as InterSegment));
                        if (pointPosi.flag) {
                            this.saveData({x: pointPosi.x, y: pointPosi.y});
                        }
                    } else if (data[j].flag === ToolsName.circular) {
                        let pointPosi = this.circular((data[i] as InterSegment), (data[j] as InterCircular));
                        if (pointPosi.flag) {
                            for (let item of pointPosi.point) {
                                this.saveData(item);
                            }
                        }
                    }
                }
                // 如果当前图形为圆，则需与线段相交
                if (data[i].flag === ToolsName.circular) {
                    if (data[j].flag === ToolsName.segment) {
                        let pointPosi = this.circular((data[j] as InterSegment), (data[i] as InterCircular));
                        if (pointPosi.flag) {
                            for (let item of pointPosi.point) {
                                this.saveData(item);
                            }
                        }
                    }
                }
            }
        }
    }

    /**
     * 重绘所有交点
     */
    repaintPoint(): void {
        this.myCanvas.beginPath();
        this.myCanvas.fillStyle = Attribute.propDFStyle;
        for (let data of this.getData()) {
            this.myCanvas.moveTo(data.x, data.y);
            this.myCanvas.arc(data.x, data.y, Attribute.propPointR, 0, 2 * Math.PI, false);
        }
        this.myCanvas.fill();
    }

    /**
     * 获取所有相交的点
     */
    getData(): Array<{x: number, y: number}> {
        return this.pointData;
    }

    /**
     * 删除相交的点
     */
    delData(): void {

    }

    /**
     * 保存相交的点
     */
    saveData(data: {x: number, y: number}): void {
        this.pointData.push(data);
    }
}