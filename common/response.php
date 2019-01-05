<?php
/*
*  User: XuZuntong
*  Date: 2018-6-22
*  Time: 11:20
*/


/*
*  返回值的格式化，有json格式，也有常规格式
*/
class Response {
    /* 
    *  以json格式传输数据
    *  @param int code  状态码;
    *  @param string message  失败信息
    *  @param array data  传输数据，默认为空数组
    *  return string  回json格式的数据
    */
    public static function json($code, $message = "", $data = array()) {
        $result = array(
            'code'      => $code,
            'message'   => $message,
            'data'      => $data
        );
        
        echo json_encode($result);
        exit;
    }

    /* 
    *  以常规格式传输数据
    *  @param int code  状态码;
    *  @param string message  失败信息
    *  @param array data  传输数据，默认为空数组
    *  return string  返回常规格式的数据
    */
    public static function regular($code, $message = "", $data = array()) {
        $result = array(
            'code'      => $code,
            'message'   => $message,
            'data'      => $data
        );

        return $result;
    }
}

?>