<?php
/*
 * Created by PhpStorm.
 * User: dengjunle
 * Date: 2018/11/12
 * Time: 16:59
 * Function:修改试题
 */
require_once(realpath(dirname(__FILE__)."/../../")."/common/response.php");
require_once(realpath(dirname(__FILE__)."/../../")."/DAL/question.php");
error_reporting(0);

$q_id=$_GET["q_id"];
if(isset($_GET["q_id"]))
{
	$result=findoneQuestion($q_id);
	return Response::json(0,"sucess" , $result);//返回json格式数据
}else{
	return Response::json(1,"failed",NULL);
}
?>