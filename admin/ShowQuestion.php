<?php
header("Access-Control-Allow-Origin: *"); // 允许任意域名发起的跨域请求 
/*
 * Created by PhpStorm.
 * User: dengjunle
 * Date: 2018/12/3
 * Time: 17:16
 * Function:后台查看数据
 */
require_once(realpath(dirname(__FILE__) . "/../") . "/common/connection.php");
error_reporting(0);

class ShowQuestion{
	private $conn;
    /*
    *  构造函数，建立数据库连接
    */
    public function __construct() {
        $this->conn = new Connection();
    }
	
	
	//返回总数据行数
	public function sumnum(){
		//$_POST['phpid']前端发送过来的phpsessid
		$phpsessid=$_POST['phpid'];//获取前端发送过来的phpsessid
		$sql="select count(*) as count from question";
		$result=$this->conn->selectBySql($sql);
		header("Access-Control-Allow-Origin: *"); // 允许任意域名发起的跨域请求  
		//if(isset($_COOKIE['username']))//
		if($_COOKIE['PHPSESSID']==$phpsessid)
		{
			if($_SESSION["overtime"]>time())
			{
				$this->conn->json($result);//返回json格式数据	
				//var_dump ($result['data']);
			}
		}else{
			
		}

		//var_dump($result['data'][0]['count']);
	}
	
	
	//展示部分试题
	//$_POST["num"]:显示多少条数据,
	//$_POST["number"]:第几页
	public function showquestion(){
			//$num=$_COOKIE['PHPSESSID'];
			//var_dump($num);
			//$_POST['phpid']前端发送过来的phpsessid
			$phpsessid=$_POST["phpid"];//获取前端发送过来的phpsessid
			$num1=$_POST["num"];
			$num2=$_POST["number"]-1;
			$num3=$num1*$num2;
			$sql="select * from question limit $num3,$num1";
			$result=$this->conn->selectBySql($sql);
			header("Access-Control-Allow-Origin: *"); // 允许任意域名发起的跨域请求
			//if(isset($_COOKIE['username']))//
			if($_COOKIE['PHPSESSID']==$phpsessid)
			{
				if($_SESSION["overtime"]>time())
				{
					$this->conn->json($result);//返回json格式数据	
					//var_dump ($result['data']);
				}
			}else{
				
			}
	}
	
	
	//删除试题接
	//$param数组参数试题id
	public function deletequestion($param){
		//$_POST['phpid']前端发送过来的phpsessid
		$phpsessid=$_POST['phpid'];//获取前端发送过来的phpsessid
		$q_id=$param[0];//试题id
		$sql="DELETE FROM `math`.`question` WHERE `question`.`q_id` = $q_id";
		header("Access-Control-Allow-Origin: *"); // 允许任意域名发起的跨域请求  
//		if(isset($_COOKIE['username']))
		if($_COOKIE['PHPSESSID']==$phpsessid)
		{
			if($_SESSION["overtime"]>time())
			{
				$result=$this->conn->deleteBySql($sql);	
			    $this->conn->json($result);//返回json格式数据
				//var_dump ($result['data']);
			}
		}else{
			
		}
//		if($result['code']=='200')//当返回值为200”时证明删除成功
//		{
//			echo "<script>alert('删除成功')</script>";
//			echo "<script>document.location='../admin_course/showAllTestQuestion.php'</script>";
//		}else
//		{
//			echo "<script>alert('删除失败')</script>";
//			echo "<script>document.location='../admin_course/showAllTestQuestion.php'</script>";
//		}		
	}
}

?>