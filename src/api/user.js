import apis from './apis';
import ajax from './ajax';

export function login(data) {
    return ajax({
        url: apis.login,
        method: 'post',
        data: data,
    })
}

export function count() {
    return ajax(apis.count);
}
