// jq条件限制form表单提交
function RegeMatch(){
    var pattern = new RegExp("[~'!@#$%^&*()-+_=:]");
    var reg = /^[0-9a-zA-Z]+$/;
    var str = $('#tp_NO').val();
    if($("#tp_name").val() != "" && $("#tp_name").val() != null) {
        if (pattern.test($("#tp_name").val())) {
            alert("非法字符！");
            $("#tp_name").attr("value", "");
            $("#tp_name").focus();
            return false;
        }
    }
    else {
        alert("試卷名稱不能为空！");
        return false;
    }
    if($("#tp_name").val().length<3){
        alert("試卷名稱至少3位數！");
        return false;
    }else if(str.length<6){
        alert("試卷編號至少6位數！");
        return false;
    }
    if(!reg.test(str)){
        alert("試卷編號不是数字或者字母");
        return false;
    }
    //判断复选框的数量
    var checkedNum = $("input[type='checkbox']:checked").length;
    if(checkedNum<=14){
        alert("試題總數不足夠15題，無法構成試卷！");
        return false;
    }
    else{
        return true;
    }
}
function limitCheck(data) {
    $(data).find("input[type='checkbox']").attr('disabled', true);
    var divId = $(data).find("input[type='checkbox']:checked").length;
    if(data=='#1'){
        if (divId >= 5) {
            //控制以选择的复选框可以编制
            $(data).find("input[type='checkbox']:checked").attr('disabled', false);
        } else {
            $(data).find("input[type='checkbox']").attr('disabled', false);
        }
    }else if(data=="#2"){
        if (divId >= 4) {
            //控制以选择的复选框可以编制
            $(data).find("input[type='checkbox']:checked").attr('disabled', false);
        } else {
            $(data).find("input[type='checkbox']").attr('disabled', false);
        }
    }else if(data=="#3"){
        if (divId >= 3) {
            //控制以选择的复选框可以编制
            $(data).find("input[type='checkbox']:checked").attr('disabled', false);
        } else {
            $(data).find("input[type='checkbox']").attr('disabled', false);
        }
    }else if(data=="#4") {
        if (divId >= 2) {
            //控制以选择的复选框可以编制
            $(data).find("input[type='checkbox']:checked").attr('disabled', false);
        } else {
            $(data).find("input[type='checkbox']").attr('disabled', false);
        }
    }else if(data=="#5"){
        if (divId == 1) {
            //控制以选择的复选框可以编制
            $(data).find("input[type='checkbox']:checked").attr('disabled', false);
        } else {
            $(data).find("input[type='checkbox']").attr('disabled', false);
        }
    }
}