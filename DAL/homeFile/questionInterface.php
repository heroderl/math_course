<?php
/*
 * Created by PhpStorm.
 * User: dengjunle
 * Date: 2018/12/2
 * Time: 16:59
 * Function:查看数据
 */
require_once(realpath(dirname(__FILE__)."/../../")."/common/response.php");
require_once(realpath(dirname(__FILE__)."/../../")."/DAL/question.php");
error_reporting(0);

class questionInterface{
	
	
 //根据时间日期查找相对应的试题
 public function timejiekou(){
	$q_time=$_POST["q_time"];
	//$q_time="2018-12-02";
	if(!isset($_POST["q_time"]))
	{
		$result=looktimeQuestion($q_time);
		return Response::json(0,"sucess" , $result);//返回json格式数据
	}else{
		return Response::json(1,"failed",NULL);
	}
 }
 
 
 //查找全部的试题
 public function messagejiekou(){
	$result=AllQuestion();
	return Response::json(0,"sucess" , $result);//返回json格式数据
	echo $resul; 
 }
 
 
 //推送试题choosejiekou
 public function choosejiekou(){
	 $q_id=$_GET["q_id"];
 	$q_state=$_POST["q_state"];
	if($_POST["q_state"]=="推送中")
	{
		$result=updateChooseQuestion($q_id);
		return Response::json(0,"sucess" , $result);//返回json格式数据
	}else if($_POST["q_state"]=="推送"){
		$result=updateNoChooseQuestion($q_id);
		return Response::json(0,"sucess" , $result);//返回json格式数据
	}else{
		return Response::json(1,"failed",NULL);
	}
 }
}
?>