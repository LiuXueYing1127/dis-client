import JsonP from 'jsonp'
import axios from 'axios'
import { Modal } from 'antd';

export default class Axios{
    static jsonp(options){
        return new Promise((resolve,reject)=>{
            JsonP(options.url,{
                param:'callback'
            },function(err,response){
                // eslint-disable-next-line
                if(response.status == 'success'){
                    resolve(response)
                }else{
                    reject(response.message)
                }
            })
        })
    }

    static ajax(options){
        let baseApi='http://localhost:8080'
        return new Promise((resolve,reject)=>{
            axios({
                url:options.url,
                method:options.method,
                baseURL:baseApi,
                params:(options.data && options.data.params)|| '',
                data:(options.data)|| '',
                headers: (options.headers)|| '',
                //withCredentials: true // 允许跨域带上cookies
            }).then((response)=>{
                // eslint-disable-next-line
                if(response.status == '200'){
                    let res = response.data
                    // eslint-disable-next-line
                    if(res.resultCode === 0){
                        resolve(res);
                    }else{
                        Modal.info({
                            title:"提示",
                            content:res.msg
                        })
                    }
                }else{
                    reject(response.data)
                }
            })
        })
    }
}