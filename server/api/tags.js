import Express from 'express'
import bodyParser from 'body-parser'
const router = Express.Router();
import Ipfstransaction from '../../models/ipfstransaction'
//import Localencrypt from '../../models/localencrypt'
//import {responseClient} from '../util'
import User from '../../models/user'
import { MD5_SUFFIX, responseClient, aesEncrypt, aesDecrypt } from '../util'


const Web3 = require('web3');
const InputDataDecoder = require('input-data-decoder-ethereum');
//const simpleStorage = contract(SimpleStorageContract)
//配置web3的httpprovider，采用infura
const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8546"));
const Blind = require('blind');
const tokenAbi = [
    {
        "constant": false,
        "inputs": [
            {
                "name": "x",
                "type": "string"
            }
        ],
        "name": "set",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "get",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
]
const decoder = new InputDataDecoder(tokenAbi);
const contractAddr = '0x28b1934ad7251eacb4a1e7a2b1ac968c7c0cdd3a';//合约地址
//0xF9448B279F57AD5073d996b1BF65a7d18878A599
//"0xc411f680ae76e7457112ddd4a231a1ab71ed9b72";
//"0x6f12fbbc9eba17d78a357f042682d6a0db57a1ae";
web3.eth.defaultAccount = '0x1aB1DC744b964f5c5023d92666D7f738Eb04B203';//设置使用的账户
//0xc411f680ae76e7457112ddd4a231a1ab71ed9b72
//初始化合约信息，便于后面合约交互的abi编码发送信息
const mycontract = new web3.eth.Contract(tokenAbi,contractAddr,{
  from: '0x1aB1DC744b964f5c5023d92666D7f738Eb04B203',
  gasPrice: '1000000000'
} );
//const urlencodedParser = bodyParser.urlencoded({ extended: false })

     router.post('/addTransaction', function (req, res) {
        let {transaction,ipfshash,date} = req.body;
        // let {ipfshash,date} = req.body;
        // let {ipfshash,date} = req.body;
       const enipfshash = new Blind({ encryptKey: 'PZ3oXv2v6Pq5HAPFI9NFbQ==' }).encrypt(ipfshash);
       // const  enipfshash = aesEncrypt(ipfshash);
        console.log("发送的body数据",req.body);
        console.log("发送的hash数据",transaction);
        console.log("发送的enipfshash数据",enipfshash);
        const username = req.session.userInfo.username;
        console.log('用户名:',username)
       
        //blockchainupload  = req.session.userInfo.blockchainupload;
        

        User.findOne({username:username}).then(userInfo=> {
            console.log('权限:',localupload)
            const localupload = userInfo.localupload;
            console.log(localupload === 'true'); 
            if (localupload === 'true') 
            {
             Ipfstransaction.findOne({
                 transaction: transaction
             }).then(result => {
                 if (!result) {



                     let ipfstransaction = new Ipfstransaction({
                         username,
                         transaction,
                         ipfshash,
                         enipfshash,
                         date
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
             console.log('区块链权限',localupload);
             res.send(responseClient(res,200,1,'没有对应权限，请联系管理员获取权限。'));
             
         }
        });
   
        
    });

    // outer.post('/addLocal', function (req, res) {
    //     let {ipfshash,date} = req.body;
    //     // let {ipfshash,date} = req.body;
    //     // let {ipfshash,date} = req.body;
    //     console.log("发送的body数据",req.body);
    //    // console.log("发送的hash数据",transaction);
    //     console.log("发送的hash数据",ipfshash);
    //     const username = req.session.userInfo.username;
    //     console.log('用户名:',username)
    //     ipfshash = aesEncrypt(ipfshash)
    //     //blockchainupload  = req.session.userInfo.blockchainupload;
        

    //     User.findOne({username:username}).then(userInfo=> {
    //         console.log('权限:',localdownload)
    //         const localdownload = userInfo.localdownload;
    //         console.log(localdownload === 'true'); 
    //         if (localdownload === 'true') 
    //         {
    //             Localencrypt.findOne({
    //              ipfshash: ipfshash
    //          }).then(result => {
    //              if (!result) {



    //                  let Localencrypt = new Localencrypt({
    //                      username,
    //                      ipfshash,
    //                      date
    //                  });
    //                  Localencrypt.save()
    //                      .then(data => {
    //                          responseClient(res, 200, 0, '添加成功', data);
    //                      }).catch(err => {
    //                      throw err
    //                  })
    //              } else {
    //                  responseClient(res, 200, 1, '该数据已存在');
    //              }
    //          }).catch(err => {
    //              responseClient(res);
    //          });
    //      }
            
            
    //      else 
    //      {
    //          console.log('本地权限',localdownload);
    //          res.send(responseClient(res,200,1,'没有对应权限，请联系管理员获取权限。'));
             
    //      }
    //     });
   
        
    // });

    router.post('/updateWallet',function (req, res) {
        let {cost,sendata} = req.body;
        let txhash;
        console.log("结构体",req.body);
        console.log("花销cost",cost);
        const username = req.session.userInfo.username;
        console.log("用户名",username);
        let responseData ={
            //bcutxhash:[],
            balance:[],
            //successshow:false
        }


        User.findOne({username:username}).then(result => {
if (result) {
        console.log('查询的result',result);
        const wallet = result.wallet;
        console.log("钱包额度",wallet);
       //const balance = wallet - cost/1000 ;
        const balance = wallet - cost ;
        responseData.balance = balance;
        console.log("钱包余额",balance);
        const blockchainupload = result.blockchainupload;
    if(blockchainupload === 'true'){

        if(balance > 0){
            
            User.updateOne({username:username},({wallet:balance}))
                        .then(() => {
                            responseData.successshow = true; 
                            responseClient(res, 200, 0, '扣费成功，区块链交易完成', responseData);
                        }).catch(err => {
                        throw err
                    })
                } 
    
        else
        {
            responseClient(res, 200, 1, '交易未成功，余额不足请充值',responseData);
        }

    }

    else{
         responseClient(res, 200, 1, '没有区块链上传权限，请联系管理员获取');
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
           Ipfstransaction.find({username: user},'_id username transaction enipfshash date', {skip:skip, limit:10})
                .then((result) => {
                      responseData.list = result;
                      responseClient(res,200,0,'',responseData)
                })
                .catch(err => {
                    responseClient(res);
                })
      });
});

router.get('/IPFSfind', function (req, res) {
    let ipfshash = req.query.ipfshash;
    //console.log("发送的body数据",req.body);   
    console.log("发送的ipfshash数据",ipfshash);  
    const username = req.session.userInfo.username;
    console.log('用户名:',username)


    let responseData = {
        uploadipfs: ipfshash,
        // ipfsshow:true,
        savedipfs: []
    };

    User.findOne({username:username}).then(userInfo=> {
        
        const ipfsdownload= userInfo.ipfsdownload;
        console.log('权限:',ipfsdownload)
        console.log(ipfsdownload === 'true'); 
        if (ipfsdownload === 'true') 
        {
         Ipfstransaction.findOne({
            ipfshash: ipfshash
         }).then(result => {
             if (result) {
                responseData.savedipfs = result.ipfshash;
                responseClient(res, 200, 0, 'IPFS已存储该文件，可通过游览器访问查询',responseData);
             } else {
                 responseClient(res, 200, 1, '该文件未上传到IPFS或上传文件已遭修改与存储文件不符。');
             }
         }).catch(err => {
             responseClient(res);
         });
     }
        
        
     else 
     {
         console.log('区块链权限',ipfsdownload);
         res.send(responseClient(res,200,1,'没有对应权限，请联系管理员获取权限。'));
         
     }
    });

    
});

router.get('/Bcfind', function (req, res) {
    let ipfshash = req.query.ipfshash;
    //console.log("发送的body数据",req.body);   
    console.log("发送的ipfshash数据",ipfshash);  
    const username = req.session.userInfo.username;
    console.log('用户名:',username)
    //console.log('判断相等',imghash === ipfshash)
    //blockchainupload  = req.session.userInfo.blockchainupload;
    let responseData = {
        bcuipfs: ipfshash,
        bcipfs: [],
        // bcshow: true,
         bctxhash: []
    };

    User.findOne({username:username}).then(userInfo=> {
        
        const blockchaindownload= userInfo.blockchaindownload;
        console.log('权限:',blockchaindownload)
        console.log(blockchaindownload === 'true'); 
        if (blockchaindownload === 'true') 
        {
         Ipfstransaction.findOne({
            ipfshash: ipfshash
         },' transaction').then(result => {
             if (result) {
                 const txhash  = result.transaction;
                 responseData.bctxhash = txhash;
                 console.log('交易信息',responseData.bctxhash)
                 const txinfo = web3.eth.getTransaction(txhash);
                 txinfo.then((data) => { 
                     console.log('tx hash查找到的交易:',data)
                     const trdata = data.input;
                     const dedata = decoder.decodeData(trdata);
                     console.log('解码数据',dedata);
                     let bchash = dedata.inputs;
                     bchash = String(bchash)
                    // bchash = bchash.match(/'(\S*)'/)[1];
                    console.log(typeof bchash);
                     console.log('解码数据',bchash);
                     console.log('传来的ipfshash',ipfshash)
                     console.log(ipfshash === bchash)
                     responseData.bcipfs = bchash;
                     if(ipfshash === bchash)
                    
                      responseClient(res, 200, 0, '区块链已存储了该文件的Hash,验证为真',responseData);
                     else
                      responseClient(res, 200, 1, '区块链未存储了该文件的Hash,验证为假');

                    })
                 
                 //console.log('交易信息获得',)
                 //responseClient(res, 200, 0, '区块链已存储了该文件的Hash,验证为真');
                //   console.log('查询结果',result.transaction)
                //   txhash = result.transaction
                // web3.eth.getTransaction(result.transaction).then (
                //     (err,rdata) => {
                //         if(err)
                //         {responseClient(res, 200, 0, '查询出错，请再试一次');}
                //         else{
                //         console.log('tx hash查找到的交易:',rdata);
                //         const trdata = rdata.input;
                //           console.log('解码前数据:', trdata);
                //           const dedata = decoder.decodeData(trdata);
                //         if(dedata === ipfshash)
                //         {responseClient(res, 200, 0, '区块链已存储了该文件的Hash,验证为真');}
                //         else
                //         {responseClient(res, 200, 1, '区块链未存储了该文件的Hash,验证为假');}
                //     }
                // }
                //  )
               
                
             } else {
                 responseClient(res, 200, 1, '该文件未上传到区块链或上传文件已遭修改与存储文件不符。');
             }
         }).catch(err => {
             responseClient(res);
         });
     }
        
        
     else 
     {
         console.log('区块链权限',blockchaindownload);
         res.send(responseClient(res,200,1,'没有对应权限，请联系管理员获取权限。'));
         
     }
    });

    
});

router.get('/txfind', function (req, res) {
    let txhash = req.query.txhash;
    //console.log("发送的body数据",req.body);   
    console.log("发送的ipfshash数据",txhash);  
    const username = req.session.userInfo.username;
    console.log('用户名:',username)
   

    let responseData = {
        msgshow:null,
        txbchash: [],
        txipfshash:[],
        txgasused: []
    };
    // Ipfstransaction.findOne({username:username}).then(Info=> {
        // console.log('Info信息:',Info)

        // if (Info) 
        // {
                //const txinfo = web3.eth.getTransaction(txhash);
                web3.eth.getTransaction(txhash).then((data) => { 

               
                console.log('tx hash查找到的交易:',data)
                const trdata = data.input;
                const dedata = decoder.decodeData(trdata);
                //console.log('解码数据',dedata);
                let bchash = dedata.inputs;
                bchash = String(bchash)
               // bchash = bchash.match(/'(\S*)'/)[1];
               //console.log(typeof bchash);
              //  console.log('解码数据',bchash);

                responseData.txipfshash = bchash;
                console.log('res数据1',responseData.txipfshash);
                responseData.txbchash = data.blockHash;
                console.log('res数据2',responseData.txbchash);
                responseData.txgasused = data.gas;
                responseData.msgshow = 'true'
            })  

            setTimeout(()=>{
                if(responseData.msgshow === 'true') 
               {
                console.log('疯狂的数据',responseData);
               responseClient(res, 200, 0, '查询成功',responseData);
            }
               else{
              responseClient(res, 200, 1, '查询失败');
            }
            },300)

});
router.get('/delTransaction',(req,res) => {
    let ID = req.query.ID;
    console.log("req结构",req.query.ID);
    Ipfstransaction.remove({ _id: ID })
        .then(result => {
            console.log('查询数据',result)
              if(result){
                  responseClient(res,200,0,'删除成功');
              }else {
                  responseClient(res,200,1,'删除错误');
              }
        }).cancel(err => {
            responseClient(res);
        });
});


module.exports = router;
