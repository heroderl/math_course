<?php
//退出登录

function logout(){
	header("content-type:text/html;charset=utf-8");
    if(!empty($_COOKIE["username"])){
		setcookie("username",'null',time()-3600,'/');
		echo "<script>alert('退出成功')</script>";
		header("location:html/adminLogin.html");
	}else{
		echo "<script>alert('退出失败')</script>";
		header("location:html/index1.html");
		}
}
echo logout();
 ?>