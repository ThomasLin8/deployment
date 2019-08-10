import Express from 'express'
import bodyParser from 'body-parser'
const router = Express.Router();
import Ipfstransaction from '../../models/ipfstransaction'
import {responseClient} from '../util'
import User from '../../models/user'


//const urlencodedParser = bodyParser.urlencoded({ extended: false })

     router.post('/addTransaction', function (req, res) {
        let {transaction} = req.body;
        console.log("发送的hash数据",transaction);
        const username = req.session.userInfo.username;
        console.log('用户名:',username)
        
        //blockchainupload  = req.session.userInfo.blockchainupload;
        

        User.findOne({username:username}).then(userInfo=> {
            console.log('权限:',blockchainupload)
            const blockchainupload = userInfo.blockchainupload;
            console.log(blockchainupload === 'true'); 
            if (blockchainupload === 'true') 
            {
             Ipfstransaction.findOne({
                 transaction: transaction
             }).then(result => {
                 if (!result) {



                     let ipfstransaction = new Ipfstransaction({
                         username,
                         transaction
                     });
                     ipfstransaction.save()
                         .then(data => {
                             responseClient(res, 200, 0, '添加成功', data);
                         }).catch(err => {
                         throw err
                     })
                 } else {
                     responseClient(res, 200, 1, '该交易已存在');
                 }
             }).catch(err => {
                 responseClient(res);
             });
         }
            
            
         else 
         {
             console.log('区块链权限',blockchainupload);
             res.send(responseClient(res,200,1,'没有对应权限，请联系管理员获取权限。'));
             
         }
        });
   
        
    });

    router.get('/updateWallet',function (req, res) {
        let cost = req.query.wallet;
        console.log("花销cost",cost);
        const username = req.session.userInfo.username;
        console.log("用户名",username);

        User.findOne({username:username}).then(result => {
            if (result) {
        console.log('查询的result',result);
        const wallet = result.wallet;
        console.log("钱包额度",wallet);
        const balance = wallet - cost/10000 ;

        if(balance > 0){
            User.updateOne({username:username},({wallet:balance}))
                        .then(data => {
                            responseClient(res, 200, 0, '扣费成功', data);
                        }).catch(err => {
                        throw err
                    })
                } 
    
        else
        {
            responseClient(res, 200, 1, '账户余额不够，请充值');
        }

            }
            else{
                responseClient(res, 200, 1, '扣费账户不存在');
        }

        }) .catch(err => {
            responseClient(res);

        });
    });


    router.get('/getAllTransactions', (req,res) => {
        let user = req.session.userInfo.username;
        let skip = (req.query.pageNum - 1) < 0 ? 0 : (req.query.pageNum - 1) * 10;
        let responseData = {
            total: 0,
            list: []
        };
        Ipfstransaction.count()
        .then(count => {
            responseData.total = count;
           Ipfstransaction.find({username: user},'_id username transaction date', {skip:skip, limit:10})
                .then((result) => {
                      responseData.list = result;
                      responseClient(res,200,0,'',responseData)
                })
                .catch(err => {
                    responseClient(res);
                })
      });
});

module.exports = router;
