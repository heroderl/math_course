<?php
/**
 * Created by PhpStorm.
 * User: Jie
 * Date: 2018/6/27
 * Time: 15:57
 * Function:修改分享數據
 */
require_once (realpath(dirname(__FILE__)."/../../").'/DAL/question.php');
$q_id=$_POST["q_id"];
$q_isshare=$_POST["q_isshare"];
$result=AjaxUpdate($q_isshare,$q_id);
if ($result){
    if ($q_isshare==1){
        echo json_encode("1");
    }
    else{
        echo  json_encode("0");
    }
    echo json_encode("success");
}