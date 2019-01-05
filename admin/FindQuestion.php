<?php
/*
 * Created by PhpStorm.
 * User: dengjunle
 * Date: 2018/12/2
 * Time: 16:59
 * Function:前台查看数据
 */
require_once(realpath(dirname(__FILE__) . "/../") . "/common/connection.php");
error_reporting(0);

class FindQuestion{
	private $conn;
    /*
    *  构造函数，建立数据库连接
    */
    public function __construct() {
        $this->conn = new Connection();
    }
	
	//方法：questiontime()
	//返回值：返回question表里面的部分数据
	//作用：根据时间日期查找相对应的试题
	 public function questiontime(){
		$q_time=$_POST["q_time"];
		//$q_time="2018-12-02";
		if(!isset($_POST['q_time']))
		{	$sql="select * from question where q_time='$q_time' ";
			$result=$this->conn->selectBySql($sql);
			header("Access-Control-Allow-Origin: *"); // 允许任意域名发起的跨域请求  
			$this->conn->json($result);//返回json格式数据
		}else{
			header("Access-Control-Allow-Origin: *"); // 允许任意域名发起的跨域请求  
			$this->conn->json($result, 404, '添加错误');//返回json格式数据
		}
	 }
	 
	 //方法：allquestion()
	 //返回值：返回question表里面的所有数据
	 //作用：查找全部的试题
	 public function allquestion(){
		$sql="select * from question";
		$result=$this->conn->selectBySql($sql);
		header("Access-Control-Allow-Origin: *"); // 允许任意域名发起的跨域请求  
		$num=$this->conn->json($result);//返回json格式数据
	 }
 
	 
 
	 //推送试题choose
	 //$param数组参数为$q_id:试卷id
	 //$param[0]:试卷id
	 public function choose($param){
		$q_id=$param[0];
		$q_state=$_POST["q_state"];
		if($_POST["q_state"]=="推送中")
		{
			$sql="UPDATE `math`.`question` SET `q_state` = '1' WHERE `question`.`q_id` = $q_id;";
			$result=$this->conn->updateBySql($sql);
		}else if($_POST["q_state"]=="推送"){
			$sql="UPDATE `math`.`question` SET `q_state` = '0' WHERE `question`.`q_id` = $q_id;";
			$result=$this->conn->updateBySql($sql);
		}else{
			echo "<script>alert('没有操作')</script>";
		}
	 }
	 
	 
	 //查看试题的画板
	 //$param数组参数为$q_id:试卷id
	 //$param[0]:试卷id
	public function lookboard($param){
			$q_id=$param[0];
			$sql="select * from question where q_id='$q_id'";
			$result=$this->conn->selectBySql($sql);
			header("Access-Control-Allow-Origin: *"); // 允许任意域名发起的跨域请求  
			$this->conn->json($result);
	}
}
?>