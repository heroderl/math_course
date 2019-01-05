//js去除倆邊的空格
function trim(str){
    return str.replace(/(^\s*)|(\s*$)/g, "");
}
//对form事件做出判断
function chkinput(form1){
    if(trim(form1.q_content.value)=="")
    {
        alert("試題內容不能為空!");
        form1.q_content.select();
        return(false);
    }
	
	if(trim(form1.q_No.value)=="")
    {
        alert("試題编号不能為空!");
        form1.q_No.select();
        return(false);
    }
	if(trim(form1.q_board.value)=="")
    {
        alert("画板不能為空!");
        form1.q_board.select();
        return(false);
    }
	if(trim(form1.q_other.value)=="")
    {
        alert("試題编号不能為空!");
        form1.q_other.select();
        return(false);
    }
	
}