<?php
/*
 * Created by PhpStorm.
 * User: dengjunle
 * Date: 2018/12/4
 * Time: 9:18
 * Function:后台修改其中一条数据
 */
require_once(realpath(dirname(__FILE__) . "/../") . "/common/connection.php");
error_reporting(0);

class UpdateQuestion{
	private $conn;
    /*
    *  构造函数，建立数据库连接
    */
    public function __construct() {
        $this->conn = new Connection();
    }
	
	
	//$param数组参数为$q_id:试卷id
	//$param[0]:试卷id
	public function updatequestion($param){
		if(isset($_COOKIE['username']))//if($_COOKIE['PHPSESSID']==$phpsessid)
		{
			if($_SESSION["overtime"]>time())
			{
				$q_id=$param[0];
				$q_content=$_POST['q_content'];
				$q_board=$_POST['q_board'];
				
				//echo $q_id;
				//测试
				//$q_id=$param[0];
				//$q_content="1411";
				//$q_board="456416546";
		
				$sql="UPDATE `math`.`question` SET  `q_content` = '$q_content', `q_board` = '$q_board'  WHERE `question`.`q_id` = $q_id;";
				header("Access-Control-Allow-Origin: *"); // 允许任意域名发起的跨域请求  
				$result=$this->conn->updateBySql($sql);
				$this->conn->json($result);
			}
		}else{
			
		}
	}
}
?>
