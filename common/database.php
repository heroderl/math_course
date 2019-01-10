<?php
/*
*  User: XuZuntong
*  Date: 2018-6-22
*  Time: 11:20
*/
function config() {
    return array(
        'type'          => 'mysql',     // 数据库类型
        'host'          => 'localhost', // 服务器地址
        'database'      => 'math',   // 数据库名
        // 'port'          => '3309',      // 端口号
        'port'          => '3306',
        'username'      => 'root',      // 数据库用户名
        // 'password'      => 'hk@2016',          // 数据库密码
        'password'      => '',
        'charset'       => 'utf8'       // 数据库编码
    );
}

?>