<?php
  /**
     * Created by PhpStorm.
     * User: dengjunle
     * Date: 2018/11/12
     * Time: 16:00
     * Function:添加试题到question表中
     */
	header("Content-type:text/html;charset=UTF-8");
    require_once (realpath(dirname(__FILE__)."/../../").'/DAL/question.php');
    session_start();
	if(isset($_POST["ok"]))
	{
		$q_No=$_POST["q_No"];//试题编号
		$q_content=$_POST["q_content"];//试题内容
		$q_board=$_POST["q_board"];//试题画板
		
		if($q_No==""||$q_content==""||$q_board==""){
			echo "<script>alert('添加失败，有空处没有填')</script>";
			echo "<script>document.location='../../admin/addTestQuest.php'</script>";
		}else{
			$num=findNoQuestion($q_No);//检查试题编号是否已存在数据库中，存在count($num)大于0，不能存在count($num)等于0
			if(count($num)==0)
			{
				$result=InsertQuestion($q_No,$q_content,$q_board);//添加试题到question表中
				if($result)
				{
					echo "<script>alert('添加成功')</script>";
					echo "<script>document.location='../../admin/addTestQuest.html'</script>";
				}else
				{
					echo "<script>alert('添加失败')</script>";
					echo "<script>document.location='../../admin/addTestQuest.php'</script>";
				}
			}else
			{
				echo "<script>alert('添加失败，此试题编号已存在！')</script>";
					echo "<script>document.location='../../admin/addTestQuest.php'</script>";
			}
		}
		
		
		
	}

?>