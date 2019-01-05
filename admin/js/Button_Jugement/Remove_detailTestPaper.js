$(function () {
    //上移
    var $up=$('.up');
    $up.click(function () {
        //parents() 获得当前匹配元素集合中每个元素的父元素，使用选择器进行筛选是可选的。
        var $tr=$(this).parents("tr");
        //index()获取第一个元素的值
        //使用淡入效果来显示一个隐藏的<p>元素：
        //使用淡出效果来隐藏元素。
        if($tr.index()!=1) {
            $tr.fadeOut().fadeIn();//先淡出再淡入
            //before()方法在选元素前插入指定的内容。
            //prev（）获取匹配元素集合中每个元素紧邻的前一个同胞元素,通过选择器进行筛选是可选的
            $tr.prev().before($tr);
        }
    });
    //下移
    var $down=$('.down');
    var len=$down.length;
    $down.click(function () {
        var $tr=$(this).parents('tr');
        if($tr.index()!=len-1){ //判断tr标签是否是最后一个，如果是就不给向下移动
            $tr.fadeOut().fadeIn();
            //after()方法在被选元素后插入内容
            $tr.next().after($tr);
        }
    })
})