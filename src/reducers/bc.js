const initialState = {
    list: [],
    pageNum: 1,
    total:0,
    uploadipfs:[],
    savedipfs:[],
    bcuipfs: [],
    bcipfs: [],
    bctxhash:[],
    ipfsshow:[],
    bcshow:[],
    bcutxhash:[],
    successshow:[],
    txhash1: [],
    bchash1: [],
    ipfshash1:[],
    gasused1: [],
};

export const actionTypes = {
    GET_ALL_TRANSACTIONS:"GET_ALL_TRANSACTIONS",
    RESOLVE_GET_ALL_TRANSACTIONS: "RESOLVE_GET_ALL_TRANSACTIONS",
    DELETE_TAG:"DELETE_TAG",
    UPDATE_WALLET:"UPDATE_WALLET",
    RESOLVE_UPDATE_WALLET:" RESOLVE_UPDATE_WALLET",
    ADD_TRANSACTIONS:"ADD_TRANSACTIONS",
    ADD_LOCAL:"ADD_LOCAL",
    IPFS_FIND:"IPFS_FIND",
    RESOLVE_IPFS_FIND:"RESOLVE_IPFS_FIND",
    BC_FIND:"BC_FIND",
    RESOLVE_BC_FIND:"RESOLVE_BC_FIND",
    TXHASH_FIND:"TXHASH_FIND",
    RESOLVE_TXHASH_FIND:"RESOLVE_TXHASH_FIND",
};

export const actions = {
    get_all_transactions:function (pageNum=1) {
        return{
            type:actionTypes.GET_ALL_TRANSACTIONS,
            pageNum:pageNum
        }
    },
    // delete_tag:function (name) {
    //     return{
    //         type:actionTypes.DELETE_TAG,
    //         name
    //     }
    // },
    update_wallet:function (transactiondata) {
        return{
            type:actionTypes.UPDATE_WALLET,
            transactiondata
        }
    },

    add_transaction:function (transaction) {
        return{
            type:actionTypes.ADD_TRANSACTIONS,
            transaction
        }
    },

    add_local:function (data) {
        return{
            type:actionTypes.ADD_LOCAL,
            data
        }
    },

    ipfs_find:function (ipfshash) {
        return{
            type:actionTypes.IPFS_FIND,
            ipfshash
        }
    },
    bc_find:function (ipfshash) {
        return{
            type:actionTypes.BC_FIND,
            ipfshash
        }
    },
    txhash_find:function (txhash) {
        return{
            type:actionTypes.TXHASH_FIND,
            txhash
        }
    },

};

export function transactions(state = initialState, action) {
    switch (action.type) {
        case actionTypes.RESOLVE_GET_ALL_TRANSACTIONS:
            return {
                list: action.data.list,
                pageNum: action.data.pageNum,
                total:action.data.total
            };
        case actionTypes.RESOLVE_IPFS_FIND:
            return {
                uploadipfs: action.data.uploadipfs,
                ipfsshow:action.data.ipfsshow,
                savedipfs: action.data.savedipfs
                
            };   
        case actionTypes.RESOLVE_BC_FIND:
            return {
                bcuipfs: action.data.bcuipfs,
                bcipfs: action.data.bcipfs,
                bcshow:action.data.bcshow,
                bctxhash: action.data.bctxhash
                
            }; 
        case actionTypes.RESOLVE_TXHASH_FIND:
            return {
                txhash1: action.data.txhash1,
                bchash1: action.data.bchash1,
                ipfshash1:action.data.ipfshash1,
                gasused1: action.data.gasused1,
               
              
                
            };
        case actionTypes.RESOLVE_UPDATE_WALLET:
            return {
                bcutxhash: action.data.bcutxhash,
                successshow: action.data.successshow,
                
                
            }; 
        default:
            return state;

    }
};
// export function reducer(state=initialState,action) {
//     switch (action.type) {
//         case actionTypes.RESOLVE_GET_ALL_TRANSACTIONS:
//             return {
//                 list: action.data.list,
//                 pageNum: action.data.pageNum,
//                 total:action.data.total
//             };
//         default:
//             return  state;
//     }
// }