module.exports = {
    host:process.env.HOST || '127.0.0.1',
    port:process.env.PORT || (process.env.NODE_ENV === 'production' ? 8081 : 3001),
    apiHost:process.env.APIHOST || '127.0.0.1',
    apiPort:process.env.APIPORT || '3031',
    dbHost:'localhost',
    dbPort:'27017',
    app:{
        title: '区块链存证',
        description:'A blockchain dapp',
        head:{
            titleTemplate:'dapp',
            meta:[
                {
                    name:'description',
                    content:'react dapp'
                },
                {
                    charset:'utf-8'
                }
            ]
        }
    }
};
