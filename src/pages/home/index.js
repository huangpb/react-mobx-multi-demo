import 'babel-polyfill';  //转换新版本 js 的 API

import '@/styles/reset.css'
import '@/styles/index.css';
import '@/styles/iconfont/iconfont.css';
import '@/components/loading/loading.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import store from './store';
import Home from './home';


//remove mobile 300ms delay
//import FastClick from 'fastclick';
//FastClick.attach(document.body);


//热加载
const render = (App) => {
    ReactDOM.render(
        <AppContainer>
            <App store={store}/>
        </AppContainer>,
        document.getElementById('root')
    )
};

render(Home);


if(module.hot) {
    module.hot.accept('./home', () => {
        render(require('./home').default)
    })
}

