import {put, take, call, select} from 'redux-saga/effects'
import {get,post} from '../fetch/fetch'
import {actionsTypes as IndexActionTypes} from '../reducers/globalStateReducer'
import {actionTypes as ManagerUserActionTypes} from '../reducers/adminManagerUser'


export function* fetch_users(pageNum) {
    yield put({type: IndexActionTypes.FETCH_START});
    try {
        return yield call(get, `/admin/getUsers?pageNum=${pageNum}`);
    } catch (err) {
        yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: '网络请求错误', msgType: 0});
    } finally {
        yield put({type: IndexActionTypes.FETCH_END})
    }
}

export function* get_all_users_flow() {
    while (true) {
        let request = yield take(ManagerUserActionTypes.GET_ALL_USER);
        let pageNum = request.pageNum||1;
        let response = yield call(fetch_users,pageNum);
        if(response&&response.code === 0){
            for(let i = 0;i<response.data.list.length;i++){
                response.data.list[i].key = i;
            }
            let data = {};
            data.total = response.data.total;
            data.list  = response.data.list;
            data.pageNum = Number.parseInt(pageNum);
            yield put({type:ManagerUserActionTypes.RESOLVE_GET_ALL_USERS,data:data})
        }else{
            yield put({type:IndexActionTypes.SET_MESSAGE,msgContent:response.message,msgType:0});
        }
    }
}

export function* deleteUser (username) {
    yield put({type: IndexActionTypes.FETCH_START});
    try {
        return yield call(get, `/admin/delUser?username=${username}`);
    } catch (err) {
        yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: '网络请求错误', msgType: 0});
    } finally {
        yield put({type: IndexActionTypes.FETCH_END})
    }
}

export function* deleteUserFlow () {
    while(true){
        let req = yield take(ManagerUserActionTypes.DELETE_USER);
        const pageNum = yield select(state=>state.pageNum);
        let res = yield call(deleteUser,req.username);
        if(res){
            if (res.code === 0) {
                yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: '删除成功!', msgType: 1});
                yield put({type:ManagerUserActionTypes.GET_ALL_USER,pageNum})
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
export function* getUserInfo (username) {
    yield put({type: IndexActionTypes.FETCH_START});
    try {
        return yield call(get, `/admin/getUserInfo?username=${username}`);
    } catch (err) {
        yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: '网络请求错误', msgType: 0});
    } finally {
        yield put({type: IndexActionTypes.FETCH_END})
    }
}

export function* getUserInfoFlow () {
    while (true) {

        let req = yield take(ManagerUserActionTypes.GET_USERINO);
        let res = yield call(getUserInfo, req.username);
        if (res.code === 0) {
            yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: res.message, msgType: 1});
           // yield put({type:ManagerTransactionsTypes.GET_ALL_TRANSACTIONS});
           let data = {};
         //  data.txhash1 = res.data.txhash1;
         console.log('info data数据',res.data)
         data.username = res.data.username;
         data.userType = res.data.type;
         data.userId = res.data._id;
         data.wallet = res.data.wallet;
         data.blockchainupload = res.data.blockchainupload;
         data.ipfsupload = res.data.ipfsupload;
         data.localupload = res.data.localupload;
         data.blockchaindownload = res.data.blockchaindownload;
         data.ipfsdownload = res.data.ipfsdownload;
         data.localdownload = res.data.localdownload;
          console.log('info data数据',data)
          
          // data.bcshow = res.data.bcshow
           yield put({type:ManagerUserActionTypes.RESOLVE_GET_USERINO,data:data})
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
export function* updateUser(data) {
    yield put({type: IndexActionTypes.FETCH_START});
    try {
        return yield call(post, '/admin/updateUser', data);
    } catch (err) {
        yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: '网络请求错误', msgType: 0});
    } finally {
        yield put({type: IndexActionTypes.FETCH_END})
    }
}


  
export function* updateUserFlow() {
        while (true) {
            let req = yield take(ManagerUserActionTypes.UPDATE_USER);
            let res = yield call(updateUser, req.data);
            if (res.code === 0) {
                yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: '更新成功!', msgType: 1});
                //yield put({type:ManagerUserActionTypes.GET_ALL_USER,pageNum})
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

    export function* updatePassword(data) {
        yield put({type: IndexActionTypes.FETCH_START});
        try {
            return yield call(post, '/admin/updatePassword', data);
        } catch (err) {
            yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: '网络请求错误', msgType: 0});
        } finally {
            yield put({type: IndexActionTypes.FETCH_END})
        }
    }
    
    
      
    export function* updatePasswordFlow() {
            while (true) {
                let req = yield take(ManagerUserActionTypes.UPDATE_PASSWORD);
                let res = yield call(updatePassword, req.data);
                if (res.code === 0) {
                    yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: '密码修改成功!', msgType: 1});
                    //yield put({type:ManagerUserActionTypes.GET_ALL_USER,pageNum})
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

    export function* logout(data) {
        yield put({type: IndexActionTypes.FETCH_START});
        try {
            return yield call(get, '/admin/logout?data=${data}');
        } catch (err) {
            yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: '网络请求错误', msgType: 0});
        } finally {
            yield put({type: IndexActionTypes.FETCH_END})
        }
    }
    
    
      
    export function* logoutFlow() {
            while (true) {
                let req = yield take(ManagerUserActionTypes.USER_LOGOUT);
                let res = yield call(logout, req.data);
                if (res.code === 0) {
                    yield put({type: IndexActionTypes.SET_MESSAGE, msgContent: '退出成功!', msgType: 1});
                   // location.replace('/');
                    setTimeout(function () {
                        location.replace('/');
                    }, 10);
                    yield put({type:ManagerUserActionTypes.GET_ALL_USER,pageNum})
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