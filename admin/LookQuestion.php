<?php
/*
 * Created by PhpStorm.
 * User: dengjunle
 * Date: 2018/12/3
 * Time: 17:16
 * Function:后台查看其中一条数据
 */
require_once(realpath(dirname(__FILE__) . "/../") . "/common/connection.php");
error_reporting(0);

class LookQuestion{
	private $conn;
    /*
    *  构造函数，建立数据库连接
    */
    public function __construct() {
        $this->conn = new Connection();
    }
	
	//接口参数
	//$_POST["q_id"]//试卷id
	public function lookquestion(){
		
		//$_POST['phpid']前端发送过来的phpsessid
		$q_id=$_POST["q_id"];//接口参数
		$phpsessid=$_POST["phpid"];//获取前端发送过来的phpsessid
//		if(isset($_COOKIE['username']))
		if($_COOKIE['PHPSESSID']==$phpsessid)
		{
			if($_SESSION["overtime"]>time())
			{
				$sql="select * from question where q_id='$q_id'";
				$result=$this->conn->selectBySql($sql);
				if(count($result['data'])==1)//当查询的只有一条数据时返回数据，因为$q_id是主键
				{	header("Access-Control-Allow-Origin: *"); // 允许任意域名发起的跨域请求  
					$this->conn->json($result);//返回json格式数据
				}else
				{	header("Access-Control-Allow-Origin: *"); // 允许任意域名发起的跨域请求  
					$this->conn->json($result, 404, '添加错误');//返回json格式数据
				}
			}else{
				//echo "<script>alert('添加失败，找不到overtime')</script>";
			}
		}else{
			//echo "<script>alert('添加失败，找不到cookie')</script>";
		}
		
	}
}
?>