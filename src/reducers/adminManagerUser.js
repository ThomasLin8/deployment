const initialState = {
    list: [],
    pageNum: 1,
    total:0,
    password:'',
    utype:'',
    uwallet:'',
    ublockchainupload:'',
    uipfsupload:'',
    ulocalupload:'',
    ublockchaindownload:'',
    uipfsdownload:'',
    ulocaldownload:''
    
    
     
};
export const actionTypes = {
    'GET_ALL_USER': "GET_ALL_USER",
    'RESOLVE_GET_ALL_USERS': "RESOLVE_GET_ALL_USERS",
    'DELETE_USER':"DELETE_USER",
    'UPDATING_PASSWORD':"UPDATING_PASSWORD",
    'UPDATING_TYPE':"UPDATING_TYPE",
    'UPDATING_BLOCKCHAINUPLOAD':"UPDATING_BLOCKCHAINUPLOAD",
    'UPDATING_IPFSUPLOAD':"UPDATING_IPFSUPLOAD",
    'UPDATING_LOCALUPLOAO':"UPDATING_LOCALUPLOAD",
    'USER_LOGOUT': "USER_LOGOUT",
    'UPDATE_USER':"UPDATE_USER",
    'UPDATE_PASSWORD':"UPDATE_PASSWORD",
    "GET_USERINO":"GET_USERINO",
    "RESOLVE_GET_USERINO":"RESOLVE_GET_USERINO"


};

export const actions = {
    get_all_users: function (pageNum=1) {
        return {
            type: actionTypes.GET_ALL_USER,
            pageNum:pageNum
        }
    },
    update_user: function (data) {
        return {
            type: actionTypes.UPDATE_USER,
            data
        }
    },
    update_password: function (data) {
        return {
            type: actionTypes.UPDATE_PASSWORD,
            data
        }
    },
    get_logout: function (data) {
        return {
            type: actionTypes.USER_LOGOUT,
            data
        }
    },
    delete_user: function (username) {
        return {
            type: actionTypes.DELETE_USER,
            username
        }
    },
    get_userinfo: function (username) {
        return {
            type: actionTypes.GET_USERINO,
            username
        }
    }
};

export function users(state = initialState, action) {
    switch (action.type) {
        case actionTypes.RESOLVE_GET_ALL_USERS:
            return {
                list: action.data.list,
                pageNum: action.data.pageNum,
                total:action.data.total
            };
        case actionTypes.RESOLVE_GET_USERINO:
            return {
                utype:action.data.utype,
                uwallet:action.data.wallet,
                ublockchainupload:action.data.blockchaindownload,
                uipfsupload:action.data.ipfsdownload,
                ulocalupload:action.data.localdownload,
                ublockchaindownload:action.data.blockchaindownload,
                uipfsdownload:action.data.ipfsdownload,
                ulocaldownload:action.data.localdownload
    
            };
        default:
            return state;

    }
}
