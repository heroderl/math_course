<?php

/**

* @author FataliBud

* @desc 获取php.exe的绝对路径

* @time 2014.08.20

*/

class command_base{   

    private $php_path='';   

    function real_path() {       

        if ($this->php_path != '') {           

            return $this->php_path;      

        }
		//判断服务器类型是否为windows
        if (substr(strtolower(PHP_OS), 0, 3) == 'win') {           
			//ini_get_all — 获取所有配置选项
            $ini = ini_get_all();                    
			//var_dump($ini);
			//echo "<br>";
			//extension_dir是PHP解压后 其中ext文件夹的路径
			//例如：c:/wamp/bin/php/php5.5.12/ext/ 
            $path = $ini['extension_dir']['local_value'];
			//echo $path; 
			//echo "<br>";          
			//str_replace — 子字符串替换
            $php_path = str_replace('\\', '/', $path);           
			//echo $php_path;
			//echo "<br>";
            $php_path = str_replace(array('/ext/', '/ext'), array('/', '/'), $php_path);            
			//echo $php_path;
			//echo "<br>";
			
            $real_path = $php_path . 'php.exe';   
			//echo $real_path;   
			//echo "<br>"; 

        } else {           

            $real_path = PHP_BINDIR . '/php';       

        }

        if (strpos($real_path, 'ephp.exe') !== FALSE) {           

            $real_path = str_replace('ephp.exe', 'php.exe', $real_path);  

        }       

        $this->php_path = $real_path;       

        return $this->php_path;   

    }

}//end class

$real_path_obj = new command_base();

$real_path =$real_path_obj->real_path();

return $real_path;

?>