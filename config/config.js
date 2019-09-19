module.exports = {
    host:process.env.HOST || '39.106.213.201',
    port:process.env.PORT || (process.env.NODE_ENV === 'production' ? 8081 : 3001),
    apiHost:process.env.APIHOST || '39.106.213.201',
    apiPort:process.env.APIPORT || '3031',
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