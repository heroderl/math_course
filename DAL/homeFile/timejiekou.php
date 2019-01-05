<?php
/*
 * Created by PhpStorm.
 * User: dengjunle
 * Date: 2018/12/2
 * Time: 16:59
 * Function:查看时间数据
 */
require_once(realpath(dirname(__FILE__)."/../../")."/common/response.php");
require_once(realpath(dirname(__FILE__)."/../../")."/DAL/question.php");
error_reporting(0);

$q_time=$_GET["q_time"];
if(isset($_GET["q_time"]))
{
	$result=looktimeQuestion($q_time);
	return Response::json(0,"sucess" , $result);//返回json格式数据
}else{
	return Response::json(1,"failed",NULL);
}
?>