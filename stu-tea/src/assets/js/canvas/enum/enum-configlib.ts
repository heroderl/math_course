/**
 * 基本属性
 * @param canvasID Canvas的id
 * @param colorBlackID 黑色按钮的id
 * @param colorRedID 红色按钮的id
 * @param colorBlueID 蓝色按钮的id
 * @param colorGreenID 绿色按钮的id
 * @param colorYellowID 黄色按钮的id
 * @param colorPurpleID 紫色按钮的id
 * @param btnLetFlagID 字母标志按钮的id
 * @param btnRubberID 橡皮檫按钮的id
 * @param btnRuleID 尺子按钮的id
 * @param btnProtractorID 量角器按钮的id
 * @param btnRotateID 旋转按钮的id
 * @param btnCancleID 撤销按钮的id
 * @param btnPointID 点按钮的id
 * @param btnSegmentID 线段按钮的id
 * @param btnFanID 扇形按钮的id
 * @param btnCircularID 圆按钮的id
 * @param btnRadiusID 半径按钮的id
 * @param btnTangentID 切线按钮的id
 * @param btnTextValueID 文本输入值的id
 * @param btnInputFlagID 字母标记文本框的id
 * @param propWitdh 线条宽度
 * @param propNSStyle 线条未确定时的样式
 * @param propDSStyle 线条确定时的样式
 * @param propPointR 点的大小
 * @param propNFStyle 填充未确定时的样式
 * @param propDFStyle 填充确定时的样式
 * @param propFont 文本字体样式
 * @param propTextAlign 文本字体居中样式
 * @param propisChoosed 被选中的线条的样式
 * @param unitProp 单位比例，1cm = 40px
 * @param adsorption 磁性吸附范围
 * @param adsorpChoosed 选中图形的偏移量
 * @param mouseOffset 鼠标移动图形时的偏移量；负数表示向左偏移，整数表示向右偏移
 */
export enum Attribute {
    canvasID = 'myCanvas',
    colorBlackID = 'colorBlack',
    colorRedID = 'colorRed',
    colorBlueID = 'colorBlue',
    colorGreenID = 'colorGreen',
    colorYellowID = 'colorYellow',
    colorPurpleID = 'colorPurple',
    btnLetFlagID = 'flag',
    btnRubberID = 'rubber',
    btnRuleID = 'rule',
    btnProtractorID = 'protractor',
    btnCancleID = 'cancle',
    btnRotateID = 'rotate',
    btnPointID = 'point',
    btnSegmentID = 'segment',
    btnCircularID = 'circular',
    btnFanID = 'fan',
    btnRadiusID = 'radius',
    btnDiameterID = 'diameter',
    btnChordID = 'chord',
    btnTangentID = 'tangent',
    btnTextValueID = 'value',
    btnInputFlagID = 'inputFlag',
    propWitdh = 3,
    propNSStyle = 'rgba(128, 100, 162, 0.7)',
    propDSStyle = 'rgb(1, 1, 1)',
    propPointR = 5,
    propNFStyle = 'rgba(128, 100, 162, 0.7)',
    propDFStyle = 'rgb(1, 1, 1)',
    propFont = 'bold 22px Arial',
    propTextAlign = 'center',
    propisChoosed = 'blue',
    unitProp = 40,
    adsorption = 20,
    adsorpChoosed = 20,
    mouseOffset = -30
}

/**
 * 辅助工具
 * @param default 默认
 * @param flag 标志
 * @param rule 尺子
 * @param protractor 量角器
 * @param rotate 旋转
 */
export enum Auxiliary {
    default = 'default',  // 默认
    flag = 'flag',  // 标志
    rule = 'rule',  // 尺子
    protractor = 'protractor',  // 量角器
    rotate = 'rotate'  // 旋转
}

/**
 * 填充背景色
 * @param default 默认为没有颜色
 * @param black 黑色
 * @param red 红色
 * @param blue 蓝色
 * @param green 绿色
 * @param yellow 黄色
 * @param purple 紫色
 */
export enum Color {
    default = 'rgba(0, 0, 0, 0)',  // 默认为没有颜色
    black = 'rgba(0, 0, 0, 0.7)',  // 黑色
    red = 'rgba(255, 0, 0, 0.7)',  // 红色
    blue = 'rgba(30, 144, 255, 0.7)',  // 蓝色
    green = 'rgba(50, 205, 50, 0.7)',  // 绿色
    yellow = 'rgba(255, 255, 0, 0.7)',  // 黄色
    purple = 'rgba(128, 0, 128, 0.7)'  // 紫色
}

/**
 * 定义工具
 * @param default 默认
 * @param point 点
 * @param segment 线段
 * @param circular 圆
 * @param fan 扇形
 * @param radius 半径
 * @param chord 弦
 * @param tangent 切线
 * @param letterFlag 字母标志
 */
export enum ToolsName {
    default = 'default',  // 默认
    point = 'point',  // 点
    segment = 'segment',  // 线段
    circular = 'circular',  // 圆
    fan = 'fan',  // 扇形
    radius = 'radius',  // 半径
    diameter = 'diameter',  // 直径
    chord = 'chord',  // 弦
    tangent = 'tangent',  // 切线
    letterFlag = 'letterFlag'  // 字母标志
}
