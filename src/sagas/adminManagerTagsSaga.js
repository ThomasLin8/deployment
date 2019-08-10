import {put, take, call, select} from 'redux-saga/effects'
import {get, post} from '../fetch/fetch'
import {actionsTypes as IndexActionTypes} from '../reducers/globalStateReducer'
import {actionTypes as ManagerTransactionsTypes} from '../reducers/adminManagerTags'


// export function* fetch_transactions(pageNum) {
//     yield put({type: IndexActionTypes.FETCH_START});
//     try {
//         return yield call(get, `/admin/tags/getAllTransactions?pageNum=${pageNum}`);
//         //return yield call(get, `/tags/getAllTransactions?pageNum=${pageNum}`);
//     } catch (err) {
//         yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: '网络请求错误', msgType: 0});
//     } finally {
//         yield put({type: IndexActionTypes.FETCH_END})
//     }
// }


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
export function* addTransaction(transaction) {
    yield put({type: IndexActionTypes.FETCH_START});
    try {
        return yield call(post, '/admin/tags/addTransaction', transaction);
        //return yield call(post, '/tags/addTransaction', {transaction});
    } catch (err) {
        yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: '网络请求错误', msgType: 0});
    } finally {
        yield put({type: IndexActionTypes.FETCH_END})
    }
}

// export function* addLocal(data) {
//     yield put({type: IndexActionTypes.FETCH_START});
//     try {
//         return yield call(post, '/admin/tags/addLocal', data);
//         //return yield call(post, '/tags/addTransaction', {transaction});
//     } catch (err) {
//         yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: '网络请求错误', msgType: 0});
//     } finally {
//         yield put({type: IndexActionTypes.FETCH_END})
//     }
// }

export function* ipfsFind(ipfshash) {
    yield put({type: IndexActionTypes.FETCH_START});
    try {
        return yield call(get, `/admin/tags/IPFSfind?ipfshash=${ipfshash}`);
        //return yield call(post, '/tags/addTransaction', {transaction});
    } catch (err) {
        yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: '网络请求错误', msgType: 0});
    } finally {
        yield put({type: IndexActionTypes.FETCH_END})
    }
}

export function* bcFind(ipfshash) {
    yield put({type: IndexActionTypes.FETCH_START});
    try {
        return yield call(get, `/admin/tags/bcfind?ipfshash=${ipfshash}`);
        //return yield call(post, '/tags/addTransaction', {transaction});
    } catch (err) {
        yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: '网络请求错误', msgType: 0});
    } finally {
        yield put({type: IndexActionTypes.FETCH_END})
    }
}

export function* txFind(txhash) {
    yield put({type: IndexActionTypes.FETCH_START});
    try {
        return yield call(get, `/admin/tags/txfind?txhash=${txhash}`);
        //return yield call(post, '/tags/addTransaction', {transaction});
    } catch (err) {
        yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: '网络请求错误', msgType: 0});
    } finally {
        yield put({type: IndexActionTypes.FETCH_END})
    }
}


export function* updateWallet(transactiondata) {
    yield put({type: IndexActionTypes.FETCH_START});
    try {
        return yield call(post, `/admin/tags/updateWallet`,transactiondata);
    } catch (err) {
        yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: '网络请求错误', msgType: 0});
    } finally {
        yield put({type: IndexActionTypes.FETCH_END})
    }
}
    
//     yield put({type: IndexActionTypes.FETCH_START});
//     try {
//         return yield call(post, '/admin/tags/updateWallet', {wallet});
//         //return yield call(post, '/tags/addTransaction', {transaction});
//     } catch (err) {
//         yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: '网络请求错误', msgType: 0});
//     } finally {
//         yield put({type: IndexActionTypes.FETCH_END})
//     }
// }

// export function* getAllTransactionsFlow() {
//     while (true) {
//         let request = yield take(ManagerTransactionsTypes.GET_ALL_TRANSACTIONS);
//         let pageNum = request.pageNum||1;
//         let response = yield call(fetch_transactions,pageNum);
//         if(response&&response.code === 0){
//             for(let i = 0;i<response.data.list.length;i++){
//                 response.data.list[i].key = i;
//             }
//             let data = {};
//             data.total = response.data.total;
//             data.list  = response.data.list;
//             data.pageNum = Number.parseInt(pageNum);
//             yield put({type:ManagerTransactionsTypes.RESOLVE_GET_ALL_TRANSACTIONS,data:data})
//         }else{
//             yield put({type:IndexActionTypes.SET_MESSAGE,msgContent:response.message,msgType:0});
//         }
//     }
// }

