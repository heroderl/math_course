<?php
session_start();
header("Access-Control-Allow-Origin: *"); // 允许任意域名发起的跨域请求  
/*
 * Created by PhpStorm.
 * User: dengjunle
 * Date: 2018/12/24
 * Time: 19：41
 * Function:查看指定文件下的图片
 */
class studentImage{
		//获取图片文件夹的名字
	public function timefile(){
		$phpsessid=$_POST["phpid"];//获取前端发送过来的phpsessid
//		if(isset($_COOKIE['username']))
		if($_COOKIE['PHPSESSID']==$phpsessid)
		{
			if($_SESSION["overtime"]>time())
			{
				$hostdir=dirname(dirname(__FILE__))."/studentImage/"; //要读取的文件夹
				$filesnames = scandir($hostdir); //得到所有的文件
				$timefile=[];
				$i=0;
				foreach ($filesnames  as $key=>$name) {
					if(is_numeric($name)){
							$timefile[$i]=$name;
							$i++;
						}
				}
				header("Access-Control-Allow-Origin: *"); // 允许任意域名发起的跨域请求  
				echo json_encode($timefile);
		        exit;
	    	 }else{
	     		echo json_encode(0);
	     	}
		}
		else{
			echo json_encode(0);
		}
	}
		
		//获取指定文件夹下的图片名字
		//接口参数
		//$_POST["time"]//文件夹的名字
	public function image(){
		$time = $_POST["time"];
		$phpsessid=$_POST['phpid'];//获取前端发送过来的phpsessid
//		if(isset($_COOKIE['username']))
		if($_COOKIE['PHPSESSID']==$phpsessid)
		{
			if($_SESSION["overtime"]>time())
			{
				$hostdir=dirname(dirname(__FILE__))."/studentImage/$time/"; //要读取的文件夹
				
				$url = '../studentImage/'.$time.'/'; //图片所存在的目录
				//$url = '../studentImage/20181224/'; //图片所存在的目录
				$filesnames = scandir($hostdir); //得到所有的文件
				// print_r($filesnames);exit;
				//获取也就是扫描文件夹内的文件及文件夹名存入数组 $filesnames
				$imagename=[];
				$i=0;
				foreach ($filesnames  as $key=>$name) {
					//echo $name."<br>";
					//echo $url.$name."<br>";
					$result = $url.$name;
					$ext = strrchr($result,'.');
					if($ext==".gif"||$ext==".png"||$ext==".jpg"||$ext==".jpeg")
					{		
							$imagename[$i]=$name;
							$i++;
							//$aurl= "<img width='100' height='100' src='".$url.$name."' />"; //图片
							//echo $aurl."<br/>"; //输出他
					}
				}
				//var_dump($imagename);
				header("Access-Control-Allow-Origin: *"); // 允许任意域名发起的跨域请求  
				echo json_encode($imagename);
		        exit;
        	}
		}else{
			
		}
	}
}

