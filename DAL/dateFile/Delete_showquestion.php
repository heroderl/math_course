<?php
/*
 * Created by PhpStorm.
 * User: dengjunle
 * Date: 2018/11/10
 * Time: 16:22
 * Function:删除试题
 */
require_once(realpath(dirname(__FILE__)."/../../")."/DAL/question.php");
error_reporting(0);
$q_id=$_GET["q_id"];//试题id
$result=deleteQuestion($q_id);
if($result)
{
	echo "<script>alert('删除成功')</script>";
	echo "<script>document.location='../../admin/showAllTestQuestion.php'</script>";
}else
{
	echo "<script>alert('删除失败')</script>";
	echo "<script>document.location='../../admin/showAllTestQuestion.php'</script>";
}
?>