<?php
session_start();
/*
*  User: XuZuntong
*  Date: 2018-6-22
*  Time: 11:15
*/

require_once(realpath(dirname(__FILE__) . "/") . "/database.php");
require_once(realpath(dirname(__FILE__) . "/") . "/response.php");

/*
*  数据库的连接，以及增删改查
*/

class Connection {
    private static $mysqli = null;

    /*
    *  构造函数，初始化mysqli对象
    */
    public function __construct() {
        $this->connect();
    }

    /*
    *  析构函数，销毁mysqli对象
    */
    public function __destruct() {
        $this->close();
    }

    /*
    *  创建连接数据库对象
    *  return：bool。true表示数据库连接正常；false表示数据库连接抛出异常
    */
    private function connect() {
        try {
            $c = config();
            self::$mysqli = new mysqli($c['host'], $c['username'], $c['password'], $c['database'], $c['port']);
            self::$mysqli->set_charset($c['charset']);  // 设置查询结果编码
            self::$mysqli->query("set names {$c['charset']}");

            return true;
        } catch(Exception $e) {
            return false;
        }
    }

    /*
    *  判断是否连接上数据库
    *  return：bool。true表示数据库已连接；false：表示数据库连接未连接
    */
    private function isConnect() {
        if(self::$mysqli) {
            return true;
        }
        if(!self::$mysqli) {
            return false;
        }
    }

    /*
    *  销毁mysqli对象，断开数据库连接
    */
    private function close() {
        if(self::$mysqli) {
            self::$mysqli->close();
        }
        self::$mysqli = null;
    }

    /*
    *  数据库查询，返回一个数组对象
    *  $sql：数据库查询语句
    *  return：返回 Response::regular() 下的对象
    */
    private function query($sql) {
        if(!$this->isConnect()) {
            $this->connect();
        }
        if($this->isConnect()) {
            try {
                $result = self::$mysqli->query($sql);

                $data = array();
                if($result) {
                    while($row = $result->fetch_assoc()) {
                        $data[] = $row;
                    }

                    return Response::regular(200, "查询成功", $data);
                }
                
                return Response::regular(404, "查询失败");
            } catch(Exception $e) {
                return Response::regular(404, "查询失败");
            }
        }

        return Response::regular(503, "数据库连接失败");
    }

    /*
    *  数据库查询，返回受影响的函数
    *  $sql：数据库查询语句
    *  return：返回 Response::regular() 下的对象
    */
    private function exec($sql) {
        if(!$this->isConnect()) {
            $this->connect();
        }
        if($this->connect()) {
            try {
                $result = self::$mysqli->query($sql);
                if($result) {
                    if(self::$mysqli->affected_rows > 0) {
                        return Response::regular(200, "查询成功", array('success'));
                    } else {
                        return Response::regular(404, "查询失败");
                    }
                }

                return Response::regular(404, "查询失败");
            } catch(Exception $e) {
                return Response::regular(404, "查询失败");
            }
        }

        return Response::regular(503, "数据库连接失败");
    }

    /*
    *  将常规格式的数据转换为json格式的数据
    *  @param array $data  regular格式的数据
    *  return json  返回json格式的数据
    */
    public function json($data, $code=0, $message="") {
        if(empty($code)) {
            Response::json($data['code'], $data['message'], $data['data']);
        } else {
            Response::json($code, $message, $data);
        }
    }

    /*
    *  数据库查询
    *  $sql：完整的sql语句
    *  return：返回 Response::regular() 下的对象
    */
    public function selectBySql($sql) {
        return $this->query($sql);
    }

    /*
    *  添加数据
    *  $sql：完整的sql语句
    *  return：返回 Response::regular() 下的对象
    */
    public function insertBySql($sql) {
        return $this->exec($sql);
    }

    /*
    *  删除数据
    *  $sql：完整的sql语句
    *  return：返回 Response::regular() 下的对象
    */
    public function deleteBySql($sql) {
        return $this->exec($sql);
    }

    /*
    *  更新数据
    *  $sql：完整的sql语句
    *  return：返回 Response::regular() 下的对象
    */
    public function updateBySql($sql) {
        return $this->exec($sql);
    }

    /*
    *  获取记录条数
    *  $sql：完整的sql语句
    *  return：返回 Response::regular() 下的对象
    */
    public function countBySql($sql) {
        return $this->query($sql);
    }

    /*
    *  获取表中所有记录的总条数
    *  $tablename：表名
    *  $where：条件
    *  return：返回 Response::regular() 下的对象
    */
    public function countAll($tablename, $where) {
        $sql = "select count(*) as count from {$tablename} where {$where}";
        $result = $this->query($sql);

        return $result;
    }
}


?>