export function* addTransactionFlow() {
    while (true) {

        let req = yield take(ManagerTransactionsTypes.ADD_TRANSACTIONS);
        let res = yield call(addTransaction, req.transaction);
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
// export function* addLocalFlow() {
//     while (true) {

//         let req = yield take(ManagerTransactionsTypes.ADD_LOCAL);
//         let res = yield call(addLocal, req.data);
//         if (res.code === 0) {
//             yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: res.message, msgType: 1});
//            // yield put({type:ManagerTransactionsTypes.GET_ALL_TRANSACTIONS});
//         }else if (res.message === '身份信息已过期，请重新登录') {
//             yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: res.message, msgType: 0});
//             setTimeout(function () {
//                 location.replace('/');
//             }, 1000);
//         }  else {
//             yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: res.message, msgType: 0});
//         }
//     }
// }




export function* ipfsFindFlow() {
    while (true) {

        let req = yield take(ManagerTransactionsTypes.IPFS_FIND);
        let res = yield call(ipfsFind, req.ipfshash);
        if (res.code === 0) {
            yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: res.message, msgType: 1});
           // yield put({type:ManagerTransactionsTypes.GET_ALL_TRANSACTIONS});
           let data = {};
           data.uploadipfs = res.data.uploadipfs;
           data.savedipfs  = res.data.savedipfs;
           data.bctxhash  = res.data.bctxhash;
         //  data.ipfsshow = res.data.ipfsshow
           yield put({type:ManagerTransactionsTypes.RESOLVE_IPFS_FIND,data:data})
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
export function* bcFindFlow() {
    while (true) {

        let req = yield take(ManagerTransactionsTypes.BC_FIND);
        let res = yield call(bcFind, req.ipfshash);
        if (res.code === 0) {
            yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: res.message, msgType: 1});
           // yield put({type:ManagerTransactionsTypes.GET_ALL_TRANSACTIONS});
           let data = {};
           data.bcuipfs = res.data.bcuipfs;
           data.bcipfs  = res.data.bcipfs;
           data.bctxhash  = res.data.bctxhash;
          // data.bcshow = res.data.bcshow
          console.log('数据',data)
           yield put({type:ManagerTransactionsTypes.RESOLVE_BC_FIND,data:data})
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

export function* txFindFlow() {
    while (true) {

        let req = yield take(ManagerTransactionsTypes.TXHASH_FIND);
        let res = yield call(txFind, req.txhash);
        if (res.code === 0) {
            yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: res.message, msgType: 1});
           // yield put({type:ManagerTransactionsTypes.GET_ALL_TRANSACTIONS});
           let data = {};
         //  data.txhash1 = res.data.txhash1;
         console.log('res.data数据',res.data)
           data.txbchash  = res.data.txbchash;
           data.txipfshash  = res.data.txipfshash;
           data.txgasused  = res.data.txgasused;
          console.log('data数据',data)
          
          // data.bcshow = res.data.bcshow
           yield put({type:ManagerTransactionsTypes.RESOLVE_TXHASH_FIND,data:data})
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


export function* updateWalletFlow() {
    while (true) {

        let req = yield take(ManagerTransactionsTypes.UPDATE_WALLET);
        let res = yield call(updateWallet, req.transactiondata);
        if (res.code === 0) {
            yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: res.message, msgType: 1});
           // yield put({type:ManagerTransactionsTypes.GET_ALL_TRANSACTIONS});
           
            let data = {};
           // data.bcutxhash = res.data.bcutxhash;
           // data.successshow  = res.data.successshow;
           data.balance = res.data.balance;
           console.log('余额',data)
            yield put({type:ManagerTransactionsTypes.RESOLVE_UPDATE_WALLET,data:data})
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
export function* deleteTransaction (ID) {
    yield put({type: IndexActionTypes.FETCH_START});
    try {
        return yield call(get, `/admin/tags/delTransaction?ID=${ID}`);
    } catch (err) {
        yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: '网络请求错误', msgType: 0});
    } finally {
        yield put({type: IndexActionTypes.FETCH_END})
    }
}

export function* deleteTransactionFlow () {
    while(true){
        let req = yield take(ManagerTransactionsTypes.DELETE_TRANSACTION);
        //const pageNum = yield select(state=>state.pageNum);
        let res = yield call(deleteTransaction,req.ID);
        if(res){
            if (res.code === 0) {
                yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: '删除成功!', msgType: 1});
               // yield put({type:ManagerUserActionTypes.GET_ALL_USER,pageNum})
            } else if (res.message === '身份信息已过期，请重新登录') {
                yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: res.message, msgType: 0});
                setTimeout(function () {
                    location.replace('/');
                }, 1000);
            } else {
                yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: res.message, msgType: 0});
            }
        }
    }
}