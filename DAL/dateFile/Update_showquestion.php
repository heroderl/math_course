<?php
/*
 * Created by PhpStorm.
 * User: dengjunle
 * Date: 2018/11/13
 * Time: 18:12
 * Function:修改试题
 */
require_once(realpath(dirname(__FILE__)."/../../")."/DAL/question.php");
error_reporting(0);
$q_id=$_GET["q_id"];//试题id
$q_content=$_POST["q_content"];//试题内容
$q_board=$_POST["q_board"];//试题画板
$result=updateQuestion($q_id,$q_content,$q_board);
if($result)
{
	echo "<script>alert('修改成功')</script>";
	echo "<script>document.location='../../admin/showAllTestQuestion.php'</script>";
}else
{
	echo "<script>alert('修改失败')</script>";
	echo "<script>document.location='../../admin/showAllTestQuestion.php'</script>";
}
?>