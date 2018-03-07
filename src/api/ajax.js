import reqwest from 'reqwest';
import loading from '@/components/loading/loading';

const host = '/api/v1';

let limitator = {};

function argumentsHandler (url, opts={}) {
    if(typeof url === 'string') {
        opts.url = host + url;
    }else if(typeof url === 'object') {
        opts = url;
        opts.url = host + url.url;
    }

    opts.method = opts.method ? opts.method.toUpperCase() : 'GET';

    if (opts.method && opts.method !== "GET" && opts.data) {
        opts.data = JSON.stringify(opts.data);
        opts.contentType = 'application/json'
    }

    return opts
}

/**
 * ajax
 * @param {String} url
 * @param {Object} opts
 * @param {String} opts.url
 * @param {String} opts.method //默认GET
 * @param {String} opts.data   //请求参数,JSON字符串格式
 * */
export default function ajax (url, opts = {}) {
    loading.show();
    let options = argumentsHandler(url, opts);
    console.log(options)


    if (opts.dom) {
        opts.dom.classList.add("disable");

        let key = opts.dom.id;
        if (limitator[key]) {
            alert('请勿频繁操作');
            return Promise.reject("请勿频繁操作")
        }
        limitator[key] = true;

        let _completeCallback = () => false;
        if (typeof opts.complete === 'function') {
            _completeCallback = opts.complete;
        }

        opts.complete = () => {
            delete limitator[key];

            opts.dom.classList.remove("disable");

            _completeCallback();
        }
    }

    return reqwest(options)
        .fail(err => {
            if (err.status === 200) return;
            if (err.status === 401) {
                alert("登录失效");
                setTimeout(() => {
                    window.location = '/login.html';
                }, 2e3);
                return;
            }
            if(err.status === 0) {
                setTimeout(() => {
                    alert("网络不稳定，刷新重试！");
                }, 0);
                return;
            }
            if (err.status === 504) {
                setTimeout(() => {
                    alert("返回超时");
                }, 0);
            } else if (err.status !== 404) {
                setTimeout(() => {
                    alert(err.responseText || err.msg || ("服务器错误(" + err.status + ")"), 5000);
                }, 0);
            }
        })
        .always(() => {
            loading.hide();
        })
}
