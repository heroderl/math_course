<?php
$result = require_once(realpath(dirname(__FILE__) . "/../socket/") . "/testphp.php");
$phptest = "test.php";
$urls = $result . " " . $phptest;
exec($urls);
echo "<script> alert('服务异常断开连接！');</script>";