import {fork} from 'redux-saga/effects'
import {loginFlow, registerFlow, user_auth} from './homeSaga'
import {get_all_users_flow, deleteUserFlow,updateUserFlow, logoutFlow, updatePasswordFlow,getUserInfoFlow,getusernameTransactionsFlow} from './adminManagerUsersSaga'
import {getAllTransactionsFlow, addTransactionFlow, updateWalletFlow,ipfsFindFlow,addLocalFlow,txFindFlow,deleteTransactionFlow,
    bcFindFlow,getfileTransactionsFlow,getenipfshashTransactionsFlow,gettxhashTransactionsFlow} from './adminManagerTagsSaga'
//import {saveArticleFlow} from './blockchainuploadSaga'
//import {getArticleListFlow} from './adminManagerArticleSaga'
//import {getArticlesListFlow,getArticleDetailFlow} from './frontSaga'

export default function* rootSaga() {
    yield  fork(loginFlow);
    yield  fork(logoutFlow);
    yield  fork(registerFlow);
    yield  fork(user_auth);
    yield fork(get_all_users_flow);
    yield fork(getAllTransactionsFlow);
    yield fork(getfileTransactionsFlow);
    yield fork(getenipfshashTransactionsFlow);
    yield fork(gettxhashTransactionsFlow);
    yield fork(addTransactionFlow);
    yield fork(updateWalletFlow);
    yield fork(ipfsFindFlow);
    yield fork(bcFindFlow);
    yield fork(txFindFlow);
    yield fork(updatePasswordFlow);
    yield fork(deleteTransactionFlow);
   yield fork(getUserInfoFlow);
   yield fork(getusernameTransactionsFlow);
   // yield fork(addLocalFlow);
   // yield fork(saveArticleFlow);
   // yield fork(getArticleListFlow);
   // yield fork(deleteArticleFlow);
   // yield fork(getArticlesListFlow);
   // yield fork(getArticleDetailFlow);
    yield fork(updateUserFlow);
    yield fork(deleteUserFlow);
}
