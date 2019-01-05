<?php
/*
User:DengJunle
Date:2018-11-10
Time:15:54
Function:验证登录
*/
require_once(realpath(dirname(__FILE__)."/../../")."/DAL/teacher.php");
if(isset($_POST["ok"]))
{
	$t_No=trim($_POST["t_No"]);//老师账号
	$t_password=trim($_POST["t_password"]);//老师密码
	
	$result=checkUser($t_No,$t_password);
	if(empty($_SESSION["t_id"])||empty($_SESSION["t_name"])){
		header("location:../../admin/html/adminLogin.html");		
	}else if(!empty($_SESSION["t_id"])||!empty($_SESSION["t_name"])){
		setcookie("username",'null',time()-3600,'/');
		$username=trim($_SESSION["t_name"]);
		$password=md5(trim($_POST['t_password']));
		$time = time()+3600;
		$_SESSION["overtime"]=$time;
		setcookie("username",$username,$time,'/');
		//setcookie("password",$password,time()+3600*24,'/');
		//$time = time()+3600;
		//header("Set-Cookie: username='$username'; path=/; expires=".gmstrftime("%A, %d-%b-%Y %H:%M:%S GMT",time()+3600));
		//$num=$_COOKIE['username'];
		//echo "<script>alert('$num');</script>";
		
		
		
	}
	
	
	if(count($result)>0){
		echo "<script>alert('登录成功')</script>";
		echo "<script>document.location='../../admin/html/index1.html'</script>";
	}else{
		echo "<script>alert('登录失败')</script>";
		echo "<script>document.location='../../admin/html/adminLogin.html'</script>";
	}
}
?>