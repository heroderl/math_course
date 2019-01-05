function updatePWD() {
    var t_password=$('#t_password').val();
    var repassword=$('#repassword').val();
    var pattern = new RegExp("[`~!@#$%^&*()_+<>?:{},./;'[]]");
    var reg = /^[a-zA-Z]+$/;
    var t_NO=$('#t_NO').val();
    if($("#t_name").val().length<=1||$('#t_NO').val().length<=3){
        alert("管理員姓名至少2位數,管理員帳號至少4位數！");
        return false;
    }
    if(!reg.test(t_NO)) {
        alert("管理員帳號只能是字母！");
        return false;
    }
    if($("#t_name").val() != "" && $("#t_name").val() != null) {
        if (pattern.test($("#t_name").val())) {
            alert("非法字符！");
            $("#t_name").attr("value", "");
            $("#t_name").focus();
            return false;
        }
    }
    else {
        alert("管理員姓名不能为空！");
        return false;
    }
    if(t_password.length<=2){
        alert("密碼至少3位數！");
        return false;
    }
    if (t_password==repassword){
        return true;
    }else {
        alert("密碼不一致，請核對!");
        return false;
    }
}