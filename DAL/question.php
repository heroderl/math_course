<?php
/**
* Created by PhpStorm.
* User: dengjunle
* Date: 2018/11/10
* Time: 0:35
* Function: ��question��Ĵ���(��ɾ���)����limit�﷨��
*/
require_once(realpath(dirname(__FILE__)."/../")."/common/connection.php");
error_reporting(0);
$conn=new Connection();

/*
 * ���ã���ѯquestion�����ָ��һ�����⡣
 * ����ֵ����ά���飨����������Ϣ)
 */
function findoneQuestion($q_id){
	$conn=$GLOBALS["conn"];
	$sql="select * from question where q_id='$q_id'";
	$data=$conn->selectBySql($sql);
	$q_id=$data["data"]["0"]["q_id"];
	$q_No=$data["data"]["0"]["q_No"];
	$_SESSION["q_id"]=$q_id;//������ID����SESSION��
	$_SESSION["q_No"]=$q_No;//�������Ŵ���SESSION��
	return $data["data"]["0"];
}
//var_dump(findoneQuestion("2211"));

/*
 * ���ã���ѯquestion������������⡣
 * ����ֵ����ά���飨����������Ϣ)
 */
function AllQuestion(){
	$conn=$GLOBALS["conn"];
	$sql="select * from question";
	$data=$conn->selectBySql($sql);
	return $data["data"];
}
//var_dump(AllQuestion());

/*
 * ���ã�����question��������⡣
 * ����ֵ��int  success������ӳɹ�
 */
function InsertQuestion($q_No,$q_content,$q_board){
	$conn=$GLOBALS["conn"];
	$sql="INSERT INTO `math`.`question` (`q_id`, `q_No`, `q_content`, `q_state`, `q_time`, `q_board`, `q_other`) VALUES (NULL, '$q_No', '$q_content', '0', current_date(), '$q_board', '');";
	$data=$conn->insertBySql($sql);
	return $data["data"];
}
//var_dump(InsertQuestion("2211","����һ����","aaaaa","111"));

/*
 * ���ã��޸�question��������⡣
 * ����ֵ��int  success������ӳɹ�
 */
function updateQuestion($q_id,$q_content,$q_board){
	$conn=$GLOBALS["conn"];
	$sql="UPDATE `math`.`question` SET  `q_content` = '$q_content', `q_board` = '$q_board'  WHERE `question`.`q_id` = $q_id;";
	$data=$conn->updateBySql($sql);
	return $data["data"];
}
//var_dump(updateQuestion(2,"3322","NSA���","",""));

/*
 * ���ã�ɾ��question��������⡣
 * ����ֵ���ַ�success���ɾ��ɹ�
 */
function deleteQuestion($q_id){
	$conn=$GLOBALS["conn"];
	$sql="DELETE FROM `math`.`question` WHERE `question`.`q_id` = $q_id";
	$data=$conn->deleteBySql($sql);
	return $data["data"];
}
//var_dump(deleteQuestion(2));

/*
 * ���ã���ѯquestion�����ָ��һ�����⡣
 * ����ֵ����ά���飨����������Ϣ)
 */
function findNoQuestion($q_No){
	$conn=$GLOBALS["conn"];
	$sql="select * from question where q_No='$q_No'";
	$data=$conn->selectBySql($sql);
	return $data["data"];
}
//var_dump(findNoQuestion("2211"));

/*
 * ���ã���ѯquestion�����ָ��һ�����⡣
 * ����ֵ����ά���飨����������Ϣ)
 */
function lookOneQuestion($q_id){
	$conn=$GLOBALS["conn"];
	$sql="select * from question where q_id='$q_id'";
	$data=$conn->selectBySql($sql);
	return $data["data"];
}
//var_dump(lookOneQuestion(12));


/*
 * ���ã���ѯquestion�����ʱ�䡣
 * ����ֵ����ά���飨����������Ϣ)
 */
function looktimeQuestion($q_time){
	$conn=$GLOBALS["conn"];
	$sql="select * from question where q_time='$q_time' ";
	$data=$conn->selectBySql($sql);
	return $data["data"];
}
//var_dump(looktimeQuestion("2018-11-07"));


/*
 * ���ã��޸�question�����������״̬��
 * ����ֵ��int  success������ӳɹ�
 */
function updateChooseQuestion($q_id){
	$conn=$GLOBALS["conn"];
	$sql="UPDATE `math`.`question` SET `q_state` = '1' WHERE `question`.`q_id` = $q_id;";
	$data=$conn->updateBySql($sql);
	return $data["data"];
}

/*
 * ���ã��޸�question�����δ����״̬��
 * ����ֵ��int  success������ӳɹ�
 */
function updateNoChooseQuestion($q_id){
	$conn=$GLOBALS["conn"];
	$sql="UPDATE `math`.`question` SET `q_state` = '0' WHERE `question`.`q_id` = $q_id;";
	$data=$conn->updateBySql($sql);
	return $data["data"];
}
?>