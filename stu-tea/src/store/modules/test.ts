// 举例

interface IShape {
    id: number
    no: number
}

export interface IState {
    added: IShape[]
    checkoutStatus: 'successful' | 'failed' | null
}

// 初始化state
const state: IState = {
    added: [],
    checkoutStatus: null
}

// 需要引用state的地方
const getters = {
    checkoutStatus: (state: IState) => state.checkoutStatus
}
