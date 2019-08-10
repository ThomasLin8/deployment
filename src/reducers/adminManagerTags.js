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
    balance:[],
   // bcutxhash:[],
    //successshow:[],
    txbchash: [],
    txipfshash1:[],
    txgasused: [],
};

export const actionTypes = {
    TXHASH_FIND:"TXHASH_FIND",
    RESOLVE_TXHASH_FIND:"RESOLVE_TXHASH_FIND",
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
    DELETE_TRANSACTION:"DELETE_TRANSACTION",
  
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
    delete_transction: function (ID) {
        return {
            type: actionTypes.DELETE_TRANSACTION,
            ID
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
                txbchash: action.data.txbchash,
                txipfshash:action.data. txipfshash,
                txgasused: action.data.txgasused,
   
            };

        case actionTypes.RESOLVE_UPDATE_WALLET:
            return {
                //bcutxhash: action.data.bcutxhash,
               // successshow: action.data.successshow,
                  balance: action.data.balance,
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