import { observable, computed, action, runInAction, autorun } from 'mobx';
import { count } from '@/api/user';

class Store {
    constructor() {
        autorun(() => {
            this.fetchData();
        })
    }

    @observable number = 23;

    fetchData() {
        // console.log(2)
    }

    @action.bound
    _count() {
        count().then(res => {
            console.log(res)
            this.number = res.lockstatus.length;
        })
    }
}

export default new Store;
