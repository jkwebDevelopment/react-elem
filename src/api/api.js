import Server from './server';
import { getUrlConcat } from '../utils/commons';

class API extends Server {
    /**
   * 获取用户消息
   * @param {*} get的拼接参数
   */
    async getUser(data) {
        try {
            let result = await this.axios('get', '/v1/user'+getUrlConcat(data));
            if(result.status !== 0 && (result instanceof Object)) {
                return result || [];
            } else {
                let err = {
                    tip: '获取用户信息失败',
                    response: result
                }
                throw err;
            }
        } catch(err) {
            throw err
        }
    }
}

export default new API();