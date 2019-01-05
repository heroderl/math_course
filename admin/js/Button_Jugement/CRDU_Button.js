function insertLi() {
    //获取ul节点
    var ul=document.getElementById("insertUl");
    var span=document.getElementById("input");
    //创建li的标签
    var li = document.createElement("li");
    var radio=document.createElement("span");
    //获取li的个数
    var length=ul.childNodes.length;
    console.log(length);
    if (length<9) {
        switch (length) {
            case 5:
                //创建li的下个节点
                li.innerHTML = "C：&nbsp;<input class='ui_input_txt03' maxlength='256' type='text' name='q_answeroption[]' style='margin-left:5.6px'  id='C'  placeholder='不可有空缺' />"
                radio.innerHTML="<input name='q_answer[]' type='checkbox' style='margin-left:10px;'  value='C'/>C";
                ul.appendChild(li);
                span.appendChild(radio);
                break;
            case 6:
                //创建li的下个节点
                li.innerHTML = "D：&nbsp;<input class='ui_input_txt03' maxlength='256' type='text' name='q_answeroption[]' id='D'  placeholder='不可有空缺' />"
                radio.innerHTML="<input name='q_answer[]' type='checkbox' style='margin-left:10px;'  value='D'/>D";
                ul.appendChild(li);
                span.appendChild(radio);
                break;
            case 7:
                //创建li的下个节点
                li.innerHTML = "E：&nbsp;<input class='ui_input_txt03' maxlength='256' type='text' name='q_answeroption[]' id='E' style='margin-left: 7px'  placeholder='不可有空缺' />"
                radio.innerHTML="<input name='q_answer[]' type='checkbox' style='margin-left:10px;'  value='E'/>E";
                ul.appendChild(li);
                span.appendChild(radio);
                break;
            case 8:
                li.innerHTML = "F：&nbsp;<input class='ui_input_txt03' maxlength='256' type='text' name='q_answeroption[]' id='F'  style='margin-left:7px' placeholder='不可有空缺' />"
                radio.innerHTML="<input name='q_answer[]' type='checkbox' style='margin-left:10px;'  value='F'/>F";
                ul.appendChild(li);
                span.appendChild(radio);
                break;
        }
    }else {
        alert("不可增咖！");
    }
}
//对上传图片和3D文件的机制作判断
/*function RecheckButton(obj) {
    var q_3d=document.getElementById("3D1").value;
    var reobj=obj.toString();
    return CheckFile(reobj);
    if(q_3d.length==0){
        obj = null;
        alert("請先添加3D文件");
        return false;
    }
    return true;
}*/
//对删除事件做出判断
function deleteLi() {
    var c=confirm("確認刪除嗎？");
    if (c)
    {
        var ul=document.getElementById("insertUl");
        var span=document.getElementById("input");
        var length = ul.childNodes.length;
        if (length > 5&&length<10) {
            var li = document.getElementById("insertUl").lastChild;
            var radio=document.getElementById("input").lastChild;
            ul.removeChild(li);
            span.removeChild(radio);
        }
        else {
            alert("不可刪除！試題最少2題");
        }
        return false;
    }else {
        return true;
    }
}
//对上传图片和3D文件的机制作判断
function checkButton(obj) {
    // var q_3d=document.getElementsByName("q_3d")[0].files;
    var q_3d=document.getElementsByName("q_3d")[0].files;
    if(q_3d.length==0){
        obj = null;
        alert("請先添加3D文件");
        return false;
    }else{
        return CheckFile(obj);
    }
    return true;
}

//上传图片格式的控制
function CheckFile(obj) {
    var fileName = obj.substr(obj.lastIndexOf("\\") + 1);
    var re = /[\u0391-\uFFE5]+/g;
    if (fileName.match(re) != null) {
        obj = null;
        alert('文件名格式錯誤，請使用字母或數字命名文件名!');
        return false;
    } else {
        return true;
    }

}