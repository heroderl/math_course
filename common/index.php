<?php
header('Content-type: text/html; charset=utf-8');

$path = $_SERVER['REQUEST_URI'];

$array = preg_split("/(index.php){1}[\/]+/", $path);

// 后面没有参数
if(!isset($array[1]) || $array[1] == '') {
	return;
}

$args = preg_split("/[\/]+/", $array[1]);

$class = (!isset($args[0]) || $args[0] == '') ? '' : $args[0];
$func = (!isset($args[1]) || $args[1] == '') ? '' : $args[1];

$param = [];  // 用来存放参数
// 剩下的为参数
for($i = 2; $i < count($args); $i++) {
	if(isset($args[$i]) && $args[$i] != '') {
		array_push($param, $args[$i]);
	}
}

if($class == '' || $func == '') {
	return;
}


define('APP_JSON', realpath(dirname(__FILE__) . "/../") . "/admin/");

require_once(APP_JSON . lcfirst($class) . '.php');


// 访问地址  http://localhost/ex_course/common/入口文件(index.php)/类名/方法名/参数1/参数2/...
$control = new $class();
$func = $control->$func($param);