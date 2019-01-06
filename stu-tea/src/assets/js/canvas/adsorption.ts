import { Attribute, ToolsName } from './enum/enum-configlib';
import { InterAdsorp, Tools, InterCircular, InterFan, InterSegment, InterPoint, InterRadius } from './interface/inter-toolslib';
import { CanvasData } from './canvasData';
import { Intersect } from './intersect';
import { CanvasChoosed } from './canvasChoosed';

/**
 * 磁性吸附
 */
export class Adsorption {
    private canvasData: CanvasData;  // 存放canvas上的图形数据
    private intersect: Intersect;  // 相交

    constructor (canvasData: CanvasData, intersect: Intersect) {
        this.canvasData = canvasData;
        this.intersect = intersect;
    }

    /**
     * 获取被磁性吸附后的坐标
     */
    adsorpToXY (x: number, y: number, index?: number[]): {x: number, y: number} {
        let result = { x, y };  // 存放数据
        let dist = Attribute.adsorption;  // 判断最短距离
        let temp: InterAdsorp;  // 存放临时数据

        for (let i = 0; i < (this.canvasData.getData() as Tools[]).length; i++) {
            // 出去当前选中的图形
            let data = (this.canvasData.getData(i) as Tools);
            switch (data.flag) {
            case ToolsName.point:
                if (!!index && index.length === 1 && index[0] === i) break;
                temp = this.adPoint(x, y, data);
                if (temp.flag && temp.dist <= dist) {
                    dist = temp.dist;
                    result = { x: temp.x, y: temp.y };
                }
                break;
            case ToolsName.segment:
                if (!!index && index.length === 1 && index[0] === i) break;
                temp = this.adSegment(x, y, data);
                if (temp.flag && temp.dist <= dist) {
                    dist = temp.dist;
                    result = { x: temp.x, y: temp.y };
                }
                break;
            case ToolsName.circular:
                if (!!index && index.length === 1 && index[0] === i) break;
                temp = this.adCircular(x, y, data);
                if (temp.flag && temp.dist <= dist) {
                    dist = temp.dist;
                    result = { x: temp.x, y: temp.y };

                        // 扇形和半径和直径的磁性吸附
                    for (let j = 0; j < (data as InterCircular).fanAndRadius.length; j++) {
                        let auxi = (data as InterCircular).fanAndRadius[j];
                        switch (auxi.flag) {
                        case ToolsName.fan:
                            if (!!index && index.length === 2 && index[1] === j) break;
                            temp = this.adFan(x, y, auxi);
                            if (temp.flag) {
                                dist = temp.dist;
                                result = { x: temp.x, y: temp.y };
                            }
                            break;
                        case ToolsName.radius:
                            if (!!index && index.length === 2 && index[1] === j) break;
                            temp = this.adRadius(x, y, auxi);
                            if (temp.flag) {
                                dist = temp.dist;
                                result = { x: temp.x, y: temp.y };
                            }
                            break;
                        case ToolsName.diameter:
                            if (!!index && index.length === 2 && index[1] === j) break;
                            temp = this.adDiameter(x, y, auxi);
                            if (temp.flag) {
                                dist = temp.dist;
                                result = { x: temp.x, y: temp.y };
                            }
                            break;
                        default: break;
                        }
                    }
                }
                break;
            case ToolsName.letterFlag: break;
            case ToolsName.default: break;
            default: break;
            }
        }

        temp = this.adIntePoint(x, y);
        if (temp.flag) {
            // if (temp.dist < dist) {
            //     result = {x: temp.x, y: temp.y};
            // }
            result = { x: temp.x, y: temp.y };
        }

        return result;
    }

    /**
     * 吸附点
     * @param x 鼠标的x坐标
     */
    private adPoint (x: number, y: number, t: Tools): InterAdsorp {
        let data = t as InterPoint;
        let dist = Math.sqrt(Math.pow((x - data.x), 2) + Math.pow((y - data.y), 2));

        if (dist <= Attribute.adsorption) {
            return { x: data.x, y: data.y, flag: true, dist };
        } else {
            return { x, y, flag: false };
        }
    }

    /**
     * 吸附线段
     */
    private adSegment (x: number, y: number, t: Tools): InterAdsorp {
        let data = t as InterSegment;
        let pr = Math.sqrt(Math.pow((x - data.x), 2) + Math.pow((y - data.y), 2));
        let pangle = Math.atan2((y - data.y), (x - data.x));
        pangle = (pangle >= 0) ? pangle : (2 * Math.PI + pangle);
        let dist = Math.abs(Math.sin(Math.abs(data.angle - pangle)) * pr);
        let or = Math.cos(Math.abs(data.angle - pangle)) * pr;

        if (dist <= Attribute.adsorption && or >= 0 && or <= data.r) {
            return { x: (Math.cos(data.angle) * or + data.x), y: (Math.sin(data.angle) * or + data.y), flag: true, dist };
        } else if (dist <= Attribute.adsorption && or >= -Attribute.adsorption && or < 0) {
            return { x: data.x, y: data.y, flag: true, dist };
        } else if (dist <= Attribute.adsorption && or > data.r && or <= (data.r + Attribute.adsorption)) {
            return { x: (Math.cos(data.angle) * data.r + data.x), y: (Math.sin(data.angle) * data.r + data.y), flag: true, dist };
        } else {
            return { x, y, flag: false };
        }
    }

