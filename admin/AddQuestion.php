<?php
/*
 * Created by PhpStorm.
 * User: dengjunle
 * Date: 2018/12/3
 * Time: 17:16
 * Function:后台添加数据接口
 */
require_once(realpath(dirname(__FILE__) . "/../") . "/common/connection.php");
error_reporting(0);

class AddQuestion{
	private $conn;
    /*
    *  构造函数，建立数据库连接
    */
    public function __construct() {
        $this->conn = new Connection();
    }
	
	//添加数据接口
	public function addquestion($param){
		if(isset($_POST["ok"]))
		{
			//$_POST['phpid']前端发送过来的phpsessid
			//$phpsessid=$_POST['phpid'];//获取前端发送过来的phpsessid
			
			$q_No=$_POST["q_No"];//试题编号
			$q_content=$_POST["q_content"];//试题内容
			$board=trim($param[0]);//json格式字符
			$q_board=$board;//试题画板
			
			if(isset($_COOKIE['username']))//if($_COOKIE['PHPSESSID']==$phpsessid)
			{	
				if($_SESSION["overtime"]>time())
				{
					if($q_No==""||$q_content==""||$q_board==""){
						echo "<script>alert('添加失败，有空处没有填')</script>";
						echo "<script>document.location='../admin/html/addTestQuest.html'</script>";
					}else{
						$sql="select * from question where q_No={$q_No}";
						$num=$this->conn->selectBySql($sql);//检查试题编号是否已存在数据库中，存在count($num['data'])大于0，不能存在count($num['data'])等于0
						if(count($num['data'])==0)
						{           
							$sql="INSERT INTO `math`.`question` (`q_id`, `q_No`, `q_content`, `q_state`, `q_time`, `q_board`, `q_other`) VALUES (NULL, '$q_No', '$q_content', '0', current_date(), '$q_board', '');";
							$result=$this->conn->insertBySql($sql);//添加试题到question表中		
							if($result['code']==200)
							{	header("Access-Control-Allow-Origin: *"); // 允许任意域名发起的跨域请求  
								$this->conn->json($result);//返回json格式数据	
								//var_dump ($result['data']);
							}else
							{	header("Access-Control-Allow-Origin: *"); // 允许任意域名发起的跨域请求  
								$this->conn->json($result, 200, '添加错误');
							}
						}else
						{
							echo "<script>alert('添加失败，此试题编号已存在！')</script>";
							echo "<script>document.location='../admin/html/addTestQuest.html'</script>";
						}
					}	
				}
			}else{
				//echo "<script>alert('添加失败，找不到cookie')</script>";
			}
		}
	}
}
?>