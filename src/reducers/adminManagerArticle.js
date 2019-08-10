const initialState = {
    list: [],
    pageNum: 1,
    total:0 
};

export const actionTypes = {
   
    UPDATE_WALLET:"UPDATE_WALLET",
    
};

export const actions2 = {
    
  
    update_wallet:function (cost) {
        return{
            type:actionTypes.UPDATE_WALLET,
            cost
        }
    }
};

export function wallet(state = initialState, action) {
    switch (action.type) {
        case actionTypes.RESOLVE_GET_ALL_TRANSACTIONS:
            return {
                list: action.data.list,
                pageNum: action.data.pageNum,
                total:action.data.total
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