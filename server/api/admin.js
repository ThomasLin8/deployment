import Express from 'express';
import User from '../../models/user';
import { responseClient } from '../util';

const router = Express.Router();

// admin请求后台验证

router.use( (req,res,next) => {
    if(req.session.userInfo) {
        next()
    }else {
        res.send(responseClient(res,200,1,'身份信息不存在，请重新登录'));
    }
});

 router.use('/tags', require('./tags'));
// router.use('/article', require('./article'));

router.get('/getUsers', (req,res) => {
    let skip = (req.query.pageNum - 1) < 0 ? 0 : (req.query.pageNum - 1) * 10;
    let responseData = {
        total: 0,
        list: []
    };
    User.count()
        .then(count => {
              responseData.total = count;
              User.find(null,'_id username type password wallet blockchainupload ipfsupload localupload blockchaindownload ipfsdownload localdownload', {skip:skip, limit:10})
                  .then((result) => {
                        responseData.list = result;
                        responseClient(res,200,0,'',responseData)
                  })
                  .catch(err => {
                      responseClient(res);
                  })
        });
});
router.get('/delUser',(req,res) => {
    let username = req.query.username;
    console.log("req结构",req.query.username);
    User.remove({ username: username })
        .then(result => {
              if(result.result.n === 1){
                  responseClient(res,200,0,'删除成功');
              }else {
                  responseClient(res,200,1,'删除错误');
              }
        }).cancel(err => {
            responseClient(res);
        });
});



    router.post('/updateUser',(req, res) => {
        const username = req.body.username;
        const {password, type, blockchainupload, wallet, ipfsupload, localupload, blockchaindownload, ipfsdownload, localdownload, } = req.body;
        console.log("用户名",username);
        console.log("body结构",req.body);
        User.update({
            username:username},{
            password,
            type,
            wallet,
            blockchainupload,
            ipfsupload,
            localupload,
            blockchaindownload,
            ipfsdownload,
            localdownload
          }).then(result => {
            responseClient(res,200,0,'更新成功',result)
            console.log('结果',result);
            
        }).cancel(err => {
            console.log(err);
            responseClient(res);
        });
    });
    router.get('/getUserInfo', (req,res) => {
        let username = req.query.username;
    console.log('用户名',username)
    // User.findOne({username: username})
    //     .then(count => {
    //           //responseData.total = count;
    //           if(count){
        User.findOne({username: username})
              .then(userInfo => {
                let data = {};
                data.username = userInfo.username;
                data.userType = userInfo.type;
                data.userId = userInfo._id;
                data.wallet = userInfo.wallet;
                data.blockchainupload = userInfo.blockchainupload;
                data.ipfsupload = userInfo.ipfsupload;
                data.localupload = userInfo.localupload;
                data.blockchaindownload = userInfo.blockchaindownload;
                data.ipfsdownload = userInfo.ipfsdownload;
                data.localdownload = userInfo.localdownload;
                console.log('查询及时user数据',data)
                responseClient(res, 200, 0, '', data);
                return;
                  })
                  .catch(err => {
                      responseClient(res);
                  })
        //         }
        // });
});
    router.post('/updatePassword',(req, res) => {
        const username = req.session.userInfo.username;
        let {  password,newpassword, passwordRe } = req.body;
  
        if (newpassword !== passwordRe) {
            responseClient(res,200,1,'两次密码不一致');
            return;
        }
        else if (password == newpassword ) {
            responseClient(res,200,1,'新旧密码不可以相同');
            return;
        }
    else{ console.log("用户名",username);
    console.log("body结构1",password);
    console.log("body结构2",passwordRe);

    User.update({
    username,
    password,
},{
    password:passwordRe
      }).then(result => {
        responseClient(res,200,0,'更新成功',result)
        console.log('结果',result);
        
    }).cancel(err => {
        console.log(err);
        responseClient(res,200,1,'更新失败',result)
    });}
       

       
    });
    
    router.get('/logout',function (req,res) {
       
       // responseClient(res,200,0,'成功退出');
        req.session.destroy();
        
        if(! req.session === undefined){
            responseClient(res,200,1,'退出未成功，请重试')
        }else{
            responseClient(res,200,0,'成功退出')
        }
        //res.redirect('/');
       
    });
module.exports = router;
