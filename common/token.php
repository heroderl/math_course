<?php
/*
*  User: XuZuntong
*  Date: 2018-6-22
*  Time: 11:20
*/

class Token {

    /*
    *  header
    *  return base64Encode  返回数据
    */
    private function header() {
        return [
            'typ' => 'JWT',
            'alg' => 'sha256'
        ];
    }

    /*
    *  载荷
    *  不能存放敏感数据，如密码
    *  @param array $data  数据
    *  return base64Encode  返回数据
    */
    private function payload(array $data) {
        $nowtime = $_SERVER['REQUEST_TIME'];

        $payload = [
            "iss" => "Online JWT Builder",  // 签发者
            "iat" => $nowtime,  // 签发时间
            "exp" => $nowtime + 36000,  // 过期时间，秒为单位
            'data' => $data  // 数据
        ];

        return $payload;
    }

    /*
    *  生成signature
    *  @param stting $alg  设置哪种加密方式
    *  @param array $header64  base64安全编码后的header
    *  @param array $payload64  base64安全编码后的payload
    *  return hash_hmac  返回签名
    */
    private static function signature($alg, $header64, $payload64) {
        $secret = 'AhW78K2V408IG38CU046SM';

        return hash_hmac($alg, $header64 . "." . $payload64, $secret);
    }

    /*
    *  base64安全编码，防止被特殊字符串分割
    *  @param string str  要编码的字符串
    *  return base64_encode  被转换后进行编码的十六进制数据
    */
    private static function base64UrlEncode($str) {
        $find = array('+', '/');
        $replace = array('-', '_');

        return str_replace($find, $replace, base64_encode($str));
    }

    /*
    *  base64安全解码
    *  @param string str  要解码的字符串
    *  return base64_decode  返回解码后端的数据
    */
    private static function base64UrlDecode($str) {
        $find = array('-', '_');
        $replace = array('+', '/');
        $str = str_replace($find, $replace, $str);

        return base64_decode($str);
    }

    /*
    *  生成jwtToken
    *  @param string $data  要编码的字符串
    *  return string  返回jwt
    */
    public function jwtToken(array $data) {
        $header64 = $this->base64UrlEncode(json_encode($this->header()));
        $payload64 = $this->base64UrlEncode(json_encode($this->payload($data)));

        return $header64 . "." . $payload64 . "." . $this->signature($this->header()['alg'], $header64, $payload64);
    }

    /*
    *  验证token
    *  @param string $jwt  接受客户端请求头部header里的Authorization值
    *  return string  返回jwt
    */
    public static function checkJwtToken($jwt="") {
        $tokens = explode('.', $jwt);

        if(count($tokens) != 3) {
            return false;
        }

        list($header64, $payload64, $signature) = $tokens;

        $header = json_decode(self::base64UrlDecode($header64), JSON_OBJECT_AS_ARRAY);
        if(empty($header['alg'])) {
            return false;
        }
        if(self::signature($header['alg'], $header64, $payload64) !== $signature) {
            return false;
        }

        $payload = json_decode(self::base64UrlDecode($payload64), JSON_OBJECT_AS_ARRAY);

        $nowtime = time();
        if(isset($payload['iat']) && $payload['iat'] > $nowtime) {
            return false;
        }
        if(isset($payload['exp']) && $payload['exp'] < $nowtime) {
            return false;
        }

        return $payload;
    }
}

