<?php
class KeepPhoto{
	public  function base64_image_content(){
		$imgName = $_POST['imgName'];
		$base64_image_content=$_POST['imgData'];
		//echo  $base64_image_content;
		//匹配出图片的格式
		if (preg_match('/^(data:\s*image\/(\w+);base64,)/', $base64_image_content, $result)){
			$type = $result[2];
			$time = date("Ymd");
			$dir = iconv("UTF-8", "GBK", "../studentImage/" . "$time/");
			//$dir = "test/".$dir;
			if(!file_exists($dir)){
				//检查是否有该文件夹，如果没有就创建，并给予最高权限
				mkdir($dir, 0700, true);
				//echo "创建成功";
			}

			$dir = $dir . $imgName . ".{$type}";
			if (file_put_contents($dir, base64_decode(str_replace($result[1], '', $base64_image_content)))){
				//echo '/'.$dir;
				echo json_encode(array('status' => true));
			}else{
				//echo "失败";
				echo json_encode(array('status' => false));
			}
		}else{
			//echo "失败了";
			echo json_encode(array('status' => false));
		}
	}
}