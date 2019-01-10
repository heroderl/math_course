import config from '../../common/config'

/**
 * 身份
 */
export enum EIdentity {
    teacher = 'teacher',
    student = 'student'
}

/**
 * socket
 */
export class Socket {
    private ws: WebSocket;
    private identity: EIdentity;

    constructor (identity: EIdentity) {
        this.ws = new WebSocket('ws://' + config().host + ':' + config().socketPost);
        this.identity = identity;
        this.connSuccess();
        this.connError();
    }

    /**
     * 连接成功时，先服务器证明自己的身份
     * @param status 推送状态
     * @param qid 推送试题
     */
    private connSuccess (): void {
        this.ws.onopen = () => {
            this.ws.send(JSON.stringify({
                'identity': this.identity,
                'data': {}
            }));
        };
    }

    /**
     * 连接失败
     */
    private connError (): void {
        this.ws.onerror = () => {
            console.log('网络连接失败');
        };
    }

    /**
     * 接收消息
     * @param callback 回调函数，附带参数data，表示接收到的数据
     */
    public message (callback: Function): void {
        this.ws.onmessage = (e) => {
            callback(e['data']);
        };
    }

    /**
     * 只有教师发送消息
     * @param status 推送状态
     * @param qid 推送试题
     */
    public send (status: boolean, qid: number): void {
        if (this.identity === EIdentity.teacher) {
            this.ws.send(JSON.stringify({
                'identity': EIdentity.teacher,
                'data': { status, qid }
            }));
        }
    }

}