    /**
     * 吸附圆
     */
    private adCircular (x: number, y: number, t: Tools): InterAdsorp {
        let data = t as InterCircular;
        let dist = Math.sqrt(Math.pow((x - data.x), 2) + Math.pow((y - data.y), 2));
        let pangle = Math.atan2((y - data.y), (x - data.x));
        pangle = (pangle >= 0) ? pangle : (2 * Math.PI + pangle);

        if (dist <= Attribute.adsorption) {
            // 靠近圆心
            return { x: data.x, y: data.y, flag: true, dist };
        } else if (Math.abs(dist - data.r) <= Attribute.adsorption) {
            // 靠近圆边
            return { x: (Math.cos(pangle) * data.r + data.x), y: (Math.sin(pangle) * data.r + data.y), flag: true, dist: Math.abs(dist - data.r) };
        } else {
            return { x, y, flag: false };
        }
    }

    /**
     * 吸附扇形
     */
    private adFan (x: number, y: number, t: Tools): InterAdsorp {
        let data = t as InterFan;
        let sx = Math.cos(data.startAngle) * data.r + data.x;
        let sy = Math.sin(data.startAngle) * data.r + data.y;
        let sdist = Math.sqrt(Math.pow((x - sx), 2) + Math.pow((y - sy), 2));
        let ex = Math.cos(data.endAngle) * data.r + data.x;
        let ey = Math.sin(data.endAngle) * data.r + data.y;
        let edist = Math.sqrt(Math.pow((x - ex), 2) + Math.pow((y - ey), 2));

        if (sdist <= edist) {
            // 靠近开始边
            if (sdist <= Attribute.adsorption) {
                return { x: sx, y: sy, flag: true, dist: sdist };
            } else {
                return { x, y, flag: false };
            }
        } else {
            // 靠近结束边
            if (edist <= Attribute.adsorption) {
                return { x: ex, y: ey, flag: true, dist: sdist };
            } else {
                return { x, y, flag: false };
            }
        }
    }

    /**
     * 吸附半径
     */
    private adRadius (x: number, y: number, t: Tools): InterAdsorp {
        let data = t as InterRadius;
        let sx = Math.cos(data.angle) * data.r + data.x;
        let sy = Math.sin(data.angle) * data.r + data.y;
        let sdist = Math.sqrt(Math.pow((x - sx), 2) + Math.pow((y - sy), 2));

        if (sdist <= Attribute.adsorption) {
            return { x: sx, y: sy, flag: true, dist: sdist };
        } else {
            return { x, y, flag: false };
        }
    }

    /**
     * 吸附直径
     */
    private adDiameter (x: number, y: number, t: Tools): InterAdsorp {
        let data = t as InterRadius;
        let sx = Math.cos(data.angle) * data.r + data.x;
        let sy = Math.sin(data.angle) * data.r + data.y;
        let tx = Math.cos(data.angle + Math.PI) * data.r + data.x;
        let ty = Math.sin(data.angle + Math.PI) * data.r + data.y;
        let sdist = Math.sqrt(Math.pow((x - sx), 2) + Math.pow((y - sy), 2));
        let tdist = Math.sqrt(Math.pow((x - tx), 2) + Math.pow((y - ty), 2));

        if (sdist <= Attribute.adsorption) {
            return { x: sx, y: sy, flag: true, dist: sdist };
        } else if (tdist <= Attribute.adsorption) {
            return { x: tx, y: ty, flag: true, dist: tdist };
        } else {
            return { x, y, flag: false };
        }
    }

    /**
     * 吸附相交点
     */
    private adIntePoint (x: number, y: number): InterAdsorp {
        let data = this.intersect.getData();
        let temp = { x, y };
        let oldDist = Attribute.adsorption as number;
        let flag = false;

        if (data.length === 0) return { x: temp.x, y: temp.y, flag: false };

        for (let value of data) {
            let dist = Math.sqrt(Math.pow((x - value.x), 2) + Math.pow((y - value.y), 2));
            if (dist < oldDist) {
                oldDist = dist;
                temp = value;
                flag = true;
            }
        }

        if (flag) return { x: temp.x, y: temp.y, flag: true, dist: oldDist };
        else return { x: temp.x, y: temp.y, flag: false };
    }
}
