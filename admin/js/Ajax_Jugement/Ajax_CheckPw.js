function checkPwd() {
    $().ready(function () {
        var name=$("#name").val();
        var pwd=$("#pwd").val();
        var url="../DAL/Ajax/Ajax_pwd.php";
        $.ajax({
            url:url,
            data:{
                name:name,
                pwd:pwd,
            },
            success:function (data) {
                if(data=="教師不存在"){
                    $("#checkPwd").remove();
                    $("#login_err").append("<span id='checkPwd'>用戶名或密碼錯誤！</span>");
                }else if(data=="教師存在"){
                    $("#checkPwd").remove();
                    document.location="index1.html";
                }
            },
            dataType:"JSON",
            type:"post"
        });
    })
}