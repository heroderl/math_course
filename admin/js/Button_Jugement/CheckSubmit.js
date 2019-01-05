function CheckSubmit(q_id) {
    var caseCover=$("#caseCover li");
    $.each(caseCover,function (i) {
        //console.log(caseCover.eq(i).css("background-image").split("\"")[1].split("/")[6]);
        //獲取圖片地址
        var urlStr = caseCover.eq(i).css("background-image").split("\"")[1];
        //判斷類型
        if(urlStr.split("/")[5]=="2D"){
            $("#2D").val(urlStr.split("/")[6]);
        }else {
            //拼接地址
            var valueStr = urlStr.split("/")[6]+"/"+ urlStr.split("/")[7];
            //判斷圖片尾綴類型
            var imgType = (urlStr.split("/")[7]).split(".")[1];
            // console.log("圖片類型"+imgType);
            if (imgType == "obj"){
                if(valueStr!=''){
                    $("#3D1").val(valueStr);
                }else{
                    $("#3D1").val("null");
                }
            }else if(imgType == "mtl") {
                if(valueStr!=""){
                    $("#3D2").val(valueStr);
                }else{
                    $("#3D2").val("null");
                }
            }else{
                if(valueStr!=""){
                    $("#3D3").val(valueStr);
                }else{
                    $("#3D3").val("null");
                }
            }
        }
        //caseCover.eq(i).css("backgroundImage");
    });
    $('#formId').attr('action',"../DAL/dateFile/Action_addTestQuest2.php?type=1&&q_id="+q_id+"");
    $("#formId").submit();
}