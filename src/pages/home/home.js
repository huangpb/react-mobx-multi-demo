import React from 'react';
import { observer } from 'mobx-react';
import { login, count } from '@/api/user';
import Pagination from '@/components/pagination/pagination';
import loading from '@/components/loading/loading';
import store from './store';

console.log(process.env.NODE_ENV)
@observer
export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: 'jim'
        }

        loading.show();
    }

    _login() {
        let data = {
            phone: '15168353308',
            password: '123456',
            remember: true
        }
        login(data)
            .then(res => {
                console.log(res)
            })
            .always(() => {
                console.log('完成')
            });
    }

    render() {
        const { number, _count } = this.props.store;

        return (
            <div>
                <h1>Home, {this.state.name}, age {number}</h1>
                <button onClick={this._login.bind(this)}>POST请求验证</button>
                <button onClick={_count}>GET请求验证</button>
                <Pagination current={5} total={16}/>
                <a href="user.html">跳到 User 页</a>
                <a href="others.html">跳到 Others 页</a>
            </div>
        )
    }
}
