<?php
use Workerman\Worker;//使用命名空间
require_once(realpath(dirname(__FILE__) . '/../') . '/socket/Workerman/Autoloader.php');//框架的入口

class WebSocket {
	private $ws_worker;
	private $idArrs = array(-1);  // 存放身份
	private $tdata = array('status' => false, 'qid' => 0);  // 存放消息

	public function __construct() {
		$this->ws_worker = new Worker("websocket://0.0.0.0:2000");
		//启动进程对外提供服务
		$this->ws_worker->count = 1;

        $this->conn();
        $this->close();
		$this->message();
	}

	// 运行Worker
	public function start() {
		Worker::runAll();
	}

	// 接收客户端的连接
	private function conn() {
		$this->ws_worker->onConnect = function($connection) {
			//$connection->send('123');
		};
    }
    
    // 客户端断开连接时
    private function close() {
        $this->ws_worker->onClose = function($connection) {
            for($i = 0; $i < count($this->idArrs); $i++) {
                if ($this->idArrs[$i] == $connection->id) {
                    if ($i == 0) {
                        // 去除教师
                        $this->idArrs[0] = -1;
                    } else {
                        // 去除学生
                        array_splice($this->idArrs, $i, 1);
                    }
                }
            }
        };
    }

	// 接收客户端发送的消息
	private function message() {
		$this->ws_worker->onMessage = function($connection, $data) {
			$data = json_decode($data);

			if ($this->judgeID($data)) {
                // 学生
                
                // 判断是否已存在
                $num = 0;
                for ($i = 0; $i < count($this->idArrs); $i++) {
                    if ($connection->id == $this->idArrs) {
                        $num++;
                    }
                }
                if ($num == 0) {
                    array_push($this->idArrs, $connection->id);
                }
                
                // 向自己发送消息
				$connection->send(json_encode($this->tdata));
			} else {
                // 教师
                if ($this->idArrs[0] == -1) {
                    $this->idArrs[0] = $connection->id;
                }

                if (json_encode($data->data) == '{}') {
                    // 教师证明身份时，附带空的data
                    // 给自己发送消息
                    $connection->send(json_encode($this->tdata));
                } else {
                    // 教师发送消息时，附带有值的data
                    // 判断是否推送
                    if ($data->data->status) {
                        // 推送中
                        $this->tdata['status'] = true;
                        $this->tdata['qid'] = $data->data->qid;
                    } else {
                        // 推送结束
                        $this->tdata['status'] = false;
                        $this->tdata['qid'] = 0;
                    }

                    // 向学生们发送消息
                    for ($i = 1; $i < count($this->idArrs); $i++) {
                        $connection->worker->connections[$this->idArrs[$i]]->send(json_encode($this->tdata));
                    }
                }
			}
		};
	}

	// 判断身份
	// $data {'identity': 'student'/'teacher', data: {}}
	private function judgeID($data) {
		if ($data->identity === 'student') {
			// 学生
			return true;
		} else if ($data->identity === 'teacher') {
			// 教师
			return false;
		}
	}
}

$ws = new WebSocket();
$ws -> start();