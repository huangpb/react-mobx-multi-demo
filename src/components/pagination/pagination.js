//思路：先生成一个数组，分页的列表按照数组渲染。
// 数组中最前面肯定有小于号，1，最后面肯定有总页数，大于号，
// 所以只要根据当前页通过各种可能出现情况的判断动态生成列表中间部分就可以了。
//先生成数组中间动态的部分，然后在数组中追加那个固定的部分。
import React from 'react';

import './pagination.css';

export default class Pagination extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: this.props.current,
            total: this.props.total,
            page: 1
        }
    }

    fetchData(v) {

    }

    left5() {
        console.log('左移5')
        let left = this.state.current - 5;
        this.setState({
            current: left < 1 ? 1 : left
        })
    }

    right5() {
        console.log('右移5')
        let right = this.state.current + 5;
        let total = this.state.total;
        this.setState({
            current: right > total ? total : right
        })
    }

    jump(v) {
        v = Number(v);
        if(v === this.state.current) return;
        if(!(v >= 1 && v <= this.state.total)) return;
        this.fetchData(v); //根据当前页获取数据

        this.setState({
            current: v
        })
    }

    changePage(e) {
        this.setState({
            page: e.target.value
        })
    }

    _constructPagination() {
        let {current, total} = this.state;
        let start = current - 2;
        let end = current + 2;
        let arr = [];

        let repeat_start, repeat_end;
        repeat_start = start < 1 ? 1 : start > (total - 5) ? (total - 4) : start;

        if(end < 5) {
            repeat_end = total > 5 ? 5 : total;
        }else if(end > total){
            repeat_end = total;
        }else {
            repeat_end = (current + 2);
        }
        for(let i=repeat_start; i<=repeat_end; i++) {
            arr.push(i);
        }

        //数组开头是1就去掉
        if(arr[0] === 1) {
            arr.shift();
        }

        //数组开头补充完整
        if(start > 2) {
            arr.unshift('left5');
        }
        arr.unshift(1);
        arr.unshift('<');


        //数组结尾是total就去掉
        if(arr[arr.length-1] === total) {
            arr.pop();
        }

        //数组结尾补充完整
        if(arr[arr.length-1] + 1 < total) {
            arr.push('right5');
        }
        arr.push(total);
        arr.push('>');

        // console.log(arr)

        return arr.map((item) => {
            if(item === 'left5') {
                return <li onClick={this.left5.bind(this)} key={item}>...</li>
            }else if(item === 'right5') {
                return <li onClick={this.right5.bind(this)} key={item}>...</li>
            }else {
                let page;
                if(item === '<') {
                    page = current > 1 ? (current - 1) : 1;
                }else if(item === '>') {
                    page = current < total ? (current + 1) : total;
                }else {
                    page = item;
                }

                //添加当前页或禁止样式
                let classname = '';
                if((item === '<' && current === 1) || (item === '>' && current === total)) {
                    classname = 'disabled';
                }
                if(item === current) {
                    classname = 'current';
                }

                return <li className={classname} onClick={this.jump.bind(this, page)} key={item}>{item}</li>
            }
        })
    }

    render() {
        return (
            <div className="pagination">
                <div className="pagination-goto-wrap">
                    <span>跳转到：</span>
                    <input className="pagination-goto-wrap-input"
                           type="text"
                           value={this.state.page}
                           onChange={this.changePage.bind(this)}/>
                    <button onClick={this.jump.bind(this, this.state.page)}>确定</button>
                </div>

                <ul className="pagination-list">
                    {
                        this._constructPagination()
                    }
                </ul>
            </div>
        )
    }
}
