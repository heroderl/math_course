<?php
/*
*  User: XuZuntong
*  Date: 2018-6-24
*  Time: 14:28
*/


class Rsa {

    private $private_key_path = "./rsa/rsa_private_key.pem";  // 私钥文件
    private $public_key_path = "./rsa/rsa_public_key.pem";  // 公钥文件

    /*
    *  读取私钥
    *  私钥存于服务端
    *  return string  返回私钥字符串
    */
    public function getPrivateKey() {
        return file_get_contents($this->private_key_path);
    }

    /*
    *  读取公钥
    *  公钥存于客户端
    *  return string  返回私钥字符串
    */
    public function getPublicKey() {
        return file_get_contents($this->public_key_path);
    }

    /*
    *  对数据进行私钥加密
    *  服务端进行
    *  $data string  要发送的明文数据，限制为100字符以内
    *  return string  返回加密后的数据
    */
    public function encode($data) {
        $pi_key = openssl_pkey_get_private($this->getPrivateKey());  // 判断密钥是否可用
        openssl_private_encrypt($data, $temp, $pi_key);  // 私钥加密
        return base64_encode($temp);  // 编码转换特殊字符
    }

    /*
    *  对数据进行私钥解密
    *  客户端进行
    *  $encrypted string  加密后的数据
    *  return string  返回解密后的数据
    */
    public function decode($encrypted) {
        $pu_key = openssl_pkey_get_public($this->getPublicKey());
        openssl_public_decrypt(base64_decode($encrypted), $decrypted, $pu_key);
        return $decrypted;
    }

    /*
    *  私钥签名
    *  服务端进行
    *  $data string  要发送的明文数据(不用担心被看见)
    *  return string  返回数字签名(就是私钥加密)
    */
    public function sign($data) {
        $pi_key = openssl_pkey_get_private($this->getPrivateKey());  // 获取Resource id
        openssl_sign($data, $signature, $pi_key, OPENSSL_ALGO_SHA1);
        return base64_encode($signature);
    }

    /*
    *  公钥验签
    *  客户端进行
    *  因为客户端发送过来的加密数据，即使被公钥解密了也无所谓，没有被泄露之说，只要保证传输过来的数据没有被篡改就形
    *  $data string  这里的数据是通过公钥解密出来的明文数据
    *  $signature string  数字签名
    *  return bool  将公钥解密出来的数据使用数字签名与原先明文数据进行对比，正确则返回true，否则为false
    */
    public function verify($data, $signature) {
        $pu_key = openssl_pkey_get_public($this->getPublicKey());
        $verify = openssl_verify($data, $signature, $pu_key, OPENSSL_ALGO_SHA1);
        if($verify == 1){
            return true;
        } else {
            return false;
        }
    }

}

$r = new Rsa();

// 将array转换为URL
function createString($param) {
    if(!is_array($param) || empty($param)) {
        return false;
    }

    $concatStr = "";
    foreach($param as $k=>$v) {
        $concatStr .= $k . '=' . $v . '&';
    }
    $concatStr = rtrim($concatStr, '&');

    return $concatStr;
}

// 原始数据data
$arr = array(
    'username' => '15001',
    'password' => '123'
);

// $sortStr = createString($arr);

$prikey = $r->getPrivateKey();
$pubkey = $r->getPublicKey();
print_r('私钥：' . $prikey . "<br><br>");
print_r('公钥：' . $pubkey . "<br><br>");

$sign = $r->sign("username=150001&password=123");
// $encode = $r->encode("username=150001&password=123", $prikey);
$encode = $r->encode1("username=150001&password=123", $pubkey);
print_r('私钥签名：' . $sign . "<br><br>");
// print_r('私钥加密：' . $encode . "<br><br>");
print_r('公钥加密：' . $encode . "<br><br>");

$decode = $r->decode1($encode);
$verify = $r->verify($decode, base64_decode($sign));
print_r('公钥验签：' . (int)$verify . "<br><br>");
// print_r('公钥解密：' . $decode);
print_r('私钥解密：' . $decode . "<br><br>");

