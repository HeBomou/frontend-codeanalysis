import axios from 'axios'

/**
  * get方法，对应get请求
  * @param {String} url [请求的url地址]
  * @param {Object} params [请求时携带的参数]
  */
export function get(url, params){
    return new Promise((resolve, reject) =>{
        axios.get(url, {
            params: params
        })
        .then(res => {
            resolve(res.data);
        })
        .catch(err => {
            reject(err.data)
        })
    });
}

/**
  * post方法，对应post请求
  * @param {String} url [请求的url地址]
  * @param {Object} params [请求时携带的参数]
  */
export function post(url, params) {
    return new Promise((resolve, reject) => {
        axios.post(url, params)
        .then(res => {
            resolve(res.data);
        })
        .catch(err => {
            reject(err.data)
        })
    });
}

/**
 * delete请求
 * @param {String} url 
 * @param {Object} params 
 */
export function del(url) {
    return new Promise((resolve, reject) => {
        axios.delete(url, {	
            params: {	// 请求参数拼接在url上
              id: 12
            }
          }).then(res => {
            resolve(res.data);
        })
        .catch(err => {
            reject(err.data)
        })
    }

    );
}

/**
 * 
 * @param {String} url 
 * @param {Object} params 
 */
export function put(url, params) {
    return new Promise((resolve, reject) => {
        axios.put(url, {
            params: params
        })
        .then(res => {
            resolve(res.data);
        })
        .catch(err => {
            reject(err.data)
        })
    });
}