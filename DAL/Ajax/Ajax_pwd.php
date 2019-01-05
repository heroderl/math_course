<?php
/**
 * Created by PhpStorm.
 * User: Jie
 * Date: 2018/8/22
 * Time: 21:28
 * Function: 檢查登錄
 */
require_once (realpath(dirname(__FILE__)."/../../").'/DAL/teacher.php');
error_reporting(0);
$name=$_POST["name"];
//echo $name;
//$name="0122";
//var_dump(preg_match('/[a-zA-Z]$/',$name));
$pwd=$_POST["pwd"];

//教師登陸
$result = checkUser($name,$pwd);
if ($result) {
	echo json_encode("教師存在");
} else {
	echo json_encode("教師不存在");
}
?>
