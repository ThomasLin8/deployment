module.exports = {
    host:process.env.HOST || '39.96.12.134',
    port:process.env.PORT || (process.env.NODE_ENV === 'production' ? 8081 : 3000),
    apiHost:process.env.APIHOST || '127.0.0.1',
    apiPort:process.env.APIPORT || '3030',
    dbHost:'localhost',
    dbPort:'27017',
    app:{
        //title:'Sam\'s Blog',
        title: 'react app',
        description:'A react app',
        head:{
            titleTemplate:'blog',
            meta:[
                {
                    name:'description',
                    content:'react app'
                },
                {
                    charset:'utf-8'
                }
            ]
        }
    }
};
