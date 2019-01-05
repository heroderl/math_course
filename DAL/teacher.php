<?php
/**
 * Created by PhpStorm.
 * User: dengjunle
 * Date: 2018/11/08/
 * Time: 19:54
 * Function:对student表的处理(增删查改)，（limit语法），用session保存教师部分信息
 */
require_once(realpath(dirname(__FILE__)."/../")."/common/connection.php");
error_reporting(0);
//实例化
$conn=new Connection();

/*
 * 作用：验证。
 * 返回值：二维数组（教师学号，教师密码）
 * 
 */
function checkUser($t_No,$t_password){
	 $conn=$GLOBALS["conn"];//连接本地数据库 
	 $sql="select * from teacher where t_No='$t_No' and t_password='$t_password'";
	 $data=$conn->selectBySql($sql);
	 $t_id=$data["data"]["0"]["t_id"];
	 $t_name=$data["data"]["0"]["t_name"];
	 $_SESSION["t_id"]=$t_id;//将教师ID存入SESSION中
	 $_SESSION["t_name"]=$t_name;//将教师姓名存入SESSION中
	 return $data["data"]["0"];
}
//var_dump(checkUser("0010","123456"));

/*
 * 作用：查询教师
 * 返回值：二维数组（教师所有信息）
 */
function AllTeacher(){
	$conn=$GLOBALS["conn"];//连接本地数据库
	$sql="select * from teacher";
	$data=$conn->selectBySql($sql);
	return $data["data"];
}
//var_dump(AllTeacher());

/*
 * 作用：查询部分教师信息
 * 参数：从第$start个开始,获取$last条数据
 * 返回值：二维数组（教师所有信息）
 */
function getSomePages($start,$last){
	$conn=$GLOBALS["conn"];//连接本地数据库
	$sql="select * from teacher order by t_id limit $start,$last";
	$alls=$conn->selectBySql($sql);
	return $alls["data"];
} 
//var_dump(getSomePages(1,2));

/*
 * 作用：修改教师信息
 * 参数：$t_id：用户唯一id,$t_No：用户编号,$t_name：用户姓名,$t_password：用户密码
 * 返回值：int success代表修改成功
 */
function updatePassword($t_id,$t_No,$t_name,$t_password){
	$conn=$GLOBALS["conn"];//连接本地数据库
	$sql="UPDATE `math`.`teacher` SET `t_No` = '$t_No', `t_name` = '$t_name', `t_password` = '$t_password' WHERE `teacher`.`t_id` = $t_id;";
	$data=$conn->updateBySql($sql);
	return $data["data"];
}
//var_dump(updatePassword(2,"0013","djl","123456"));

/*
 * 作用：删除教师信息
 * 参数：$t_id：用户唯一id
 * 返回值：int success代表删除成功
 */
function DeleteTeacher($t_id){
	$conn=$GLOBALS["conn"];//连接本地数据库
	$sql="delete from teacher where t_id='$t_id'";
	$data=$conn->deleteBySql($sql);
	return $data["data"];
}
//var_dump(DeleteTeacher(2));

/*
 * 作用：添加教师信息
 * 参数：$t_id：用户唯一id
 * 返回值：int success代表添加成功
 */
function insertTeacher($t_No,$t_name,$t_password){
	$conn=$GLOBALS["conn"];
	$sql="insert into teacher(t_No,t_name,t_password) values ('$t_No','$t_name','$t_password')";
	$data=$conn->insertBySql($sql);
	return $data["data"];
}
//var_dump(insertTeacher("0043","邓了","123456"));


?>