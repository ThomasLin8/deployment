import {put, take, call, select} from 'redux-saga/effects'
import {get, post} from '../fetch/fetch'
import {actionsTypes as IndexActionTypes} from '../reducers/globalStateReducer'
import {actionTypes as ManagerTransactionsTypes} from '../reducers/adminManagerTags'


export function* fetch_transactions(pageNum) {
    yield put({type: IndexActionTypes.FETCH_START});
    try {
        return yield call(get, `/admin/tags/getAllTransactions?pageNum=${pageNum}`);
        //return yield call(get, `/tags/getAllTransactions?pageNum=${pageNum}`);
    } catch (err) {
        yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: '网络请求错误', msgType: 0});
    } finally {
        yield put({type: IndexActionTypes.FETCH_END})
    }
}





export function* updateWallet(wallet) {
    yield put({type: IndexActionTypes.FETCH_START});
    try {
        return yield call(post, '/admin/tags/updateWallet', {wallet});
        //return yield call(post, '/tags/addTransaction', {transaction});
    } catch (err) {
        yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: '网络请求错误', msgType: 0});
    } finally {
        yield put({type: IndexActionTypes.FETCH_END})
    }
}

export function* getAllTransactionsFlow() {
    while (true) {
        let request = yield take(ManagerTransactionsTypes.GET_ALL_TRANSACTIONS);
        let pageNum = request.pageNum||1;
        let response = yield call(fetch_transactions,pageNum);
        if(response&&response.code === 0){
            for(let i = 0;i<response.data.list.length;i++){
                response.data.list[i].key = i;
            }
            let data = {};
            data.total = response.data.total;
            data.list  = response.data.list;
            data.pageNum = Number.parseInt(pageNum);
            yield put({type:ManagerTransactionsTypes.RESOLVE_GET_ALL_TRANSACTIONS,data:data})
        }else{
            yield put({type:IndexActionTypes.SET_MESSAGE,msgContent:response.message,msgType:0});
        }
    }
}



export function* updateWalletFlow() {
    while (true) {

        let req = yield take(ManagerTransactionsTypes.UPDATE_WALLET);
        let res = yield call(updateWallet, req.wallet);
        if (res.code === 0) {
            yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: res.message, msgType: 1});
           // yield put({type:ManagerTransactionsTypes.GET_ALL_TRANSACTIONS});
        }else if (res.message === '身份信息已过期，请重新登录') {
            yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: res.message, msgType: 0});
            setTimeout(function () {
                location.replace('/');
            }, 1000);
        }  else {
            yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: res.message, msgType: 0});
        }
    }
}